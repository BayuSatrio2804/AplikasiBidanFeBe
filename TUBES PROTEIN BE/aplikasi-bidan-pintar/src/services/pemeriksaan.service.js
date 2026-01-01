/**
 * Service Pemeriksaan
 * Menangani semua operasi database pemeriksaan medis (SOAP)
 */

const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const auditService = require('./audit.service');

/**
 * Ambil semua data pemeriksaan dengan filter opsional
 * @param {string} jenisLayanan - Filter jenis layanan (opsional)
 * @param {string} search - Cari berdasarkan nama pasien (opsional)
 * @returns {Array} Daftar pemeriksaan
 */
const getAllPemeriksaan = async (jenisLayanan = null, search = null) => {
  // Formalisasi string kosong menjadi null
  jenisLayanan = jenisLayanan && jenisLayanan.trim() !== '' ? jenisLayanan.trim() : null;
  search = search && search.trim() !== '' ? search.trim() : null;

  let query = `
    SELECT p.*, pas.nama AS nama_pasien
  `;

  // Tambahkan field spesifik layanan berdasarkan jenis_layanan
  if (jenisLayanan === 'KB') {
    query += `, kb.id_kb, kb.nomor_registrasi_lama, kb.nomor_registrasi_baru, kb.metode`;
  } else if (jenisLayanan === 'ANC') {
    query += `, anc.id_anc, anc.no_reg_lama, anc.no_reg_baru`;
  } else if (jenisLayanan === 'Imunisasi') {
    query += `, imun.id_imunisasi, imun.no_reg, imun.jenis_imunisasi`;
  } else if (jenisLayanan === 'Persalinan') {
    query += `, per.id_persalinan, per.no_reg`;
  } else if (jenisLayanan === 'Kunjungan Pasien') {
    query += `, kp.id_kunjungan`;
  }

  query += `
    FROM pemeriksaan p
    LEFT JOIN pasien pas ON p.id_pasien = pas.id_pasien
  `;

  // Join tabel layanan berdasarkan jenis_layanan
  if (jenisLayanan === 'KB') {
    query += ` LEFT JOIN layanan_kb kb ON p.id_pemeriksaan = kb.id_pemeriksaan`;
  } else if (jenisLayanan === 'ANC') {
    query += ` LEFT JOIN layanan_anc anc ON p.id_pemeriksaan = anc.id_pemeriksaan`;
  } else if (jenisLayanan === 'Imunisasi') {
    query += ` LEFT JOIN layanan_imunisasi imun ON p.id_pemeriksaan = imun.id_pemeriksaan`;
  } else if (jenisLayanan === 'Persalinan') {
    query += ` LEFT JOIN layanan_persalinan per ON p.id_pemeriksaan = per.id_pemeriksaan`;
  } else if (jenisLayanan === 'Kunjungan Pasien') {
    query += ` LEFT JOIN layanan_kunjungan_pasien kp ON p.id_pemeriksaan = kp.id_pemeriksaan`;
  }

  query += ` WHERE 1=1 AND p.deleted_at IS NULL AND pas.deleted_at IS NULL`;
  const params = [];

  // Filter jenis_layanan jika ada
  if (jenisLayanan) {
    query += ` AND p.jenis_layanan = ?`;
    params.push(jenisLayanan);
  }

  // Filter nama pasien jika ada
  if (search) {
    query += ` AND pas.nama LIKE ?`;
    params.push(`%${search}%`);
  }

  query += ` ORDER BY p.tanggal_pemeriksaan DESC`;

  const [rows] = await db.query(query, params);

  // Normalisasi nama field untuk konsistensi frontend
  const normalizedRows = rows.map(row => {
    // Normalisasi field nomor_registrasi berdasarkan jenis layanan
    if (row.jenis_layanan === 'KB') {
      row.nomor_registrasi = row.nomor_registrasi_baru || row.nomor_registrasi_lama;
    } else if (row.jenis_layanan === 'ANC') {
      row.nomor_registrasi = row.no_reg_baru || row.no_reg_lama;
    } else if (row.jenis_layanan === 'Imunisasi') {
      row.nomor_registrasi = row.no_reg;
    } else if (row.jenis_layanan === 'Persalinan') {
      row.nomor_registrasi = row.no_reg;
    }
    return row;
  });

  return normalizedRows;
};

/**
 * Ambil detail pemeriksaan berdasarkan ID
 * @param {string} id_pemeriksaan - ID Pemeriksaan
 * @returns {Object|null} Detail pemeriksaan
 */
const getDetailPemeriksaan = async (id_pemeriksaan) => {
  const query = `
    SELECT p.*, pas.nama AS nama_pasien
    FROM pemeriksaan p
    LEFT JOIN pasien pas ON p.id_pasien = pas.id_pasien
    WHERE p.id_pemeriksaan = ?
  `;
  const [rows] = await db.query(query, [id_pemeriksaan]);
  return rows[0] || null;
};

/**
 * Buat record pemeriksaan baru (SOAP)
 * @param {Object} data - Data pemeriksaan
 * @param {string} userId - ID Pengguna
 * @returns {Object} Pemeriksaan yang dibuat
 */
const createPemeriksaan = async (data, userId) => {
  const { id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana } = data;
  const id_pemeriksaan = uuidv4();

  const query = `
    INSERT INTO pemeriksaan 
    (id_pemeriksaan, id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana, tanggal_pemeriksaan)
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  await db.query(query, [id_pemeriksaan, id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana]);
  await auditService.recordDataLog(userId, 'CREATE', 'pemeriksaan', id_pemeriksaan);

  return { id_pemeriksaan, ...data };
};

/**
 * Update record pemeriksaan
 * @param {string} id_pemeriksaan - ID Pemeriksaan
 * @param {string} userId - ID Pengguna
 * @param {Object} data - Data pemeriksaan update
 * @returns {Object} Pemeriksaan terupdate
 */
const updatePemeriksaan = async (id_pemeriksaan, userId, data) => {
  const { id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana } = data;

  const query = `
    UPDATE pemeriksaan 
    SET id_pasien = ?, jenis_layanan = ?, subjektif = ?, objektif = ?, analisa = ?, tatalaksana = ?
    WHERE id_pemeriksaan = ?
  `;

  await db.query(query, [id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana, id_pemeriksaan]);
  await auditService.recordDataLog(userId, 'UPDATE', 'pemeriksaan', id_pemeriksaan);

  return { id_pemeriksaan, ...data };
};

module.exports = {
  getAllPemeriksaan,
  getDetailPemeriksaan,
  createPemeriksaan,
  updatePemeriksaan
};
