/**
 * Patient Service
 * Handles all patient-related database operations
 */

const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const auditService = require('./audit.service');

/**
 * Get all patients with optional search
 * @param {string} search - Search term for name or NIK
 * @returns {Array} List of patients
 */
const getAllPasien = async (search = null) => {
  let query = 'SELECT * FROM pasien';
  const params = [];

  if (search) {
    query += ' WHERE nama LIKE ? OR nik LIKE ?';
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY created_at DESC';
  
  const [rows] = await db.query(query, params);
  return rows;
};

/**
 * Get patient by ID
 * @param {string} id - Patient ID
 * @returns {Object|null} Patient data
 */
const getPasienById = async (id) => {
  const query = 'SELECT * FROM pasien WHERE id_pasien = ?';
  const [rows] = await db.query(query, [id]);
  return rows[0] || null;
};

/**
 * Create new patient
 * @param {Object} data - Patient data
 * @param {string} userId - User performing the action
 * @returns {Object} Created patient data
 */
const createPasien = async (data, userId) => {
  const { nama, NIK, umur, alamat, no_hp } = data;
  const id_pasien = uuidv4();

  const query = `
    INSERT INTO pasien (id_pasien, nama, nik, umur, alamat, no_hp) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  await db.query(query, [id_pasien, nama, NIK, umur, alamat, no_hp]);
  await auditService.recordDataLog(userId, 'CREATE', 'pasien', id_pasien);

  return { id_pasien, nama, NIK, umur, alamat, no_hp };
};

/**
 * Update patient data
 * @param {string} id - Patient ID
 * @param {string} userId - User performing the action
 * @param {Object} data - Updated patient data
 * @returns {Object} Updated patient data
 */
const updatePasien = async (id, userId, data) => {
  const { nama, NIK, umur, alamat, no_hp } = data;

  const query = `
    UPDATE pasien 
    SET nama = ?, nik = ?, umur = ?, alamat = ?, no_hp = ? 
    WHERE id_pasien = ?
  `;
  
  await db.query(query, [nama, NIK, umur, alamat, no_hp, id]);
  await auditService.recordDataLog(userId, 'UPDATE', 'pasien', id);

  return { id_pasien: id, nama, NIK, umur, alamat, no_hp };
};

/**
 * Delete patient
 * @param {string} id - Patient ID
 * @param {string} userId - User performing the action
 * @returns {Object} Delete result
 */
const deletePasien = async (id, userId) => {
  const [result] = await db.query('DELETE FROM pasien WHERE id_pasien = ?', [id]);

  if (result.affectedRows > 0) {
    await auditService.recordDataLog(userId, 'DELETE', 'pasien', id);
  }

  return result;
};

/**
 * Get patient examination history
 * @param {string} id - Patient ID
 * @returns {Array} Examination history
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

module.exports = {
  getAllPasien,
  getPasienById,
  createPasien,
  updatePasien,
  deletePasien,
  getRiwayatPasien
};