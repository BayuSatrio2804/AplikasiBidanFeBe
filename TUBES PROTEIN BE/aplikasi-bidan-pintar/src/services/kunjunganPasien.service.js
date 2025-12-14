/**
 * Kunjungan Pasien (Patient Visit) Service
 * Handles all general patient visit database operations
 */

const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const auditService = require('./audit.service');

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
    const [existingPasien] = await connection.query(
      'SELECT id_pasien FROM pasien WHERE nik = ?',
      [nik_wali || nik_pasien]
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
        [id_pasien, nama_wali || nama_pasien, nik_wali || nik_pasien, umur_wali || umur_pasien]
      );
    }

    // 2. Create examination record with SOAP data
    const id_pemeriksaan = uuidv4();
    const subjektif_final = subjektif || `Keluhan: ${keluhan || '-'}`;
    const objektif_final = objektif || `BB: ${bb_pasien || '-'}, TD: ${td_pasien || '-'}`;
    const analisa_final = analisa || diagnosa || '-';
    const tatalaksana_final = tatalaksana || `Terapi: ${terapi_obat || '-'}. ${keterangan || ''}`;

    await connection.query(
      `INSERT INTO pemeriksaan (id_pemeriksaan, id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana, tanggal_pemeriksaan)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_pemeriksaan, id_pasien, jenis_layanan || 'Kunjungan Pasien', subjektif_final, objektif_final, analisa_final, tatalaksana_final, tanggal]
    );

    // 3. Create visit-specific record
    const id_kunjungan = uuidv4();
    await connection.query(
      `INSERT INTO layanan_kunjungan_pasien (id_kunjungan, id_pemeriksaan, no_reg, jenis_kunjungan, nama_pasien, nik_pasien, umur_pasien, bb_pasien, td_pasien, nama_wali, nik_wali, umur_wali, keluhan, diagnosa, terapi_obat, keterangan)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_kunjungan, id_pemeriksaan, no_reg, jenis_kunjungan, nama_pasien, nik_pasien, umur_pasien, bb_pasien, td_pasien, nama_wali, nik_wali, umur_wali, keluhan, diagnosa, terapi_obat, keterangan]
    );

    await connection.commit();

    if (userId) {
      await auditService.recordDataLog(userId, 'CREATE', 'layanan_kunjungan_pasien', id_kunjungan);
    }

    return { id_kunjungan, id_pemeriksaan, id_pasien, ...data };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  createRegistrasiKunjunganPasien
};