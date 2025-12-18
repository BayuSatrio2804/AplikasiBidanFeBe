/**
 * Kunjungan Pasien (Patient Visit) Service
 * Handles all general patient visit database operations
 */

const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const auditService = require('./audit.service');

/**
 * Get all patient visits with optional search
 * @param {string} search - Search query for patient name
 * @returns {Array} List of patient visits
 */
const getAllKunjunganPasien = async (search = '') => {
  const connection = await db.getConnection();
  
  try {
    let query = `
      SELECT 
        k.id_kunjungan as id,
        k.tanggal,
        k.nama_pasien,
        'Kunjungan Pasien' as jenis_layanan,
        p.tanggal_pemeriksaan
      FROM layanan_kunjungan_pasien k
      LEFT JOIN pemeriksaan p ON k.id_pemeriksaan = p.id_pemeriksaan
    `;
    
    let params = [];
    
    if (search) {
      query += ' WHERE k.nama_pasien LIKE ?';
      params.push(`%${search}%`);
    }
    
    query += ' ORDER BY k.tanggal DESC';
    
    const [rows] = await connection.query(query, params);
    return rows;
  } finally {
    connection.release();
  }
};

/**
 * Get patient visit by ID
 * @param {string} id - Visit ID
 * @returns {Object} Visit data
 */
const getKunjunganPasienById = async (id) => {
  const connection = await db.getConnection();
  
  try {
    const [rows] = await connection.query(
      `SELECT 
        k.*,
        'Kunjungan Pasien' as jenis_layanan
      FROM layanan_kunjungan_pasien k
      WHERE k.id_kunjungan = ?`,
      [id]
    );
    
    if (rows.length === 0) {
      throw new Error('Data kunjungan tidak ditemukan');
    }
    
    return rows[0];
  } finally {
    connection.release();
  }
};

/**
 * Create general patient visit registration
 * @param {Object} data - Visit registration data
 * @param {string} userId - User performing the action
 * @returns {Object} Created registration data
 */
const createRegistrasiKunjunganPasien = async (data, userId) => {
  const {
    nama_pasien, nik_pasien, umur_pasien, bb_pasien, td_pasien,
    nama_wali, nik_wali, umur_wali,
    jenis_layanan, tanggal, no_reg, jenis_kunjungan,
    keluhan, diagnosa, terapi_obat, keterangan,
    subjektif, objektif, analisa, tatalaksana
  } = data;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Find or create patient (using wali as the master patient for administrative purposes)
    let id_pasien;
    const nikToCheck = nik_wali || nik_pasien;
    
    if (nikToCheck) {
      const [existingPasien] = await connection.query(
        'SELECT id_pasien FROM pasien WHERE nik = ?',
        [nikToCheck]
      );

      if (existingPasien.length > 0) {
        id_pasien = existingPasien[0].id_pasien;
        await connection.query(
          'UPDATE pasien SET nama = ?, umur = ? WHERE id_pasien = ?',
          [nama_wali || nama_pasien, umur_wali || umur_pasien, id_pasien]
        );
      } else {
        id_pasien = uuidv4();
        await connection.query(
          'INSERT INTO pasien (id_pasien, nama, nik, umur) VALUES (?, ?, ?, ?)',
          [id_pasien, nama_wali || nama_pasien, nikToCheck, umur_wali || umur_pasien]
        );
      }
    } else {
      // Create new patient without NIK
      id_pasien = uuidv4();
      await connection.query(
        'INSERT INTO pasien (id_pasien, nama, nik, umur) VALUES (?, ?, ?, ?)',
        [id_pasien, nama_wali || nama_pasien, uuidv4(), umur_wali || umur_pasien]
      );
    }

    // 2. Create examination record with SOAP data
    const id_pemeriksaan = uuidv4();
    const subjektif_final = subjektif || `Keluhan: ${keluhan || '-'}`;
    const objektif_final = objektif || `BB: ${bb_pasien || '-'} kg, TD: ${td_pasien || '-'}`;
    const analisa_final = analisa || diagnosa || '-';
    const tatalaksana_final = tatalaksana || `Terapi: ${terapi_obat || '-'}. ${keterangan || ''}`;

    await connection.query(
      `INSERT INTO pemeriksaan (id_pemeriksaan, id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana, tanggal_pemeriksaan)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_pemeriksaan, id_pasien, 'Kunjungan Pasien', subjektif_final, objektif_final, analisa_final, tatalaksana_final, tanggal]
    );

    // 3. Create visit-specific record
    const id_kunjungan = uuidv4();
    await connection.query(
      `INSERT INTO layanan_kunjungan_pasien (id_kunjungan, id_pemeriksaan, tanggal, no_reg, jenis_kunjungan, nama_pasien, nik_pasien, umur_pasien, bb_pasien, td_pasien, nama_wali, nik_wali, umur_wali, keluhan, diagnosa, terapi_obat, keterangan)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_kunjungan, id_pemeriksaan, tanggal, no_reg, jenis_kunjungan, nama_pasien, nik_pasien, umur_pasien, bb_pasien, td_pasien, nama_wali, nik_wali, umur_wali, keluhan, diagnosa, terapi_obat, keterangan]
    );

    await connection.commit();

    if (userId) {
      await auditService.recordDataLog(userId, 'CREATE', 'layanan_kunjungan_pasien', id_kunjungan);
    }

    return { id_kunjungan, id_pemeriksaan, id_pasien };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Update patient visit
 * @param {string} id - Visit ID
 * @param {Object} data - Updated visit data
 * @param {string} userId - User performing the action
 * @returns {Object} Success message
 */
const updateKunjunganPasien = async (id, data, userId) => {
  const {
    nama_pasien, nik_pasien, umur_pasien, bb_pasien, td_pasien,
    nama_wali, nik_wali, umur_wali,
    tanggal, no_reg, jenis_kunjungan,
    keluhan, diagnosa, terapi_obat, keterangan
  } = data;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Get id_pemeriksaan
    const [kunjungan] = await connection.query(
      'SELECT id_pemeriksaan FROM layanan_kunjungan_pasien WHERE id_kunjungan = ?',
      [id]
    );

    if (kunjungan.length === 0) {
      throw new Error('Data kunjungan tidak ditemukan');
    }

    const id_pemeriksaan = kunjungan[0].id_pemeriksaan;

    // Update pemeriksaan record
    const subjektif_final = `Keluhan: ${keluhan || '-'}`;
    const objektif_final = `BB: ${bb_pasien || '-'} kg, TD: ${td_pasien || '-'}`;
    const analisa_final = diagnosa || '-';
    const tatalaksana_final = `Terapi: ${terapi_obat || '-'}. ${keterangan || ''}`;

    await connection.query(
      `UPDATE pemeriksaan 
       SET subjektif = ?, objektif = ?, analisa = ?, tatalaksana = ?, tanggal_pemeriksaan = ?
       WHERE id_pemeriksaan = ?`,
      [subjektif_final, objektif_final, analisa_final, tatalaksana_final, tanggal, id_pemeriksaan]
    );

    // Update visit record
    await connection.query(
      `UPDATE layanan_kunjungan_pasien 
       SET tanggal = ?, no_reg = ?, jenis_kunjungan = ?, nama_pasien = ?, nik_pasien = ?, umur_pasien = ?, 
           bb_pasien = ?, td_pasien = ?, nama_wali = ?, nik_wali = ?, umur_wali = ?, 
           keluhan = ?, diagnosa = ?, terapi_obat = ?, keterangan = ?
       WHERE id_kunjungan = ?`,
      [tanggal, no_reg, jenis_kunjungan, nama_pasien, nik_pasien, umur_pasien, bb_pasien, td_pasien, nama_wali, nik_wali, umur_wali, keluhan, diagnosa, terapi_obat, keterangan, id]
    );

    await connection.commit();

    if (userId) {
      await auditService.recordDataLog(userId, 'UPDATE', 'layanan_kunjungan_pasien', id);
    }

    return { message: 'Data kunjungan berhasil diupdate' };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Delete patient visit
 * @param {string} id - Visit ID
 * @param {string} userId - User performing the action
 * @returns {Object} Success message
 */
const deleteKunjunganPasien = async (id, userId) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Get id_pemeriksaan before deleting
    const [kunjungan] = await connection.query(
      'SELECT id_pemeriksaan FROM layanan_kunjungan_pasien WHERE id_kunjungan = ?',
      [id]
    );

    if (kunjungan.length === 0) {
      throw new Error('Data kunjungan tidak ditemukan');
    }

    const id_pemeriksaan = kunjungan[0].id_pemeriksaan;

    // Delete visit record (will cascade to pemeriksaan due to FK)
    await connection.query('DELETE FROM layanan_kunjungan_pasien WHERE id_kunjungan = ?', [id]);
    await connection.query('DELETE FROM pemeriksaan WHERE id_pemeriksaan = ?', [id_pemeriksaan]);

    await connection.commit();

    if (userId) {
      await auditService.recordDataLog(userId, 'DELETE', 'layanan_kunjungan_pasien', id);
    }

    return { message: 'Data kunjungan berhasil dihapus' };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  getAllKunjunganPasien,
  getKunjunganPasienById,
  createRegistrasiKunjunganPasien,
  updateKunjunganPasien,
  deleteKunjunganPasien
};