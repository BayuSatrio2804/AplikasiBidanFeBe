/**
 * Audit Controller
 * Handles audit log retrieval and filtering
 */

const auditService = require('../services/audit.service');
const { success, serverError } = require('../utils/response');

/**
 * Get all login access logs
 * GET /api/audit/akses
 */
const getAccessLogs = async (req, res) => {
  try {
    const { status, startDate, endDate, username } = req.query;
    const logs = await auditService.getAccessLogs({
      status,
      startDate,
      endDate,
      username
    });
    return success(res, 'Access logs retrieved successfully', logs);
  } catch (error) {
    console.error('[AUDIT] Error getting access logs:', error.message);
    return serverError(res, error.message);
  }
};

/**
 * Get all data modification logs
 * GET /api/audit/data
 */
const getDataLogs = async (req, res) => {
  try {
    const { action, description, username, startDate, endDate } = req.query;
    const logs = await auditService.getDataLogs({
      action,
      description,
      username,
      startDate,
      endDate
    });
    return success(res, 'Data logs retrieved successfully', logs);
  } catch (error) {
    console.error('[AUDIT] Error getting data logs:', error.message);
    return serverError(res, error.message);
  }
};

/**
 * Get detailed data modification logs with pasien and registrasi info
 * GET /api/audit/data-detailed
 */
const getDetailedDataLogs = async (req, res) => {
  try {
    const { action, kategori, username, startDate, endDate } = req.query;
    const logs = await auditService.getDetailedDataLogs({
      action,
      kategori,
      username,
      startDate,
      endDate
    });
    return success(res, 'Detailed data logs retrieved successfully', logs);
  } catch (error) {
    console.error('[AUDIT] Error getting detailed data logs:', error.message);
    return serverError(res, error.message);
  }
};

module.exports = {
  getAccessLogs,
  getDataLogs,
  getDetailedDataLogs
};
