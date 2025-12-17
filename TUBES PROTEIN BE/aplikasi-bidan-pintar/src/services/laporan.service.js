/**
 * Laporan (Report) Service
 * Handles all report-related database operations
 */

const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

/**
 * Get monthly report data for Excel export
 * @param {number} bulan - Month (1-12)
 * @param {number} tahun - Year
 * @returns {Array} Report data
 */
const getLaporanData = async (bulan, tahun) => {
  const query = `
    SELECT 
      p.nama AS nama_pasien,
      r.tanggal_pemeriksaan AS tanggal,
      r.jenis_layanan,
      r.subjektif,
      r.objektif,
      r.analisa,
      r.tatalaksana
    FROM pemeriksaan r
    JOIN pasien p ON r.id_pasien = p.id_pasien
    WHERE MONTH(r.tanggal_pemeriksaan) = ? AND YEAR(r.tanggal_pemeriksaan) = ?
    ORDER BY r.tanggal_pemeriksaan ASC
  `;

  const [rows] = await db.query(query, [bulan, tahun]);
  return rows;
};

/**
 * Get list of laporan summaries
 * @param {Object} filters - Filter options
 * @returns {Array} Laporan list
 */
const getLaporanList = async (filters = {}) => {
  let query = `
    SELECT 
      id_laporan,
      jenis_layanan,
      periode,
      tanggal_dibuat,
      jumlah_pasien,
      jumlah_kunjungan,
      label,
      created_at
    FROM laporan
    WHERE 1=1
  `;
  
  const params = [];
  
  if (filters.jenis_layanan) {
    query += ` AND jenis_layanan = ?`;
    params.push(filters.jenis_layanan);
  }
  
  if (filters.periode) {
    query += ` AND periode = ?`;
    params.push(filters.periode);
  }
  
  if (filters.search) {
    query += ` AND (label LIKE ? OR jenis_layanan LIKE ? OR periode LIKE ?)`;
    const searchPattern = `%${filters.search}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }
  
  query += ` ORDER BY tanggal_dibuat DESC, created_at DESC`;
  
  if (filters.limit) {
    query += ` LIMIT ?`;
    params.push(parseInt(filters.limit));
  }
  
  const [rows] = await db.query(query, params);
  return rows;
};

/**
 * Get laporan by ID
 * @param {string} id_laporan - Laporan ID
 * @returns {Object} Laporan data
 */
const getLaporanById = async (id_laporan) => {
  const query = `
    SELECT 
      id_laporan,
      jenis_layanan,
      periode,
      tanggal_dibuat,
      jumlah_pasien,
      jumlah_kunjungan,
      label,
      created_at,
      updated_at
    FROM laporan
    WHERE id_laporan = ?
  `;
  
  const [rows] = await db.query(query, [id_laporan]);
  return rows[0];
};

/**
 * Create new laporan summary
 * @param {Object} data - Laporan data
 * @returns {Object} Created laporan
 */
const createLaporan = async (data) => {
  const id_laporan = uuidv4();
  
  const query = `
    INSERT INTO laporan (
      id_laporan,
      jenis_layanan,
      periode,
      tanggal_dibuat,
      jumlah_pasien,
      jumlah_kunjungan,
      label
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  const params = [
    id_laporan,
    data.jenis_layanan,
    data.periode,
    data.tanggal_dibuat || new Date().toISOString().split('T')[0],
    data.jumlah_pasien || 0,
    data.jumlah_kunjungan || 0,
    data.label || null
  ];
  
  await db.query(query, params);
  
  return await getLaporanById(id_laporan);
};

/**
 * Update laporan
 * @param {string} id_laporan - Laporan ID
 * @param {Object} data - Update data
 * @returns {Object} Updated laporan
 */
const updateLaporan = async (id_laporan, data) => {
  const updates = [];
  const params = [];
  
  if (data.jenis_layanan !== undefined) {
    updates.push('jenis_layanan = ?');
    params.push(data.jenis_layanan);
  }
  
  if (data.periode !== undefined) {
    updates.push('periode = ?');
    params.push(data.periode);
  }
  
  if (data.tanggal_dibuat !== undefined) {
    updates.push('tanggal_dibuat = ?');
    params.push(data.tanggal_dibuat);
  }
  
  if (data.jumlah_pasien !== undefined) {
    updates.push('jumlah_pasien = ?');
    params.push(data.jumlah_pasien);
  }
  
  if (data.jumlah_kunjungan !== undefined) {
    updates.push('jumlah_kunjungan = ?');
    params.push(data.jumlah_kunjungan);
  }
  
  if (data.label !== undefined) {
    updates.push('label = ?');
    params.push(data.label);
  }
  
  if (updates.length === 0) {
    return await getLaporanById(id_laporan);
  }
  
  params.push(id_laporan);
  
  const query = `UPDATE laporan SET ${updates.join(', ')} WHERE id_laporan = ?`;
  await db.query(query, params);
  
  return await getLaporanById(id_laporan);
};

/**
 * Delete laporan
 * @param {string} id_laporan - Laporan ID
 * @returns {boolean} Success status
 */
const deleteLaporan = async (id_laporan) => {
  const query = `DELETE FROM laporan WHERE id_laporan = ?`;
  const [result] = await db.query(query, [id_laporan]);
  
  return result.affectedRows > 0;
};

/**
 * Calculate summary statistics for a period
 * @param {string} jenis_layanan - Service type or 'Semua' for all
 * @param {number} bulan - Month (1-12)
 * @param {number} tahun - Year
 * @returns {Object} Statistics
 */
const calculateLaporanSummary = async (jenis_layanan, bulan, tahun) => {
  let query = `
    SELECT 
      COUNT(DISTINCT pe.id_pasien) as jumlah_pasien,
      COUNT(pe.id_pemeriksaan) as jumlah_kunjungan
    FROM pemeriksaan pe
    WHERE MONTH(pe.tanggal_pemeriksaan) = ? 
      AND YEAR(pe.tanggal_pemeriksaan) = ?
  `;
  
  const params = [bulan, tahun];
  
  if (jenis_layanan && jenis_layanan !== 'Semua') {
    query += ` AND pe.jenis_layanan = ?`;
    params.push(jenis_layanan);
  }
  
  const [rows] = await db.query(query, params);
  
  return {
    jumlah_pasien: rows[0]?.jumlah_pasien || 0,
    jumlah_kunjungan: rows[0]?.jumlah_kunjungan || 0
  };
};

module.exports = {
  getLaporanData,
  getLaporanList,
  getLaporanById,
  createLaporan,
  updateLaporan,
  deleteLaporan,
  calculateLaporanSummary
};