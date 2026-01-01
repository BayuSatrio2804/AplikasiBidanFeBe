/**
 * Service ANC (Antenatal Care/Pemeriksaan Kehamilan)
 * Menangani semua operasi database terkait ANC dengan dukungan transaksi
 */

const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const auditService = require('./audit.service');
const jadwalService = require('./jadwal.service');
const pasienService = require('./pasien.service');

/**
 * Membuat registrasi ANC baru dengan data terkait
 * Menggunakan transaksi database (ACID) untuk menjaga konsistensi data
 * 
 * Frontend mengirim data: 
 * - Detail Ibu: nama_istri, nik_istri, umur_istri, alamat, no_hp
 * - Detail Layanan: jenis_layanan, tanggal, tindakan, no_reg_lama, no_reg_baru
 * - Detail Suami: nama_suami, nik_suami, umur_suami
 * - Hasil Pemeriksaan: hpht, hpl, hasil_pemeriksaan, keterangan
 * 
 * @param {Object} data - Data registrasi ANC dari frontend
 * @param {string} userId - ID pengguna yang melakukan aksi
 * @returns {Object} Data registrasi yang dibuat
 */
const createRegistrasiANC = async (data, userId) => {
  const {
    nama_istri, nik_istri, umur_istri, alamat, no_hp,
    jenis_layanan, tanggal, tindakan, no_reg_lama, no_reg_baru,
    nama_suami, nik_suami, umur_suami,

    hpht, hpl, jam_hpl, jam_hpl_selesai, hasil_pemeriksaan, keterangan
  } = data;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Cari atau buat data pasien (ibu)
    const id_pasien = await pasienService.findOrCreatePasien({
      nama: nama_istri,
      nik: nik_istri,
      umur: umur_istri,
      alamat: alamat,
      no_hp: no_hp
    }, connection);

    // 2. Buat record pemeriksaan dengan format SOAP
    const id_pemeriksaan = uuidv4();

    // Susun field SOAP (Subjektif, Objektif, Analisa, Tatalaksana) dari data frontend
    const subjektif_final = `ANC Kunjungan${hpht ? `. HPHT: ${hpht}` : ''}${hpl ? `, HPL: ${hpl}` : ''}`;
    const objektif_final = hasil_pemeriksaan ? `Hasil Pemeriksaan: ${hasil_pemeriksaan}` : '';
    const analisa_final = keterangan || '';
    const tatalaksana_final = tindakan ? `Tindakan: ${tindakan}` : '';

    await connection.query(
      `INSERT INTO pemeriksaan (id_pemeriksaan, id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana, tanggal_pemeriksaan)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_pemeriksaan, id_pasien, jenis_layanan, subjektif_final, objektif_final, analisa_final, tatalaksana_final, tanggal]
    );

    // 3. Buat record spesifik layanan ANC
    const id_anc = uuidv4();
    await connection.query(
      `INSERT INTO layanan_anc (id_anc, id_pemeriksaan, no_reg_lama, no_reg_baru, nama_suami, nik_suami, umur_suami, hpht, hpl, jam_hpl, jam_hpl_selesai, hasil_pemeriksaan, tindakan, keterangan)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_anc, id_pemeriksaan, no_reg_lama || null, no_reg_baru || null, nama_suami || null, nik_suami || null, umur_suami || null, hpht || null, hpl || null, jam_hpl || '08:00:00', jam_hpl_selesai || null, hasil_pemeriksaan, tindakan || null, keterangan || null]
    );

    await connection.commit();

    // Catat log aktivitas
    await auditService.recordDataLog(userId, 'CREATE', 'layanan_anc', id_anc);

    return {
      id_anc,
      id_pemeriksaan,
      id_pasien,
      message: 'Registrasi ANC berhasil disimpan'
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Ambil data ANC berdasarkan ID Pemeriksaan
 * @param {string} id_pemeriksaan - Link ke tabel pemeriksaan
 * @returns {Object} Record ANC lengkap dengan data pasien
 */
const getANCById = async (id_pemeriksaan) => {
  const query = `
    SELECT 
      p.id_pemeriksaan, p.id_pasien, p.jenis_layanan, p.subjektif, p.objektif, p.analisa, p.tatalaksana,
      DATE_FORMAT(p.tanggal_pemeriksaan, '%Y-%m-%d') as tanggal_pemeriksaan,
      pas.nama, pas.nik, pas.umur, pas.alamat, pas.no_hp,
      anc.id_anc, anc.no_reg_lama, anc.no_reg_baru, anc.nama_suami, anc.nik_suami, anc.umur_suami,
      DATE_FORMAT(anc.hpht, '%Y-%m-%d') as hpht,
      DATE_FORMAT(anc.hpl, '%Y-%m-%d') as hpl,
      anc.jam_hpl,
      anc.hasil_pemeriksaan, anc.tindakan, anc.keterangan,
      j.jam_mulai, j.jam_selesai
    FROM pemeriksaan p
    LEFT JOIN pasien pas ON p.id_pasien = pas.id_pasien
    LEFT JOIN layanan_anc anc ON p.id_pemeriksaan = anc.id_pemeriksaan
    LEFT JOIN jadwal j ON p.id_pasien = j.id_pasien AND j.jenis_layanan = 'ANC' AND j.tanggal = p.tanggal_pemeriksaan
    WHERE p.id_pemeriksaan = ? AND p.jenis_layanan = 'ANC' AND p.deleted_at IS NULL
  `;
  const [rows] = await db.query(query, [id_pemeriksaan]);
  return rows[0] || null;
};

/**
 * Update registrasi ANC
 * @param {string} id_pemeriksaan - ID Pemeriksaan
 * @param {Object} data - Data update dari frontend
 * @param {string} userId - ID Pengguna
 * @returns {Object} Data ANC yang sudah diupdate
 */
const updateANCRegistrasi = async (id_pemeriksaan, data, userId) => {
  const {
    nama_istri, nik_istri, umur_istri, alamat, no_hp,
    tanggal, tindakan, no_reg_lama, no_reg_baru,
    nama_suami, nik_suami, umur_suami,

    hpht, hpl, jam_hpl, jam_hpl_selesai, hasil_pemeriksaan, keterangan
  } = data;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Cek apakah data pemeriksaan ada
    const [existingPemeriksaan] = await connection.query(
      'SELECT id_pasien FROM pemeriksaan WHERE id_pemeriksaan = ?',
      [id_pemeriksaan]
    );

    if (!existingPemeriksaan[0]) {
      throw new Error('Data pemeriksaan tidak ditemukan');
    }

    const id_pasien = existingPemeriksaan[0].id_pasien;

    // Fix Bug #2: Jangan update data master pasien saat edit layanan ANC
    // Data pasien harusnya diedit lewat menu 'Edit Pasien' khusus
    // await connection.query(
    //   'UPDATE pasien SET nama = ?, nik = ?, umur = ?, alamat = ?, no_hp = ? WHERE id_pasien = ?',
    //   [nama_istri, nik_istri, umur_istri, alamat, no_hp || null, id_pasien]
    // );

    // Update pemeriksaan dengan format SOAP
    const subjektif_final = `ANC Kunjungan${hpht ? `. HPHT: ${hpht}` : ''}${hpl ? `, HPL: ${hpl}` : ''}`;
    const objektif_final = hasil_pemeriksaan ? `Hasil Pemeriksaan: ${hasil_pemeriksaan}` : '';
    const analisa_final = keterangan || '';
    const tatalaksana_final = tindakan ? `Tindakan: ${tindakan}` : '';

    await connection.query(
      `UPDATE pemeriksaan SET subjektif = ?, objektif = ?, analisa = ?, tatalaksana = ?, tanggal_pemeriksaan = ?
       WHERE id_pemeriksaan = ?`,
      [subjektif_final, objektif_final, analisa_final, tatalaksana_final, tanggal, id_pemeriksaan]
    );

    // Update layanan_anc
    await connection.query(
      `UPDATE layanan_anc SET no_reg_lama = ?, no_reg_baru = ?, nama_suami = ?, nik_suami = ?, umur_suami = ?,
       hpht = ?, hpl = ?, jam_hpl = ?, jam_hpl_selesai = ?, hasil_pemeriksaan = ?, tindakan = ?, keterangan = ?
       WHERE id_pemeriksaan = ?`,
      [no_reg_lama || null, no_reg_baru || null, nama_suami || null, nik_suami || null, umur_suami || null, hpht || null, hpl || null, jam_hpl || '08:00:00', jam_hpl_selesai || null, hasil_pemeriksaan, tindakan || null, keterangan || null, id_pemeriksaan]
    );

    await connection.commit();
    await auditService.recordDataLog(userId, 'UPDATE', 'layanan_anc', id_pemeriksaan);

    return getANCById(id_pemeriksaan);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Hapus registrasi ANC
 * @param {string} id_pemeriksaan - ID Pemeriksaan
 * @param {string} userId - ID Pengguna
 */
const deleteANCRegistrasi = async (id_pemeriksaan, userId) => {
  const connection = await db.getConnection();

  try {
    const [result] = await connection.query(
      'UPDATE pemeriksaan SET deleted_at = NOW() WHERE id_pemeriksaan = ?',
      [id_pemeriksaan]
    );

    if (result.affectedRows > 0) {
      await auditService.recordDataLog(userId, 'DELETE', 'layanan_anc', id_pemeriksaan);
    }
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Ambil semua data ANC (opsional filter pencarian)
 * @param {string} search - Kata kunci pencarian
 * @returns {Array} Daftar ANC
 */
const getAllANC = async (search = '') => {
  try {
    let query = `
      SELECT 
        pm.id_pemeriksaan, 
        pm.id_pasien,
        p.nama as nama_pasien, 
        p.nik,
        pm.tanggal_pemeriksaan, 
        pm.jenis_layanan,
        anc.id_anc,
        anc.no_reg_lama,
        anc.no_reg_baru,
        COALESCE(anc.no_reg_baru, anc.no_reg_lama) as nomor_registrasi
      FROM pemeriksaan pm
      LEFT JOIN layanan_anc anc ON pm.id_pemeriksaan = anc.id_pemeriksaan
      LEFT JOIN pasien p ON pm.id_pasien = p.id_pasien
      WHERE pm.jenis_layanan = 'ANC' AND pm.deleted_at IS NULL AND pm.is_permanent_deleted = 0 AND p.deleted_at IS NULL
    `;

    const params = [];

    if (search && search.trim()) {
      query += ` AND (p.nama LIKE ? OR p.nik LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    query += ' ORDER BY pm.tanggal_pemeriksaan DESC';

    const [results] = await db.query(query, params);
    return results;
  } catch (error) {
    throw error;
  }
};

/**
 * Get deleted ANC records
 */
const getDeletedANC = async (search = '') => {
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
        anc.id_anc,
        anc.no_reg_lama,
        anc.no_reg_baru,
        COALESCE(anc.no_reg_baru, anc.no_reg_lama) as nomor_registrasi
      FROM pemeriksaan pm
      LEFT JOIN layanan_anc anc ON pm.id_pemeriksaan = anc.id_pemeriksaan
      LEFT JOIN pasien p ON pm.id_pasien = p.id_pasien
      WHERE pm.jenis_layanan = 'ANC' AND pm.deleted_at IS NOT NULL AND pm.is_permanent_deleted = 0
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

const restoreANC = async (id_pemeriksaan, userId) => {
  return await pemeriksaanService.restorePemeriksaan(id_pemeriksaan, userId);
};

const deletePermanentANC = async (id_pemeriksaan, userId) => {
  return await pemeriksaanService.deletePemeriksaanPermanent(id_pemeriksaan, userId);
};

module.exports = {
  createRegistrasiANC,
  getANCById,
  updateANCRegistrasi,
  deleteANCRegistrasi,
  getAllANC,
  getDeletedANC,
  restoreANC,
  deletePermanentANC
};
