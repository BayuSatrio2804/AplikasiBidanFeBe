/**
 * Service Imunisasi
 * Menangani semua operasi database terkait imunisasi
 */

const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const auditService = require('./audit.service');
const pasienService = require('./pasien.service');

/**
 * Helper: Konversi format tanggal
 * Mengubah dari DD/MM/YYYY ke YYYY-MM-DD untuk database
 * @param {string} dateStr - Tanggal string
 * @returns {string|null} Tanggal terformat YYYY-MM-DD
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
 * Buat registrasi imunisasi baru
 * @param {Object} data - Data dari frontend
 * @param {string} userId - ID Pengguna
 * @returns {Object} Data registrasi
 */
const createRegistrasiImunisasi = async (data, userId) => {
  const {
    nama_istri, nik_istri, umur_istri, alamat, no_hp,
    tanggal, no_reg, jenis_imunisasi, pengobatan,
    nama_suami, nik_suami, umur_suami,
    nama_bayi_balita, tanggal_lahir_bayi, tb_bayi, bb_bayi,
    jadwal_selanjutnya, jam_jadwal_selanjutnya, jam_jadwal_selanjutnya_selesai
  } = data;

  const tanggalConverted = convertDate(tanggal);
  const tanggalLahirConverted = convertDate(tanggal_lahir_bayi);

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

    // Susun data SOAP
    const subjektif_final = `Imunisasi ${jenis_imunisasi || ''} untuk ${nama_bayi_balita || 'bayi'}`;
    const objektif_final = `Bayi: ${nama_bayi_balita || '-'}, TB: ${tb_bayi || '-'} cm, BB: ${bb_bayi || '-'} kg`;
    const tatalaksana_final = `Jenis Imunisasi: ${jenis_imunisasi || '-'}, Pengobatan: ${pengobatan || '-'}, Jadwal Selanjutnya: ${jadwal_selanjutnya || '-'}`;

    await connection.query(
      `INSERT INTO pemeriksaan (id_pemeriksaan, id_pasien, jenis_layanan, tanggal_pemeriksaan, subjektif, objektif, analisa, tatalaksana)
       VALUES (?, ?, 'Imunisasi', ?, ?, ?, '', ?)`,
      [id_pemeriksaan, id_pasien, tanggalConverted, subjektif_final, objektif_final, tatalaksana_final]
    );

    // 3. Buat record detail imunisasi
    const id_imunisasi = uuidv4();
    await connection.query(
      `INSERT INTO layanan_imunisasi (
        id_imunisasi, id_pemeriksaan, no_reg, nama_bayi_balita, tanggal_lahir_bayi,
        tb_bayi, bb_bayi, jenis_imunisasi, pengobatan, jadwal_selanjutnya, jam_jadwal_selanjutnya, jam_jadwal_selanjutnya_selesai, no_hp_kontak,
        nama_ibu, nik_ibu, umur_ibu, nama_ayah, nik_ayah, umur_ayah
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_imunisasi, id_pemeriksaan, no_reg || null,
        nama_bayi_balita || null, tanggalLahirConverted || null,
        tb_bayi || null, bb_bayi || null,
        jenis_imunisasi, pengobatan || null, jadwal_selanjutnya || null, jam_jadwal_selanjutnya || '09:00:00', jam_jadwal_selanjutnya_selesai || null, no_hp || null,
        nama_istri, nik_istri, umur_istri,
        nama_suami || null, nik_suami || null, umur_suami || null
      ]
    );

    await connection.commit();
    await auditService.recordDataLog(userId, 'CREATE', 'layanan_imunisasi', id_imunisasi);

    return {
      id_imunisasi,
      id_pemeriksaan,
      id_pasien,
      message: 'Registrasi Imunisasi berhasil disimpan'
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Ambil data imunisasi berdasarkan ID
 * @param {string} id_pemeriksaan - ID Pemeriksaan
 * @returns {Object} Data Imunisasi lengkap
 */
const getImunisasiById = async (id_pemeriksaan) => {
  const query = `
    SELECT
      p.id_pemeriksaan,
      DATE_FORMAT(p.tanggal_pemeriksaan, '%Y-%m-%d') as tanggal,
      p.jenis_layanan,
      im.id_imunisasi,
      im.no_reg,
      im.jenis_imunisasi,
      im.nama_ibu as nama_istri,
      im.nik_ibu as nik_istri,
      im.umur_ibu as umur_istri,
      im.nama_ayah as nama_suami,
      im.nik_ayah as nik_suami,
      im.umur_ayah as umur_suami,
      im.nama_bayi_balita,
      DATE_FORMAT(im.tanggal_lahir_bayi, '%Y-%m-%d') as tanggal_lahir_bayi,
      im.tb_bayi,
      im.bb_bayi,
      im.pengobatan,
      im.jadwal_selanjutnya,
      im.jam_jadwal_selanjutnya,
      im.no_hp_kontak as no_hp,
      pas.alamat
    FROM pemeriksaan p
    LEFT JOIN layanan_imunisasi im ON p.id_pemeriksaan = im.id_pemeriksaan
    LEFT JOIN pasien pas ON p.id_pasien = pas.id_pasien
    WHERE p.id_pemeriksaan = ? AND p.jenis_layanan = 'Imunisasi' AND p.deleted_at IS NULL
  `;
  const [rows] = await db.query(query, [id_pemeriksaan]);
  return rows[0] || null;
};

/**
 * Ambil daftar semua imunisasi
 * @param {string} search - Kata kunci pencarian
 * @returns {Array} Daftar imunisasi
 */
const getAllImunisasi = async (search = '') => {
  let query = `
    SELECT 
      p.id_pemeriksaan,
      p.id_pasien,
      DATE_FORMAT(p.tanggal_pemeriksaan, '%d/%m/%Y') as tanggal,
      p.jenis_layanan,
      pas.nama,
      pas.nik,
      im.nama_bayi_balita,
      im.tanggal_lahir_bayi,
      im.jenis_imunisasi,
      im.no_reg,
      im.no_reg as nomor_registrasi
    FROM pemeriksaan p
    LEFT JOIN pasien pas ON p.id_pasien = pas.id_pasien
    LEFT JOIN layanan_imunisasi im ON p.id_pemeriksaan = im.id_pemeriksaan
    WHERE p.jenis_layanan = 'Imunisasi' AND p.deleted_at IS NULL AND p.is_permanent_deleted = 0 AND pas.deleted_at IS NULL
  `;

  const params = [];
  if (search) {
    query += ` AND (pas.nama LIKE ? OR pas.nik LIKE ? OR im.nama_bayi_balita LIKE ? OR im.jenis_imunisasi LIKE ?)`;
    const searchParam = `%${search}%`;
    params.push(searchParam, searchParam, searchParam, searchParam);
  }

  query += ` ORDER BY p.tanggal_pemeriksaan DESC`;

  const [rows] = await db.query(query, params);
  return rows;
};

/**
 * Update registrasi imunisasi
 * @param {string} id_pemeriksaan - ID Pemeriksaan
 * @param {Object} data - Data update
 * @param {string} userId - ID Pengguna
 * @returns {Object} Data terbaru
 */
const updateRegistrasiImunisasi = async (id_pemeriksaan, data, userId) => {
  const {
    nama_istri, nik_istri, umur_istri, alamat, no_hp,
    tanggal, no_reg, jenis_imunisasi, pengobatan,
    nama_suami, nik_suami, umur_suami,
    nama_bayi_balita, tanggal_lahir_bayi, tb_bayi, bb_bayi,
    jadwal_selanjutnya, jam_jadwal_selanjutnya, jam_jadwal_selanjutnya_selesai
  } = data;

  const tanggalConverted = convertDate(tanggal);
  const tanggalLahirConverted = convertDate(tanggal_lahir_bayi);

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Cek data pemeriksaan
    const [existingPemeriksaan] = await connection.query(
      'SELECT id_pasien FROM pemeriksaan WHERE id_pemeriksaan = ?',
      [id_pemeriksaan]
    );

    if (!existingPemeriksaan[0]) {
      throw new Error('Data pemeriksaan tidak ditemukan');
    }

    const id_pasien = existingPemeriksaan[0].id_pasien;

    // Fix Bug #2: Jangan update data master pasien saat edit layanan Imunisasi
    // await connection.query(
    //   'UPDATE pasien SET nama = ?, nik = ?, umur = ?, alamat = ?, no_hp = ? WHERE id_pasien = ?',
    //   [nama_istri, nik_istri, umur_istri, alamat, no_hp || null, id_pasien]
    // );

    // Update pemeriksaan
    const subjektif_final = `Imunisasi ${jenis_imunisasi || ''} untuk ${nama_bayi_balita || 'bayi'}`;
    const objektif_final = `Bayi: ${nama_bayi_balita || '-'}, TB: ${tb_bayi || '-'} cm, BB: ${bb_bayi || '-'} kg`;
    const tatalaksana_final = `Jenis Imunisasi: ${jenis_imunisasi || '-'}, Pengobatan: ${pengobatan || '-'}, Jadwal Selanjutnya: ${jadwal_selanjutnya || '-'}`;

    await connection.query(
      `UPDATE pemeriksaan SET 
        subjektif = ?, objektif = ?, tatalaksana = ?, tanggal_pemeriksaan = ?
       WHERE id_pemeriksaan = ?`,
      [subjektif_final, objektif_final, tatalaksana_final, tanggalConverted, id_pemeriksaan]
    );

    // Update layanan_imunisasi
    await connection.query(
      `UPDATE layanan_imunisasi SET
        no_reg = ?, 
        nama_bayi_balita = ?, 
        tanggal_lahir_bayi = ?,
        tb_bayi = ?, 
        bb_bayi = ?,
        jenis_imunisasi = ?, 
        pengobatan = ?, 
        jadwal_selanjutnya = ?, 
        jam_jadwal_selanjutnya = ?,
        jam_jadwal_selanjutnya_selesai = ?,
        no_hp_kontak = ?,
        nama_ibu = ?, 
        nik_ibu = ?, 
        umur_ibu = ?,
        nama_ayah = ?, 
        nik_ayah = ?, 
        umur_ayah = ?
       WHERE id_pemeriksaan = ?`,
      [
        no_reg || null,
        nama_bayi_balita || null,
        tanggalLahirConverted || null,
        tb_bayi || null,
        bb_bayi || null,
        jenis_imunisasi,
        pengobatan || null,
        jadwal_selanjutnya || null,
        jam_jadwal_selanjutnya || '09:00:00',
        jam_jadwal_selanjutnya_selesai || null,
        no_hp || null,
        nama_istri,
        nik_istri,
        umur_istri,
        nama_suami || null,
        nik_suami || null,
        umur_suami || null,
        id_pemeriksaan
      ]
    );

    await connection.commit();
    await auditService.recordDataLog(userId, 'UPDATE', 'layanan_imunisasi', id_pemeriksaan);

    return getImunisasiById(id_pemeriksaan);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Hapus registrasi imunisasi
 * @param {string} id_pemeriksaan - ID Pemeriksaan
 * @param {string} userId - ID Pengguna
 */
const deleteRegistrasiImunisasi = async (id_pemeriksaan, userId) => {
  const connection = await db.getConnection();

  try {
    const [result] = await connection.query(
      'UPDATE pemeriksaan SET deleted_at = NOW() WHERE id_pemeriksaan = ?',
      [id_pemeriksaan]
    );

    if (result.affectedRows > 0) {
      await auditService.recordDataLog(userId, 'DELETE', 'layanan_imunisasi', id_pemeriksaan);
    }

    return { message: 'Data Imunisasi berhasil dihapus' };
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Mendapatkan data ibu berdasarkan NIK
 * @param {string} nik - NIK ibu
 * @returns {Object|null} Data ibu
 */
const getDataIbuByNIK = async (nik) => {
  const query = `
    SELECT 
      id_pasien,
      nama,
      nik,
      umur,
      alamat,
      no_hp
    FROM pasien 
    WHERE nik = ?
  `;

  const [rows] = await db.query(query, [nik]);
  return rows[0] || null;
};

/**
 * Get deleted Imunisasi records
 */
const getDeletedImunisasi = async (search = '') => {
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
        im.id_imunisasi,
        im.no_reg,
        im.nama_bayi_balita,
        im.jenis_imunisasi,
        im.no_reg as nomor_registrasi
      FROM pemeriksaan pm
      LEFT JOIN layanan_imunisasi im ON pm.id_pemeriksaan = im.id_pemeriksaan
      LEFT JOIN pasien p ON pm.id_pasien = p.id_pasien
      WHERE pm.jenis_layanan = 'Imunisasi' AND pm.deleted_at IS NOT NULL AND pm.is_permanent_deleted = 0
    `;

    const params = [];
    if (search && search.trim()) {
      query += ` AND (p.nama LIKE ? OR p.nik LIKE ? OR im.nama_bayi_balita LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY pm.deleted_at DESC';
    const [results] = await db.query(query, params);
    return results;
  } catch (error) {
    throw error;
  }
};

const pemeriksaanService = require('./pemeriksaan.service');

const restoreImunisasi = async (id_pemeriksaan, userId) => {
  return await pemeriksaanService.restorePemeriksaan(id_pemeriksaan, userId);
};

const deletePermanentImunisasi = async (id_pemeriksaan, userId) => {
  return await pemeriksaanService.deletePemeriksaanPermanent(id_pemeriksaan, userId);
};

module.exports = {
  createRegistrasiImunisasi,
  getImunisasiById,
  getAllImunisasi,
  updateRegistrasiImunisasi,
  deleteRegistrasiImunisasi,
  getDataIbuByNIK,
  getDeletedImunisasi,
  restoreImunisasi,
  deletePermanentImunisasi
};
