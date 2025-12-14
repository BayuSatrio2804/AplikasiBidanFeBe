/**
 * Laporan (Report) Service
 * Handles all report-related database operations
 */

const db = require('../config/database');

/**
 * Get monthly report data
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
 * Record report generation log
 * @param {string} userId - User who generated the report
 * @param {number} bulan - Month
 * @param {number} tahun - Year
 * @param {string} format - Report format (e.g., 'excel')
 */
const recordLaporanLog = async (userId, bulan, tahun, format) => {
  const query = `
    INSERT INTO laporan_log (id_pasien, jenis_layanan, periode_bulan, periode_tahun, format_file, keterangan)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const keterangan = `Laporan Detil dibuat oleh User ID: ${userId}`;

  await db.query(query, [null, 'BULANAN_DETIL', bulan, tahun, format, keterangan]);
};

module.exports = {
  getLaporanData,
  recordLaporanLog
};