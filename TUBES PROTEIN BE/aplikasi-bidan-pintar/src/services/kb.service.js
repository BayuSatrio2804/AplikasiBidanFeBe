/**
 * KB (Family Planning) Service
 * Handles all KB-related database operations with transaction support
 */

const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const auditService = require('./audit.service');

/**
 * Create KB registration with related records
 * Uses transaction to ensure data consistency
 * @param {Object} data - KB registration data
 * @param {string} userId - User performing the action
 * @returns {Object} Created registration data
 */
const createRegistrasiKB = async (data, userId) => {
  const {
    nama_istri, nik_istri, umur_istri, alamat, no_hp, td_ibu, bb_ibu,
    jenis_layanan, tanggal, metode, no_reg_lama, no_reg_baru, kunjungan_ulang, catatan,
    nama_suami, nik_suami, umur_suami, td_ayah, bb_ayah, subjektif, objektif, analisa, tatalaksana
  } = data;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Find or create patient (mother)
    let id_pasien;
    const [existingPasien] = await connection.query(
      'SELECT id_pasien FROM pasien WHERE nik = ?',
      [nik_istri]
    );

    if (existingPasien.length > 0) {
      id_pasien = existingPasien[0].id_pasien;
      await connection.query(
        'UPDATE pasien SET nama = ?, umur = ?, alamat = ?, no_hp = ? WHERE id_pasien = ?',
        [nama_istri, umur_istri, alamat, no_hp, id_pasien]
      );
    } else {
      id_pasien = uuidv4();
      await connection.query(
        'INSERT INTO pasien (id_pasien, nama, nik, umur, alamat, no_hp) VALUES (?, ?, ?, ?, ?, ?)',
        [id_pasien, nama_istri, nik_istri, umur_istri, alamat, no_hp]
      );
    }

    // 2. Create examination record
    const id_pemeriksaan = uuidv4();
    const subjektif_final = `Kunjungan KB. Keluhan: ${subjektif || '-'}`;
    const objektif_final = `TD Ibu: ${td_ibu || '-'}, BB Ibu: ${bb_ibu || '-'}. Hasil Periksa: ${objektif || '-'}`;

    await connection.query(
      `INSERT INTO pemeriksaan (id_pemeriksaan, id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana, tanggal_pemeriksaan)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_pemeriksaan, id_pasien, jenis_layanan, subjektif_final, objektif_final, analisa, tatalaksana, tanggal]
    );

    // 3. Create KB-specific record
    const id_kb = uuidv4();
    await connection.query(
      `INSERT INTO layanan_kb (id_kb, id_pemeriksaan, no_reg_lama, no_reg_baru, nama_suami, nik_suami, umur_suami, td_ayah, bb_ayah, metode_kb, kunjungan_ulang, catatan)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_kb, id_pemeriksaan, no_reg_lama, no_reg_baru, nama_suami, nik_suami, umur_suami, td_ayah, bb_ayah, metode, kunjungan_ulang, catatan]
    );

    await connection.commit();
    await auditService.recordDataLog(userId, 'CREATE', 'layanan_kb', id_kb);

    return { id_pemeriksaan, id_kb, id_pasien, ...data };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  createRegistrasiKB
};