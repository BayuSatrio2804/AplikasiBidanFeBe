/**
 * Audit Service
 * Handles logging of user actions and access attempts
 */

const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

/**
 * Record login attempt
 * @param {string|null} userId - User ID (null if user not found)
 * @param {string} username - Username attempted
 * @param {'BERHASIL'|'GAGAL'} status - Login status
 * @param {string} ipAddress - Client IP address
 */
const recordLoginAttempt = async (userId, username, status, ipAddress) => {
  try {
    const id_akses = uuidv4();
    const query = `
      INSERT INTO audit_log_akses (id_akses, id_user, username, status, ip_address, tanggal_akses)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    await db.query(query, [id_akses, userId, username, status, ipAddress]);
  } catch (error) {
    console.error('[AUDIT] Login attempt log failed:', error.message);
  }
};

/**
 * Get access logs (login history)
 * @param {Object} filters - Filter options
 * @returns {Array} Array of access logs
 */
const getAccessLogs = async (filters = {}) => {
  try {
    let query = 'SELECT * FROM audit_log_akses WHERE 1=1';
    const params = [];

    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }
    if (filters.username) {
      query += ' AND username LIKE ?';
      params.push(`%${filters.username}%`);
    }
    if (filters.startDate) {
      query += ' AND tanggal_akses >= ?';
      params.push(filters.startDate);
    }
    if (filters.endDate) {
      query += ' AND tanggal_akses <= ?';
      params.push(filters.endDate);
    }

    query += ' ORDER BY tanggal_akses DESC LIMIT 1000';

    const [results] = await db.query(query, params);
    return results;
  } catch (error) {
    console.error('[AUDIT] Get access logs failed:', error.message);
    throw error;
  }
};

/**
 * Record data modification log (CRUD operations)
 * @param {string} userId - User ID performing the action
 * @param {'CREATE'|'UPDATE'|'DELETE'} action - Action type
 * @param {string} tableName - Affected table name
 * @param {string} dataId - ID of affected record
 */
const recordDataLog = async (userId, action, tableName, dataId) => {
  try {
    const id_audit = uuidv4();
    const query = `
      INSERT INTO audit_logs (id_audit, id_user, action, description, id_data_terkait, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    await db.query(query, [id_audit, userId, action, tableName, dataId]);
  } catch (error) {
    console.error('[AUDIT] Data log failed:', error.message);
    throw error;
  }
};

/**
 * Get basic data modification logs
 * @param {Object} filters - Filter options
 * @returns {Array} Array of basic audit logs
 */
const getDataLogs = async (filters = {}) => {
  try {
    let query = 'SELECT * FROM audit_logs WHERE 1=1';
    const params = [];

    if (filters.action) {
      query += ' AND action = ?';
      params.push(filters.action);
    }
    if (filters.description) {
      query += ' AND description LIKE ?';
      params.push(`%${filters.description}%`);
    }
    if (filters.username) {
      query += ' AND id_user = (SELECT id_user FROM users WHERE username LIKE ?)';
      params.push(`%${filters.username}%`);
    }
    if (filters.startDate) {
      query += ' AND created_at >= ?';
      params.push(filters.startDate);
    }
    if (filters.endDate) {
      query += ' AND created_at <= ?';
      params.push(filters.endDate);
    }

    query += ' ORDER BY created_at DESC LIMIT 1000';

    const [results] = await db.query(query, params);
    return results;
  } catch (error) {
    console.error('[AUDIT] Get data logs failed:', error.message);
    throw error;
  }
};

/**
 * Get data modification logs with detailed information
 * @param {Object} filters - Filter options
 * @returns {Array} Array of audit logs with user info and data details
 */
const getDetailedDataLogs = async (filters = {}) => {
  try {
    let query = `
      SELECT 
        a.id_audit, 
        a.id_user, 
        a.action, 
        a.description AS kategori, 
        a.id_data_terkait,
        a.created_at AS tanggal,
        u.username AS diubah_oleh,
        p.nama AS nama_pasien,
        CASE 
          WHEN a.description = 'layanan_anc' THEN anc.no_reg_baru
          WHEN a.description = 'layanan_kb' THEN kb.nomor_registrasi_baru
          WHEN a.description = 'layanan_persalinan' THEN pers.no_reg_baru
          WHEN a.description = 'layanan_imunisasi' THEN imun.no_reg
          WHEN a.description = 'layanan_kunjungan_pasien' THEN kjung.no_reg
          WHEN a.description = 'jadwal' THEN NULL
          ELSE NULL
        END AS nomor_registrasi
      FROM audit_logs a
      LEFT JOIN users u ON a.id_user = u.id_user
      LEFT JOIN pemeriksaan pem ON a.id_data_terkait = pem.id_pemeriksaan
      LEFT JOIN pasien p ON pem.id_pasien = p.id_pasien
      LEFT JOIN layanan_anc anc ON a.id_data_terkait = anc.id_anc
      LEFT JOIN layanan_kb kb ON a.id_data_terkait = kb.id_kb
      LEFT JOIN layanan_persalinan pers ON a.id_data_terkait = pers.id_persalinan
      LEFT JOIN layanan_imunisasi imun ON a.id_data_terkait = imun.id_imunisasi
      LEFT JOIN layanan_kunjungan_pasien kjung ON a.id_data_terkait = kjung.id_kunjungan
      LEFT JOIN jadwal jad ON a.id_data_terkait = jad.id_jadwal
      LEFT JOIN pasien p2 ON jad.id_pasien = p2.id_pasien
      WHERE 1=1
    `;
    const params = [];

    if (filters.action) {
      query += ' AND a.action = ?';
      params.push(filters.action);
    }
    if (filters.kategori) {
      query += ' AND a.description LIKE ?';
      params.push(`%${filters.kategori}%`);
    }
    if (filters.username) {
      query += ' AND u.username LIKE ?';
      params.push(`%${filters.username}%`);
    }
    if (filters.startDate) {
      query += ' AND a.created_at >= ?';
      params.push(filters.startDate);
    }
    if (filters.endDate) {
      query += ' AND a.created_at <= ?';
      params.push(filters.endDate);
    }

    query += ' ORDER BY a.created_at DESC LIMIT 1000';

    const [results] = await db.query(query, params);
    return results;
  } catch (error) {
    console.error('[AUDIT] Get detailed data logs failed:', error.message);
    throw error;
  }
};

module.exports = {
  recordLoginAttempt,
  recordDataLog,
  getAccessLogs,
  getDataLogs,
  getDetailedDataLogs
};