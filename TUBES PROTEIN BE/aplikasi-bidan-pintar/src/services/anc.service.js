/**
 * ANC (Antenatal Care) Service
 * Handles all ANC-related database operations with transaction support
 */

const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const auditService = require('./audit.service');

/**
 * Create ANC registration with related records
 * Uses transaction to ensure data consistency
 * @param {Object} data - ANC registration data
 * @param {string} userId - User performing the action
 * @returns {Object} Created registration data
 */
const createRegistrasiANC = async (data, userId) => {
  const {
    nama_istri, nik_istri, umur_istri, alamat, no_hp,
    jenis_layanan, tanggal, tindakan, no_reg_lama, no_reg_baru,
    nama_suami, nik_suami, umur_suami,
    hpht, hpl, hasil_pemeriksaan, keterangan,
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
    const subjektif_final = `ANC Kunjungan. HPHT: ${hpht || '-'}, HPL: ${hpl || '-'}. ${subjektif || ''}`;
    const objektif_final = `Hasil Periksa: ${hasil_pemeriksaan || '-'}. ${objektif || ''}`;
    const tatalaksana_final = `Tindakan: ${tindakan || '-'}. ${tatalaksana || ''}`;

    await connection.query(
      `INSERT INTO pemeriksaan (id_pemeriksaan, id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana, tanggal_pemeriksaan)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_pemeriksaan, id_pasien, jenis_layanan, subjektif_final, objektif_final, analisa, tatalaksana_final, tanggal]
    );

    // 3. Create ANC-specific record
    const id_anc = uuidv4();
    await connection.query(
      `INSERT INTO layanan_anc (id_anc, id_pemeriksaan, no_reg_lama, no_reg_baru, nama_suami, nik_suami, umur_suami, hpht, hpl, hasil_pemeriksaan, tindakan, keterangan)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_anc, id_pemeriksaan, no_reg_lama, no_reg_baru, nama_suami, nik_suami, umur_suami, hpht, hpl, hasil_pemeriksaan, tindakan, keterangan]
    );

    await connection.commit();
    await auditService.recordDataLog(userId, 'CREATE', 'layanan_anc', id_anc);

    return { id_anc, id_pemeriksaan, id_pasien, ...data };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  createRegistrasiANC
};