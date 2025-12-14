/**
 * Schedule Service
 * Handles all schedule-related database operations
 */

const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

/**
 * Get all schedules with optional filters
 * @param {number} bulan - Month filter
 * @param {number} tahun - Year filter
 * @param {string} layanan - Service type filter
 * @returns {Array} List of schedules
 */
const listJadwal = async (bulan, tahun, layanan) => {
  let query = `
    SELECT 
      j.id_jadwal, j.tanggal, j.jam_mulai, j.jam_selesai, j.jenis_layanan,
      p.nama AS nama_pasien,
      u.nama_lengkap AS nama_petugas
    FROM jadwal j
    JOIN pasien p ON j.id_pasien = p.id_pasien
    JOIN users u ON j.id_petugas = u.id_user
    WHERE 1=1
  `;
  const params = [];

  if (bulan && tahun) {
    query += ' AND MONTH(j.tanggal) = ? AND YEAR(j.tanggal) = ?';
    params.push(bulan, tahun);
  }

  if (layanan) {
    query += ' AND j.jenis_layanan = ?';
    params.push(layanan);
  }

  query += ' ORDER BY j.tanggal ASC, j.jam_mulai ASC';

  const [rows] = await db.query(query, params);
  return rows;
};

/**
 * Create new schedule
 * @param {Object} data - Schedule data
 * @returns {Object} Created schedule
 */
const createJadwal = async (data) => {
  const { id_pasien, id_petugas, jenis_layanan, tanggal, jam_mulai, jam_selesai } = data;
  const id_jadwal = uuidv4();

  const query = `
    INSERT INTO jadwal (id_jadwal, id_pasien, id_petugas, jenis_layanan, tanggal, jam_mulai, jam_selesai)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  await db.query(query, [id_jadwal, id_pasien, id_petugas, jenis_layanan, tanggal, jam_mulai, jam_selesai]);

  return { id_jadwal, ...data };
};

/**
 * Get schedule by ID with related data
 * @param {string} id_jadwal - Schedule ID
 * @returns {Object|null} Schedule details
 */
const getDetailJadwal = async (id_jadwal) => {
  const query = `
    SELECT 
      j.id_jadwal, j.tanggal, j.jam_mulai, j.jam_selesai, j.jenis_layanan,
      p.nama AS nama_pasien,
      u.nama_lengkap AS nama_petugas
    FROM jadwal j
    JOIN pasien p ON j.id_pasien = p.id_pasien
    JOIN users u ON j.id_petugas = u.id_user
    WHERE j.id_jadwal = ?
  `;

  const [rows] = await db.query(query, [id_jadwal]);
  return rows[0] || null;
};

/**
 * Update schedule
 * @param {string} id_jadwal - Schedule ID
 * @param {Object} data - Updated schedule data
 * @returns {Object} Updated schedule
 */
const updateJadwal = async (id_jadwal, data) => {
  const { id_pasien, id_petugas, jenis_layanan, tanggal, jam_mulai, jam_selesai } = data;

  const query = `
    UPDATE jadwal 
    SET id_pasien = ?, id_petugas = ?, jenis_layanan = ?, tanggal = ?, jam_mulai = ?, jam_selesai = ?
    WHERE id_jadwal = ?
  `;

  await db.query(query, [id_pasien, id_petugas, jenis_layanan, tanggal, jam_mulai, jam_selesai, id_jadwal]);

  return { id_jadwal, ...data };
};

/**
 * Delete schedule
 * @param {string} id_jadwal - Schedule ID
 * @returns {Object} Delete result
 */
const deleteJadwal = async (id_jadwal) => {
  const [result] = await db.query('DELETE FROM jadwal WHERE id_jadwal = ?', [id_jadwal]);
  return result;
};

module.exports = {
  listJadwal,
  createJadwal,
  getDetailJadwal,
  updateJadwal,
  deleteJadwal
};