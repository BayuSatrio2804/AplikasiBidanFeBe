/**
 * Service KB (Keluarga Berencana)
 * Menangani semua operasi database terkait KB
 * Memetakan field frontend secara langsung ke struktur database baru
 */

const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const auditService = require('./audit.service');
const pasienService = require('./pasien.service');

/**
 * Buat registrasi KB baru dengan record terkait
 * Menggunakan transaksi untuk menjamin konsistensi data
 * @param {Object} data - Data registrasi KB dari frontend
 * @param {string} userId - ID Pengguna
 * @returns {Object} Data registrasi yang dibuat
 */
const createRegistrasiKB = async (data, userId) => {
  const {
    // Informasi Ibu
    nama_ibu, nik_ibu, umur_ibu, td_ibu, bb_ibu, alamat, nomor_hp,
    // Informasi Suami
    nama_ayah, nik_ayah, umur_ayah, td_ayah, bb_ayah,
    // Informasi Layanan
    jenis_layanan, tanggal, metode,
    // Registrasi dan tindak lanjut
    nomor_registrasi_lama, nomor_registrasi_baru, kunjungan_ulang, jam_kunjungan_ulang, jam_kunjungan_ulang_selesai, catatan
  } = data;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Cari atau buat pasien (ibu)
    const id_pasien = await pasienService.findOrCreatePasien({
      nama: nama_ibu,
      nik: nik_ibu,
      umur: umur_ibu,
      alamat: alamat,
      no_hp: nomor_hp
    }, connection);

    // 2. Buat record pemeriksaan dengan format SOAP
    const id_pemeriksaan = uuidv4();

    // Susun field SOAP dari data frontend
    const subjektif_final = `Kunjungan KB Metode: ${metode || '-'}`;
    const objektif_final = `TD Ibu: ${td_ibu || '-'}, BB Ibu: ${bb_ibu || '-'}`;
    const analisa_final = catatan || '';
    const tatalaksana_final = metode ? `Metode KB: ${metode}` : '';

    await connection.query(
      `INSERT INTO pemeriksaan (id_pemeriksaan, id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana, tanggal_pemeriksaan)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_pemeriksaan, id_pasien, jenis_layanan, subjektif_final, objektif_final, analisa_final, tatalaksana_final, tanggal]
    );

    // 3. Buat record spesifik KB
    const id_kb = uuidv4();
    await connection.query(
      `INSERT INTO layanan_kb (
        id_kb, id_pemeriksaan, nomor_registrasi_lama, nomor_registrasi_baru,
        metode, td_ibu, bb_ibu, nama_ayah, nik_ayah, umur_ayah, td_ayah, bb_ayah,
        kunjungan_ulang, jam_kunjungan_ulang, jam_kunjungan_ulang_selesai, catatan
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_kb, id_pemeriksaan,
        nomor_registrasi_lama || null, nomor_registrasi_baru || null,
        metode,
        td_ibu || null, bb_ibu || null,
        nama_ayah || null, nik_ayah || null, umur_ayah || null,
        td_ayah || null, bb_ayah || null,
        kunjungan_ulang || null, jam_kunjungan_ulang || '08:00:00', jam_kunjungan_ulang_selesai || null, catatan || null
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
 * Ambil data KB berdasarkan ID
 * Mengembalikan data yang dipetakan ke field frontend
 * @param {string} id_pemeriksaan - ID Pemeriksaan
 * @returns {Object} Data KB
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
      kb.jam_kunjungan_ulang,
      kb.catatan
    FROM pemeriksaan p
    LEFT JOIN pasien pas ON p.id_pasien = pas.id_pasien
    LEFT JOIN layanan_kb kb ON p.id_pemeriksaan = kb.id_pemeriksaan
    WHERE p.id_pemeriksaan = ? AND p.jenis_layanan = 'KB' AND p.deleted_at IS NULL
  `;
  const [rows] = await db.query(query, [id_pemeriksaan]);
  return rows[0] || null;
};

/**
 * Update registrasi KB
 * @param {string} id_pemeriksaan - ID Pemeriksaan
 * @param {Object} data - Data update dari frontend
 * @param {string} userId - ID Pengguna
 * @returns {Object} Data KB terupdate
 */
const updateRegistrasiKB = async (id_pemeriksaan, data, userId) => {
  const {
    nama_ibu, nik_ibu, umur_ibu, td_ibu, bb_ibu, alamat, nomor_hp,
    nama_ayah, nik_ayah, umur_ayah, td_ayah, bb_ayah,
    tanggal, metode, nomor_registrasi_lama, nomor_registrasi_baru, kunjungan_ulang, jam_kunjungan_ulang, jam_kunjungan_ulang_selesai, catatan
  } = data;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Cek pemeriksaan yang ada
    const [existingPemeriksaan] = await connection.query(
      'SELECT id_pasien FROM pemeriksaan WHERE id_pemeriksaan = ?',
      [id_pemeriksaan]
    );

    if (!existingPemeriksaan[0]) {
      throw new Error('Data pemeriksaan tidak ditemukan');
    }

    const id_pasien = existingPemeriksaan[0].id_pasien;

    // Update data pasien
    await connection.query(
      'UPDATE pasien SET nama = ?, nik = ?, umur = ?, alamat = ?, no_hp = ? WHERE id_pasien = ?',
      [nama_ibu, nik_ibu, umur_ibu, alamat, nomor_hp || null, id_pasien]
    );

    // Update pemeriksaan dengan format SOAP
    const subjektif_final = `Kunjungan KB Metode: ${metode || '-'}`;
    const objektif_final = `TD Ibu: ${td_ibu || '-'}, BB Ibu: ${bb_ibu || '-'}`;
    const analisa_final = catatan || '';
    const tatalaksana_final = metode ? `Metode KB: ${metode}` : '';

    await connection.query(
      `UPDATE pemeriksaan SET subjektif = ?, objektif = ?, analisa = ?, tatalaksana = ?, tanggal_pemeriksaan = ?
       WHERE id_pemeriksaan = ?`,
      [subjektif_final, objektif_final, analisa_final, tatalaksana_final, tanggal, id_pemeriksaan]
    );

    // Update layanan_kb
    await connection.query(
      `UPDATE layanan_kb SET 
        nomor_registrasi_lama = ?, nomor_registrasi_baru = ?,
        metode = ?, td_ibu = ?, bb_ibu = ?,
        nama_ayah = ?, nik_ayah = ?, umur_ayah = ?, td_ayah = ?, bb_ayah = ?,
        kunjungan_ulang = ?, jam_kunjungan_ulang = ?, jam_kunjungan_ulang_selesai = ?, catatan = ?
       WHERE id_pemeriksaan = ?`,
      [
        nomor_registrasi_lama || null, nomor_registrasi_baru || null,
        metode, td_ibu || null, bb_ibu || null,
        nama_ayah || null, nik_ayah || null, umur_ayah || null, td_ayah || null, bb_ayah || null,
        kunjungan_ulang || null, jam_kunjungan_ulang || '08:00:00', jam_kunjungan_ulang_selesai || null, catatan || null,
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
 * Hapus registrasi KB
 * @param {string} id_pemeriksaan - ID Pemeriksaan
 * @param {string} userId - ID Pengguna
 */
const deleteRegistrasiKB = async (id_pemeriksaan, userId) => {
  const connection = await db.getConnection();

  try {
    const [result] = await connection.query(
      'UPDATE pemeriksaan SET deleted_at = NOW() WHERE id_pemeriksaan = ?',
      [id_pemeriksaan]
    );

    if (result.affectedRows > 0) {
      await auditService.recordDataLog(userId, 'DELETE', 'layanan_kb', id_pemeriksaan);
    }
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Ambil semua data KB (opsional filter pencarian)
 * @param {string} search - Kata kunci pencarian
 * @returns {Array} Daftar KB
 */
const getAllKB = async (search = '') => {
  try {
    let query = `
      SELECT 
        pm.id_pemeriksaan, 
        pm.id_pasien,
        p.nama as nama_pasien, 
        p.nik,
        pm.tanggal_pemeriksaan, 
        pm.jenis_layanan,
        kb.id_kb,
        kb.nomor_registrasi_lama,
        kb.nomor_registrasi_baru,
        COALESCE(kb.nomor_registrasi_baru, kb.nomor_registrasi_lama) as nomor_registrasi
      FROM pemeriksaan pm
      LEFT JOIN layanan_kb kb ON pm.id_pemeriksaan = kb.id_pemeriksaan
      LEFT JOIN pasien p ON pm.id_pasien = p.id_pasien
      WHERE pm.jenis_layanan = 'KB' AND pm.deleted_at IS NULL AND pm.is_permanent_deleted = 0 AND p.deleted_at IS NULL
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

/**
 * Ambil data KB yang terhapus
 */
const getDeletedKB = async (search = '') => {
  try {
    let query = `
      SELECT 
        pm.id_pemeriksaan, 
        pm.id_pasien,
        p.nama as nama_pasien, 
        p.nik,
        pm.tanggal_pemeriksaan, 
        pm.jenis_layanan,
        pm.deleted_at,
        kb.id_kb,
        kb.nomor_registrasi_lama,
        kb.nomor_registrasi_baru,
        COALESCE(kb.nomor_registrasi_baru, kb.nomor_registrasi_lama) as nomor_registrasi
      FROM pemeriksaan pm
      LEFT JOIN layanan_kb kb ON pm.id_pemeriksaan = kb.id_pemeriksaan
      LEFT JOIN pasien p ON pm.id_pasien = p.id_pasien
      WHERE pm.jenis_layanan = 'KB' AND pm.deleted_at IS NOT NULL AND pm.is_permanent_deleted = 0
    `;

    const params = [];

    if (search && search.trim()) {
      query += ` AND (p.nama LIKE ? OR p.nik LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    query += ' ORDER BY pm.deleted_at DESC';

    const [results] = await db.query(query, params);
    return results;
  } catch (error) {
    throw error;
  }
};

const pemeriksaanService = require('./pemeriksaan.service');

const restoreKB = async (id_pemeriksaan, userId) => {
  return await pemeriksaanService.restorePemeriksaan(id_pemeriksaan, userId);
};

const deletePermanentKB = async (id_pemeriksaan, userId) => {
  return await pemeriksaanService.deletePemeriksaanPermanent(id_pemeriksaan, userId);
};

module.exports = {
  createRegistrasiKB,
  getKBById,
  updateRegistrasiKB,
  deleteRegistrasiKB,
  getAllKB,
  getDeletedKB,
  restoreKB,
  deletePermanentKB
};

