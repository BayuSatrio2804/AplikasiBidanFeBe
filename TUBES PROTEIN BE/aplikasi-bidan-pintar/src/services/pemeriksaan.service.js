/**
 * Examination Service
 * Handles all medical examination (SOAP) database operations
 */

const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const auditService = require('./audit.service');

/**
 * Get all examination records with optional filtering
 * @param {string} jenisLayanan - Filter by service type (optional)
 * @param {string} search - Search by patient name (optional)
 * @returns {Array} List of examinations
 */
const getAllPemeriksaan = async (jenisLayanan = null, search = null) => {
  console.log('🔍 Service getAllPemeriksaan called with:', { jenisLayanan, search });
  
  // Normalize empty strings to null
  jenisLayanan = jenisLayanan && jenisLayanan.trim() !== '' ? jenisLayanan.trim() : null;
  search = search && search.trim() !== '' ? search.trim() : null;
  
  console.log('🔍 After normalization:', { jenisLayanan, search });
  
  let query = `
    SELECT p.*, pas.nama AS nama_pasien
  `;

  // Add layanan-specific fields based on jenis_layanan
  if (jenisLayanan === 'KB') {
    query += `, kb.id_kb, kb.nomor_registrasi_lama, kb.nomor_registrasi_baru, kb.metode`;
  } else if (jenisLayanan === 'ANC') {
    query += `, anc.id_anc, anc.no_reg_lama, anc.no_reg_baru`;
  } else if (jenisLayanan === 'Imunisasi') {
    query += `, imun.id_imunisasi, imun.no_reg, imun.jenis_imunisasi`;
  } else if (jenisLayanan === 'Persalinan') {
    query += `, per.id_persalinan, per.no_reg`;
  } else if (jenisLayanan === 'Kunjungan Pasien') {
    query += `, kp.id_kunjungan_pasien`;
  }

  query += `
    FROM pemeriksaan p
    LEFT JOIN pasien pas ON p.id_pasien = pas.id_pasien
  `;

  // Add layanan JOINs based on jenis_layanan
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

  query += ` WHERE 1=1`;
  const params = [];

  // Filter by jenis_layanan if provided
  if (jenisLayanan) {
    query += ` AND p.jenis_layanan = ?`;
    params.push(jenisLayanan);
    console.log('  ➕ Added jenis_layanan filter:', jenisLayanan);
  }

  // Search by patient name if provided
  if (search) {
    query += ` AND pas.nama LIKE ?`;
    params.push(`%${search}%`);
    console.log('  ➕ Added search filter:', search);
  }

  query += ` ORDER BY p.tanggal_pemeriksaan DESC`;

  console.log('  📝 Final query params:', params);
  const [rows] = await db.query(query, params);
  console.log('  ✅ Query returned:', rows.length, 'rows');
  
  // Normalize field names for consistency in frontend
  const normalizedRows = rows.map(row => {
    // Normalize nomor_registrasi field based on service type
    if (row.jenis_layanan === 'KB' && row.nomor_registrasi_baru) {
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
 * Get examination by ID
 * @param {string} id_pemeriksaan - Examination ID
 * @returns {Object|null} Examination details
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
 * Create new examination record (SOAP)
 * @param {Object} data - Examination data
 * @param {string} userId - User performing the action
 * @returns {Object} Created examination
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
 * Update examination record
 * @param {string} id_pemeriksaan - Examination ID
 * @param {string} userId - User performing the action
 * @param {Object} data - Updated examination data
 * @returns {Object} Updated examination
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