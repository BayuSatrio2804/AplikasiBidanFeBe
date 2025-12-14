/**
 * Imunisasi (Immunization) Service
 * Handles all immunization-related database operations with transaction support
 */

const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const auditService = require('./audit.service');

/**
 * Create immunization registration with related records
 * Uses transaction to ensure data consistency
 * @param {Object} data - Immunization registration data
 * @param {string} userId - User performing the action
 * @returns {Object} Created registration data
 */
const createRegistrasiImunisasi = async (data, userId) => {
  const {
    nama_istri, nik_istri, umur_istri, alamat, no_hp,
    jenis_layanan, tanggal, no_reg, jenis_imunisasi, pengobatan,
    nama_suami, nik_suami, umur_suami,
    nama_bayi_balita, tanggal_lahir_bayi, tb_bayi, bb_bayi,
    jadwal_selanjutnya,
    subjektif, objektif, analisa, tatalaksana
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
    const subjektif_final = `Kunjungan Imunisasi. Bayi: ${nama_bayi_balita || '-'}. ${subjektif || ''}`;
    const objektif_final = `Jenis Imunisasi: ${jenis_imunisasi || '-'}. BB: ${bb_bayi || '-'}, TB: ${tb_bayi || '-'}. ${objektif || ''}`;
    const tatalaksana_final = `Pengobatan: ${pengobatan || 'Tidak ada'}. Jadwal Selanjutnya: ${jadwal_selanjutnya || '-'}. ${tatalaksana || ''}`;

    await connection.query(
      `INSERT INTO pemeriksaan (id_pemeriksaan, id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana, tanggal_pemeriksaan)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_pemeriksaan, id_pasien, jenis_layanan, subjektif_final, objektif_final, analisa, tatalaksana_final, tanggal]
    );

    // 3. Create immunization-specific record
    const id_imunisasi = uuidv4();
    await connection.query(
      `INSERT INTO layanan_imunisasi (id_imunisasi, id_pemeriksaan, no_reg, nama_bayi_balita, tanggal_lahir_bayi, tb_bayi, bb_bayi, jenis_imunisasi, pengobatan, jadwal_selanjutnya, no_hp_kontak)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_imunisasi, id_pemeriksaan, no_reg, nama_bayi_balita, tanggal_lahir_bayi, tb_bayi, bb_bayi, jenis_imunisasi, pengobatan, jadwal_selanjutnya, no_hp]
    );

    await connection.commit();
    await auditService.recordDataLog(userId, 'CREATE', 'layanan_imunisasi', id_imunisasi);

    return { id_imunisasi, id_pemeriksaan, id_pasien, ...data };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  createRegistrasiImunisasi
};