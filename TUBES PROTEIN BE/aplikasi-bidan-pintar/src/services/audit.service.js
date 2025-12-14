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

module.exports = {
  recordLoginAttempt,
  recordDataLog
};