/**
 * Service Persalinan
 * Menangani semua operasi database terkait persalinan
 */

const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const auditService = require('./audit.service');
const pasienService = require('./pasien.service');

/**
 * Helper: Konversi format tanggal
 * Mengubah dari DD/MM/YYYY ke YYYY-MM-DD untuk database
 */
const convertDate = (dateStr) => {
  if (!dateStr) return null;

  // Sudah dalam format YYYY-MM-DD
  if (dateStr.includes('-') && dateStr.split('-')[0].length === 4) {
    return dateStr;
  }

  // Konversi dari DD/MM/YYYY ke YYYY-MM-DD
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
  }

  return dateStr;
};

/**
 * Buat registrasi persalinan baru
 * Menggunakan transaksi untuk integritas data
 * @param {Object} data - Data dari frontend
 * @param {string} userId - ID Pengguna
 * @returns {Object} Data registrasi yang dibuat
 */
const createRegistrasiPersalinan = async (data, userId) => {
  const {
    nama_istri, nik_istri, umur_istri, alamat, no_hp, td_ibu, bb_ibu, lila_ibu, lida_ibu,
    tanggal, penolong, no_reg_lama, no_reg_baru,
    nama_suami, nik_suami, umur_suami,
    tanggal_lahir, jenis_kelamin, anak_ke, jenis_partus, imd_dilakukan,
    as_bayi, bb_bayi, pb_bayi, lika_bayi
  } = data;

  const tanggalConverted = convertDate(tanggal);
  const tanggalLahirConverted = convertDate(tanggal_lahir);

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Cek pasien (ibu), buat baru atau update
    const id_pasien = await pasienService.findOrCreatePasien({
      nama: nama_istri,
      nik: nik_istri,
      umur: umur_istri,
      alamat: alamat,
      no_hp: no_hp
    }, connection);

    // 2. Buat record pemeriksaan
    const id_pemeriksaan = uuidv4();

    // Subjektif & Objektif untuk kelengkapan SOAP (opsional duplikat untuk tampilan)
    const subjektif_final = `Persalinan Anak Ke-${anak_ke || '-'}, Jenis Partus: ${jenis_partus || '-'}`;

    // Update Objektif: Tetap berguna untuk menyimpan string ringkasan untuk tampilan cepat di riwayat SOAP
    const objektif_final = `Ibu - TD: ${td_ibu || '-'} mmHg, BB: ${bb_ibu || '-'} kg, LILA: ${lila_ibu || '-'} cm | Bayi - BB: ${bb_bayi || '-'} gram, PB: ${pb_bayi || '-'} cm`;

    const tatalaksana_final = `Penolong: ${penolong || '-'}, IMD: ${imd_dilakukan ? 'Ya' : 'Tidak'}`;

    await connection.query(
      `INSERT INTO pemeriksaan (id_pemeriksaan, id_pasien, jenis_layanan, tanggal_pemeriksaan, subjektif, objektif, analisa, tatalaksana)
       VALUES (?, ?, 'Persalinan', ?, ?, ?, '', ?)`,
      [id_pemeriksaan, id_pasien, tanggalConverted, subjektif_final, objektif_final, tatalaksana_final]
    );

    // 3. Buat record persalinan
    const id_persalinan = uuidv4();
    await connection.query(
      `INSERT INTO layanan_persalinan (
        id_persalinan, id_pemeriksaan, no_reg_lama, no_reg_baru, penolong,
        nama_suami, nik_suami, umur_suami, td_ibu, bb_ibu,
        tanggal_lahir, jenis_kelamin, anak_ke, jenis_partus, imd_dilakukan,
        as_bayi, bb_bayi, pb_bayi, lila_ibu, lida_ibu, lika_bayi
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_persalinan, id_pemeriksaan, no_reg_lama || null, no_reg_baru || null, penolong || null,
        nama_suami || null, nik_suami || null, umur_suami || null, td_ibu || null, bb_ibu || null,
        tanggalLahirConverted || null, jenis_kelamin || null, anak_ke || null, jenis_partus || null,
        imd_dilakukan ? 1 : 0, as_bayi || null, bb_bayi || null, pb_bayi || null,
        lila_ibu || null, lida_ibu || null, lika_bayi || null
      ]
    );

    await connection.commit();
    await auditService.recordDataLog(userId, 'CREATE', 'layanan_persalinan', id_persalinan);

    return {
      id_persalinan,
      id_pemeriksaan,
      id_pasien,
      message: 'Registrasi Persalinan berhasil disimpan'
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Ambil data persalinan berdasarkan ID
 * @param {string} id_pemeriksaan - ID Pemeriksaan
 * @returns {Object} Data Persalinan lengkap
 */
const getPersalinanById = async (id_pemeriksaan) => {
  const query = `
    SELECT
      p.id_pemeriksaan,
      DATE_FORMAT(p.tanggal_pemeriksaan, '%Y-%m-%d') as tanggal,
      p.jenis_layanan,
      pers.id_persalinan,
      pers.no_reg_lama,
      pers.no_reg_baru,
      pers.penolong,
      pers.nama_suami,
      pers.nik_suami,
      pers.umur_suami,
      pers.td_ibu,
      pers.bb_ibu,
      pers.lila_ibu,
      pers.lida_ibu,
      DATE_FORMAT(pers.tanggal_lahir, '%Y-%m-%d') as tanggal_lahir,
      pers.jenis_kelamin,
      pers.anak_ke,
      pers.jenis_partus,
      pers.imd_dilakukan,
      pers.as_bayi,
      pers.bb_bayi,
      pers.pb_bayi,
      pers.lika_bayi,
      pas.nama as nama_istri,
      pas.nik as nik_istri,
      pas.umur as umur_istri,
      pas.alamat,
      pas.no_hp,
      p.objektif
    FROM pemeriksaan p
    LEFT JOIN layanan_persalinan pers ON p.id_pemeriksaan = pers.id_pemeriksaan
    LEFT JOIN pasien pas ON p.id_pasien = pas.id_pasien
    WHERE p.id_pemeriksaan = ? AND p.jenis_layanan = 'Persalinan' AND p.deleted_at IS NULL
  `;
  const [rows] = await db.query(query, [id_pemeriksaan]);

  if (rows[0]) {
    // Jika td_ibu/bb_ibu masih kosong (data lama), coba ekstrak dari teks objektif
    if (!rows[0].td_ibu) {
      const objektif = rows[0].objektif || '';
      const tdMatch = objektif.match(/TD:\s*([^\s,]+)/);
      rows[0].td_ibu = tdMatch ? tdMatch[1] : '';
    }

    if (!rows[0].bb_ibu) {
      const objektif = rows[0].objektif || '';
      const bbMatch = objektif.match(/BB:\s*([\d.]+)/);
      rows[0].bb_ibu = bbMatch ? bbMatch[1] : '';
    }
  }

  return rows[0] || null;
};

/**
 * Ambil daftar semua persalinan
 * @param {string} search - Kata kunci pencarian
 * @returns {Array} Daftar persalinan
 */
const getAllPersalinan = async (search = '') => {
  let query = `
    SELECT 
      p.id_pemeriksaan,
      p.id_pasien,
      DATE_FORMAT(p.tanggal_pemeriksaan, '%d/%m/%Y') as tanggal,
      p.jenis_layanan,
      pas.nama as nama_pasien,
      pas.nik,
      pers.anak_ke,
      pers.jenis_partus,
      pers.penolong,
      pers.no_reg_lama,
      pers.no_reg_baru,
      COALESCE(pers.no_reg_baru, pers.no_reg_lama) as nomor_registrasi
    FROM pemeriksaan p
    LEFT JOIN pasien pas ON p.id_pasien = pas.id_pasien
    LEFT JOIN layanan_persalinan pers ON p.id_pemeriksaan = pers.id_pemeriksaan
    WHERE p.jenis_layanan = 'Persalinan' AND p.deleted_at IS NULL AND p.is_permanent_deleted = 0 AND pas.deleted_at IS NULL
  `;

  const params = [];
  if (search) {
    query += ` AND (pas.nama LIKE ? OR pas.nik LIKE ? OR pers.jenis_partus LIKE ? OR pers.penolong LIKE ?)`;
    const searchParam = `%${search}%`;
    params.push(searchParam, searchParam, searchParam, searchParam);
  }

  query += ` ORDER BY p.tanggal_pemeriksaan DESC`;

  const [rows] = await db.query(query, params);
  return rows;
};

/**
 * Update registrasi persalinan
 * @param {string} id_pemeriksaan - ID Pemeriksaan
 * @param {Object} data - Data update
 * @param {string} userId - ID Pengguna
 * @returns {Object} Data terbaru
 */
const updateRegistrasiPersalinan = async (id_pemeriksaan, data, userId) => {
  const {
    nama_istri, nik_istri, umur_istri, alamat, no_hp, td_ibu, bb_ibu, lila_ibu, lida_ibu,
    tanggal, penolong, no_reg_lama, no_reg_baru,
    nama_suami, nik_suami, umur_suami,
    tanggal_lahir, jenis_kelamin, anak_ke, jenis_partus, imd_dilakukan,
    as_bayi, bb_bayi, pb_bayi, lika_bayi
  } = data;

  const tanggalConverted = convertDate(tanggal);
  const tanggalLahirConverted = convertDate(tanggal_lahir);

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

    // Fix Bug #2: Jangan update data master pasien saat edit layanan Persalinan
    // await connection.query(
    //   'UPDATE pasien SET nama = ?, nik = ?, umur = ?, alamat = ?, no_hp = ? WHERE id_pasien = ?',
    //   [nama_istri, nik_istri, umur_istri, alamat, no_hp || null, id_pasien]
    // );

    // Update pemeriksaan
    const subjektif_final = `Persalinan Anak Ke-${anak_ke || '-'}, Jenis Partus: ${jenis_partus || '-'}`;
    const objektif_final = `Ibu - TD: ${td_ibu || '-'} mmHg, BB: ${bb_ibu || '-'} kg, LILA: ${lila_ibu || '-'} cm | Bayi - BB: ${bb_bayi || '-'} gram, PB: ${pb_bayi || '-'} cm`;
    const tatalaksana_final = `Penolong: ${penolong || '-'}, IMD: ${imd_dilakukan ? 'Ya' : 'Tidak'}`;

    await connection.query(
      `UPDATE pemeriksaan SET 
        subjektif = ?, objektif = ?, tatalaksana = ?, tanggal_pemeriksaan = ?
       WHERE id_pemeriksaan = ?`,
      [subjektif_final, objektif_final, tatalaksana_final, tanggalConverted, id_pemeriksaan]
    );

    // Update layanan_persalinan
    await connection.query(
      `UPDATE layanan_persalinan SET
        no_reg_lama = ?,
        no_reg_baru = ?,
        penolong = ?,
        nama_suami = ?,
        nik_suami = ?,
        umur_suami = ?,
        td_ibu = ?,
        bb_ibu = ?,
        lila_ibu = ?,
        lida_ibu = ?,
        tanggal_lahir = ?,
        jenis_kelamin = ?,
        anak_ke = ?,
        jenis_partus = ?,
        imd_dilakukan = ?,
        as_bayi = ?,
        bb_bayi = ?,
        pb_bayi = ?,
        lika_bayi = ?
       WHERE id_pemeriksaan = ?`,
      [
        no_reg_lama || null, no_reg_baru || null, penolong || null,
        nama_suami || null, nik_suami || null, umur_suami || null,
        td_ibu || null, bb_ibu || null,
        lila_ibu || null, lida_ibu || null,
        tanggalLahirConverted || null, jenis_kelamin || null, anak_ke || null, jenis_partus || null,
        imd_dilakukan ? 1 : 0, as_bayi || null, bb_bayi || null, pb_bayi || null, lika_bayi || null,
        id_pemeriksaan
      ]
    );

    await connection.commit();
    await auditService.recordDataLog(userId, 'UPDATE', 'layanan_persalinan', id_pemeriksaan);

    return getPersalinanById(id_pemeriksaan);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Hapus registrasi persalinan
 * @param {string} id_pemeriksaan - ID Pemeriksaan
 * @param {string} userId - ID Pengguna
 */
const deleteRegistrasiPersalinan = async (id_pemeriksaan, userId) => {
  const connection = await db.getConnection();

  try {
    const [result] = await connection.query(
      'UPDATE pemeriksaan SET deleted_at = NOW() WHERE id_pemeriksaan = ?',
      [id_pemeriksaan]
    );

    if (result.affectedRows > 0) {
      await auditService.recordDataLog(userId, 'DELETE', 'layanan_persalinan', id_pemeriksaan);
    }

    return { message: 'Data Persalinan berhasil dihapus' };
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Get deleted Persalinan records
 */
const getDeletedPersalinan = async (search = '') => {
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
        pers.id_persalinan,
        pers.no_reg_lama,
        pers.no_reg_baru,
        COALESCE(pers.no_reg_baru, pers.no_reg_lama) as nomor_registrasi
      FROM pemeriksaan pm
      LEFT JOIN layanan_persalinan pers ON pm.id_pemeriksaan = pers.id_pemeriksaan
      LEFT JOIN pasien p ON pm.id_pasien = p.id_pasien
      WHERE pm.jenis_layanan = 'Persalinan' AND pm.deleted_at IS NOT NULL AND pm.is_permanent_deleted = 0
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

const restorePersalinan = async (id_pemeriksaan, userId) => {
  return await pemeriksaanService.restorePemeriksaan(id_pemeriksaan, userId);
};

const deletePermanentPersalinan = async (id_pemeriksaan, userId) => {
  return await pemeriksaanService.deletePemeriksaanPermanent(id_pemeriksaan, userId);
};

module.exports = {
  createRegistrasiPersalinan,
  getPersalinanById,
  getAllPersalinan,
  updateRegistrasiPersalinan,
  deleteRegistrasiPersalinan,
  getDeletedPersalinan,
  restorePersalinan,
  deletePermanentPersalinan
};
