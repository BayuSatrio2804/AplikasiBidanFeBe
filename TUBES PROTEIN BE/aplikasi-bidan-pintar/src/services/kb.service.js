/**
 * KB (Family Planning) Service - REBUILT
 * Handles all KB-related database operations
 * Maps frontend fields directly to new database structure
 */

const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const auditService = require('./audit.service');

/**
 * Create KB registration with related records
 * Uses transaction to ensure data consistency
 * @param {Object} data - KB registration data from frontend
 * @param {string} userId - User performing the action
 * @returns {Object} Created registration data
 */
const createRegistrasiKB = async (data, userId) => {
  const {
    // Mother (Ibu) information
    nama_ibu, nik_ibu, umur_ibu, td_ibu, bb_ibu, alamat, nomor_hp,
    // Spouse (Ayah) information
    nama_ayah, nik_ayah, umur_ayah, td_ayah, bb_ayah,
    // Service information
    jenis_layanan, tanggal, metode, 
    // Registration and follow-up
    nomor_registrasi_lama, nomor_registrasi_baru, kunjungan_ulang, catatan
  } = data;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Find or create patient (mother)
    let id_pasien;
    const [existingPasien] = await connection.query(
      'SELECT id_pasien FROM pasien WHERE nik = ?',
      [nik_ibu]
    );

    if (existingPasien.length > 0) {
      id_pasien = existingPasien[0].id_pasien;
      await connection.query(
        'UPDATE pasien SET nama = ?, umur = ?, alamat = ?, no_hp = ? WHERE id_pasien = ?',
        [nama_ibu, umur_ibu, alamat, nomor_hp || null, id_pasien]
      );
    } else {
      id_pasien = uuidv4();
      await connection.query(
        'INSERT INTO pasien (id_pasien, nama, nik, umur, alamat, no_hp) VALUES (?, ?, ?, ?, ?, ?)',
        [id_pasien, nama_ibu, nik_ibu, umur_ibu, alamat, nomor_hp || null]
      );
    }

    // 2. Create examination record with SOAP format constructed from frontend data
    const id_pemeriksaan = uuidv4();
    
    // Construct SOAP fields from frontend data
    const subjektif_final = `Kunjungan KB Metode: ${metode || '-'}`;
    const objektif_final = `TD Ibu: ${td_ibu || '-'}, BB Ibu: ${bb_ibu || '-'}`;
    const analisa_final = catatan || '';
    const tatalaksana_final = metode ? `Metode KB: ${metode}` : '';

    await connection.query(
      `INSERT INTO pemeriksaan (id_pemeriksaan, id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana, tanggal_pemeriksaan)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_pemeriksaan, id_pasien, jenis_layanan, subjektif_final, objektif_final, analisa_final, tatalaksana_final, tanggal]
    );

    // 3. Create KB-specific record with new table structure
    const id_kb = uuidv4();
    await connection.query(
      `INSERT INTO layanan_kb (
        id_kb, id_pemeriksaan, nomor_registrasi_lama, nomor_registrasi_baru,
        metode, td_ibu, bb_ibu, nama_ayah, nik_ayah, umur_ayah, td_ayah, bb_ayah,
        kunjungan_ulang, catatan
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_kb, id_pemeriksaan,
        nomor_registrasi_lama || null, nomor_registrasi_baru || null,
        metode,
        td_ibu || null, bb_ibu || null,
        nama_ayah || null, nik_ayah || null, umur_ayah || null,
        td_ayah || null, bb_ayah || null,
        kunjungan_ulang || null, catatan || null
      ]
    );

    await connection.commit();
    await auditService.recordDataLog(userId, 'CREATE', 'layanan_kb', id_kb);

    return { 
      id_kb, 
      id_pemeriksaan, 
      id_pasien,
      message: 'Registrasi KB berhasil disimpan'
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Get KB record by ID
 * Returns data mapped to EXACT frontend field names from handleEdit
 */
const getKBById = async (id_pemeriksaan) => {
  const query = `
    SELECT 
      p.id_pemeriksaan,
      DATE_FORMAT(p.tanggal_pemeriksaan, '%Y-%m-%d') as tanggal_pemeriksaan,
      p.jenis_layanan,
      pas.nama, 
      pas.nik, 
      pas.umur, 
      pas.alamat, 
      pas.no_hp,
      kb.id_kb, 
      kb.nomor_registrasi_lama as no_reg_lama, 
      kb.nomor_registrasi_baru as no_reg_baru, 
      kb.metode,
      kb.metode as metode_kb,
      kb.td_ibu, 
      kb.bb_ibu, 
      kb.nama_ayah as nama_suami, 
      kb.nik_ayah as nik_suami, 
      kb.umur_ayah as umur_suami, 
      kb.td_ayah, 
      kb.bb_ayah,
      DATE_FORMAT(kb.kunjungan_ulang, '%Y-%m-%d') as kunjungan_ulang,
      kb.catatan
    FROM pemeriksaan p
    LEFT JOIN pasien pas ON p.id_pasien = pas.id_pasien
    LEFT JOIN layanan_kb kb ON p.id_pemeriksaan = kb.id_pemeriksaan
    WHERE p.id_pemeriksaan = ? AND p.jenis_layanan = 'KB'
  `;
  const [rows] = await db.query(query, [id_pemeriksaan]);
  return rows[0] || null;
};

/**
 * Update KB registration
 * @param {string} id_pemeriksaan - Pemeriksaan ID
 * @param {Object} data - Updated data from frontend
 * @param {string} userId - User performing the update
 * @returns {Object} Updated KB data
 */
const updateRegistrasiKB = async (id_pemeriksaan, data, userId) => {
  const {
    nama_ibu, nik_ibu, umur_ibu, td_ibu, bb_ibu, alamat, nomor_hp,
    nama_ayah, nik_ayah, umur_ayah, td_ayah, bb_ayah,
    tanggal, metode, nomor_registrasi_lama, nomor_registrasi_baru, kunjungan_ulang, catatan
  } = data;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Get existing pemeriksaan
    const [existingPemeriksaan] = await connection.query(
      'SELECT id_pasien FROM pemeriksaan WHERE id_pemeriksaan = ?',
      [id_pemeriksaan]
    );

    if (!existingPemeriksaan[0]) {
      throw new Error('Data pemeriksaan tidak ditemukan');
    }

    const id_pasien = existingPemeriksaan[0].id_pasien;

    // Update patient data
    await connection.query(
      'UPDATE pasien SET nama = ?, nik = ?, umur = ?, alamat = ?, no_hp = ? WHERE id_pasien = ?',
      [nama_ibu, nik_ibu, umur_ibu, alamat, nomor_hp || null, id_pasien]
    );

    // Update pemeriksaan with SOAP format
    const subjektif_final = `Kunjungan KB Metode: ${metode || '-'}`;
    const objektif_final = `TD Ibu: ${td_ibu || '-'}, BB Ibu: ${bb_ibu || '-'}`;
    const analisa_final = catatan || '';
    const tatalaksana_final = metode ? `Metode KB: ${metode}` : '';

    await connection.query(
      `UPDATE pemeriksaan SET subjektif = ?, objektif = ?, analisa = ?, tatalaksana = ?, tanggal_pemeriksaan = ?
       WHERE id_pemeriksaan = ?`,
      [subjektif_final, objektif_final, analisa_final, tatalaksana_final, tanggal, id_pemeriksaan]
    );

    // Update layanan_kb with new table structure
    await connection.query(
      `UPDATE layanan_kb SET 
        nomor_registrasi_lama = ?, nomor_registrasi_baru = ?,
        metode = ?, td_ibu = ?, bb_ibu = ?,
        nama_ayah = ?, nik_ayah = ?, umur_ayah = ?, td_ayah = ?, bb_ayah = ?,
        kunjungan_ulang = ?, catatan = ?
       WHERE id_pemeriksaan = ?`,
      [
        nomor_registrasi_lama || null, nomor_registrasi_baru || null,
        metode, td_ibu || null, bb_ibu || null,
        nama_ayah || null, nik_ayah || null, umur_ayah || null, td_ayah || null, bb_ayah || null,
        kunjungan_ulang || null, catatan || null,
        id_pemeriksaan
      ]
    );

    await connection.commit();
    await auditService.recordDataLog(userId, 'UPDATE', 'layanan_kb', id_pemeriksaan);

    return getKBById(id_pemeriksaan);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Delete KB registration
 * @param {string} id_pemeriksaan - Pemeriksaan ID
 * @param {string} userId - User performing the deletion
 */
const deleteRegistrasiKB = async (id_pemeriksaan, userId) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Delete layanan_kb
    await connection.query('DELETE FROM layanan_kb WHERE id_pemeriksaan = ?', [id_pemeriksaan]);

    // Delete pemeriksaan
    await connection.query('DELETE FROM pemeriksaan WHERE id_pemeriksaan = ?', [id_pemeriksaan]);

    await connection.commit();
    await auditService.recordDataLog(userId, 'DELETE', 'layanan_kb', id_pemeriksaan);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Get all KB records (with optional search/filter)
 * Returns fields expected by frontend fetchRiwayatPelayanan
 */
const getAllKB = async (search = '') => {
  try {
    let query = `
      SELECT 
        pm.id_pemeriksaan, 
        p.nama as nama_pasien, 
        pm.tanggal_pemeriksaan, 
        pm.jenis_layanan
      FROM pemeriksaan pm
      LEFT JOIN layanan_kb kb ON pm.id_pemeriksaan = kb.id_pemeriksaan
      LEFT JOIN pasien p ON pm.id_pasien = p.id_pasien
      WHERE pm.jenis_layanan = 'KB'
    `;

    const params = [];

    if (search && search.trim()) {
      query += ` AND (p.nama LIKE ? OR p.nik LIKE ? OR kb.metode LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY pm.tanggal_pemeriksaan DESC';

    const [results] = await db.query(query, params);
    return results;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createRegistrasiKB,
  getKBById,
  updateRegistrasiKB,
  deleteRegistrasiKB,
  getAllKB
};