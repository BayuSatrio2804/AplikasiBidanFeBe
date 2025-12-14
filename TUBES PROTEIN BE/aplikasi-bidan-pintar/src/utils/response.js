/**
 * Standardized API Response Utilities
 * Provides consistent response format across all endpoints
 */

/**
 * Success response helper
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {*} data - Response data
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const success = (res, message, data = null, statusCode = 200) => {
  const response = {
    success: true,
    message
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  return res.status(statusCode).json(response);
};

/**
 * Created response helper (HTTP 201)
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {*} data - Created resource data
 */
const created = (res, message, data = null) => {
  return success(res, message, data, 201);
};

/**
 * Error response helper
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {*} errors - Additional error details
 */
const error = (res, message, statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message
  };
  
  if (errors !== null) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
};

/**
 * Bad request response helper (HTTP 400)
 */
const badRequest = (res, message, errors = null) => {
  return error(res, message, 400, errors);
};

/**
 * Unauthorized response helper (HTTP 401)
 */
const unauthorized = (res, message = 'Akses ditolak. Silakan login terlebih dahulu.') => {
  return error(res, message, 401);
};

/**
 * Forbidden response helper (HTTP 403)
 */
const forbidden = (res, message = 'Akses ditolak. Anda tidak memiliki izin.') => {
  return error(res, message, 403);
};

/**
 * Not found response helper (HTTP 404)
 */
const notFound = (res, message = 'Data tidak ditemukan.') => {
  return error(res, message, 404);
};

/**
 * Validation error response helper (HTTP 400)
 * @param {Object} res - Express response object
 * @param {Array} errors - Array of validation errors
 */
const validationError = (res, errors) => {
  return error(res, 'Validasi input gagal', 400, errors);
};

/**
 * Server error response helper (HTTP 500)
 */
const serverError = (res, message = 'Terjadi kesalahan server', err = null) => {
  // Log error for debugging (in production, use proper logging)
  if (err) {
    console.error('[SERVER_ERROR]', err);
  }
  return error(res, message, 500);
};

module.exports = {
  success,
  created,
  error,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  validationError,
  serverError
};
