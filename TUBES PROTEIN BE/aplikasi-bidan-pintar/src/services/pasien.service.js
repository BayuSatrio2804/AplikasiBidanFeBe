/**
 * Service Pasien
 * Menangani semua operasi database terkait pasien
 */

const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const auditService = require('./audit.service');

/**
 * Ambil semua pasien dengan pencarian opsional
 * @param {string} search - Kata kunci pencarian nama atau NIK
 * @returns {Array} Daftar pasien
 */
const getAllPasien = async (search = null) => {
  let query = 'SELECT * FROM pasien';
  const params = [];

  query += ' WHERE deleted_at IS NULL';
  if (search) {
    query += ' AND (nama LIKE ? OR nik LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY created_at DESC';

  const [rows] = await db.query(query, params);
  return rows;
};

/**
 * Ambil daftar pasien yang dihapus (Soft Delete)
 * @returns {Array} Daftar pasien terhapus
 */
const getDeletedPasien = async (search) => {
  let query = 'SELECT * FROM pasien WHERE deleted_at IS NOT NULL';
  const params = [];

  if (search) {
    query += ' AND (nama LIKE ? OR nik LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY deleted_at DESC';

  const [rows] = await db.query(query, params);
  return rows;
};

/**
 * Ambil pasien berdasarkan ID
 * @param {string} id - ID Pasien
 * @returns {Object|null} Data pasien
 */
/**
 * Helper: Ambil data keluarga (Suami/Ayah) dari kunjungan terakhir
 */
const getLastFamilyData = async (id_pasien) => {
  // Cek Persalinan (nama_suami)
  const [persalinan] = await db.query(
    `SELECT pers.nama_suami, pers.nik_suami, pers.umur_suami 
     FROM layanan_persalinan pers
     JOIN pemeriksaan p ON pers.id_pemeriksaan = p.id_pemeriksaan
     WHERE p.id_pasien = ? AND p.deleted_at IS NULL
     ORDER BY p.tanggal_pemeriksaan DESC LIMIT 1`,
    [id_pasien]
  );
  if (persalinan[0] && persalinan[0].nama_suami) return persalinan[0];

  // Cek ANC (nama_suami)
  const [anc] = await db.query(
    `SELECT anc.nama_suami, NULL as nik_suami, NULL as umur_suami
     FROM layanan_anc anc
     JOIN pemeriksaan p ON anc.id_pemeriksaan = p.id_pemeriksaan
     WHERE p.id_pasien = ? AND p.deleted_at IS NULL
     ORDER BY p.tanggal_pemeriksaan DESC LIMIT 1`,
    [id_pasien]
  );
  if (anc[0] && anc[0].nama_suami) return anc[0];

  // Cek KB (nama_ayah is suami)
  const [kb] = await db.query(
    `SELECT kb.nama_ayah as nama_suami, NULL as nik_suami, kb.umur_ayah as umur_suami
     FROM layanan_kb kb
     JOIN pemeriksaan p ON kb.id_pemeriksaan = p.id_pemeriksaan
     WHERE p.id_pasien = ? AND p.deleted_at IS NULL
     ORDER BY p.tanggal_pemeriksaan DESC LIMIT 1`,
    [id_pasien]
  );
  if (kb[0] && kb[0].nama_suami) return kb[0];

  return null;
};

const getPasienById = async (id) => {
  const query = 'SELECT * FROM pasien WHERE id_pasien = ? AND deleted_at IS NULL';
  const [rows] = await db.query(query, [id]);

  if (rows[0]) {
    const familyData = await getLastFamilyData(id);
    if (familyData) {
      rows[0].latest_husband_data = familyData;
    }
  }

  return rows[0] || null;
};

/**
 * Buat pasien baru
 * @param {Object} data - Data pasien
 * @param {string} userId - ID pengguna yang melakukan aksi
 * @returns {Object} Data pasien yang dibuat
 */
const createPasien = async (data, userId) => {
  const { nama, NIK, umur, alamat, no_hp } = data;
  const id_pasien = uuidv4();

  const query = `
    INSERT INTO pasien (id_pasien, nama, nik, umur, alamat, no_hp) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  await db.query(query, [id_pasien, nama, NIK, umur, alamat, no_hp]);

  try {
    await auditService.recordDataLog(userId, 'CREATE', 'pasien', id_pasien);
  } catch (auditError) {
    console.error('Audit log failed (ignoring):', auditError.message);
  }

  return { id_pasien, nama, NIK, umur, alamat, no_hp };
};

/**
 * Update data pasien
 * @param {string} id - ID Pasien
 * @param {string} userId - ID pengguna yang melakukan aksi
 * @param {Object} data - Data pasien yang diupdate
 * @returns {Object} Data pasien yang sudah diupdate
 */
const updatePasien = async (id, userId, data) => {
  const { nama, NIK, umur, alamat, no_hp } = data;

  const query = `
    UPDATE pasien 
    SET nama = ?, nik = ?, umur = ?, alamat = ?, no_hp = ? 
    WHERE id_pasien = ?
  `;

  await db.query(query, [nama, NIK, umur, alamat, no_hp, id]);

  try {
    await auditService.recordDataLog(userId, 'UPDATE', 'pasien', id);
  } catch (auditError) {
    console.error('Audit log failed (ignoring):', auditError.message);
  }

  return { id_pasien: id, nama, NIK, umur, alamat, no_hp };
};

/**
 * Hapus pasien
 * @param {string} id - ID Pasien
 * @param {string} userId - ID pengguna yang melakukan aksi
 * @returns {Object} Hasil penghapusan
 */
const deletePasien = async (id, userId) => {
  const [result] = await db.query('UPDATE pasien SET deleted_at = NOW() WHERE id_pasien = ?', [id]);

  if (result.affectedRows > 0) {
    try {
      await auditService.recordDataLog(userId, 'DELETE', 'pasien', id);
    } catch (auditError) {
      console.error('Audit log failed (ignoring):', auditError.message);
    }
  }

  return result;
};

/**
 * Restore pasien yang terhapus
 * @param {string} id - ID Pasien
 * @param {string} userId - ID Pengguna
 * @returns {Object} Hasil restore
 */
const restorePasien = async (id, userId) => {
  // Restore pasien
  const [result] = await db.query('UPDATE pasien SET deleted_at = NULL WHERE id_pasien = ?', [id]);

  if (result.affectedRows > 0) {
    try {
      await auditService.recordDataLog(userId, 'RESTORE', 'pasien', id);
    } catch (auditError) {
      console.error('Audit log failed (ignoring):', auditError.message);
    }
  }

  return result;
};

/**
 * Ambil riwayat pemeriksaan pasien
 * @param {string} id - ID Pasien
 * @returns {Array} Riwayat pemeriksaan
 */
const getRiwayatPasien = async (id) => {
  const query = `
    SELECT * FROM pemeriksaan 
    WHERE id_pasien = ? 
    ORDER BY tanggal_pemeriksaan DESC
  `;
  const [rows] = await db.query(query, [id]);
  return rows;
};

/**
 * Temukan atau buat pasien baru (Upsert)
 * Digunakan oleh service lain dalam satu transaksi
 * @param {Object} data - Data pasien {nama, nik, umur, alamat, no_hp}
 * @param {Object} connection - Koneksi database (transaksi)
 * @returns {string} ID Pasien
 */
const findOrCreatePasien = async (data, connection) => {
  const { nama, nik, umur, alamat, no_hp } = data;
  let id_pasien;
  let existingPasien = [];

  // Hanya cek NIK jika ada dan valid
  if (nik && nik.trim().length > 0) {
    [existingPasien] = await connection.query(
      'SELECT id_pasien FROM pasien WHERE nik = ?',
      [nik]
    );
  }

  if (existingPasien.length > 0) {
    id_pasien = existingPasien[0].id_pasien;
    // Update data pasien yang ada dan restore jika terhapus
    await connection.query(
      'UPDATE pasien SET nama = ?, umur = ?, alamat = ?, no_hp = ?, deleted_at = NULL WHERE id_pasien = ?',
      [nama, umur, alamat, no_hp || null, id_pasien]
    );
  } else {
    // Buat pasien baru
    id_pasien = uuidv4();
    await connection.query(
      'INSERT INTO pasien (id_pasien, nama, nik, umur, alamat, no_hp) VALUES (?, ?, ?, ?, ?, ?)',
      [id_pasien, nama, nik || null, umur, alamat, no_hp || null]
    );
  }

  return id_pasien;
};

module.exports = {
  getAllPasien,
  getPasienById,
  createPasien,
  updatePasien,
  deletePasien,
  getRiwayatPasien,
  findOrCreatePasien,
  restorePasien,
  getDeletedPasien
};
