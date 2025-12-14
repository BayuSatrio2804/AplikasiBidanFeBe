/**
 * Custom Error Classes
 * Standardized error handling across the application
 */

/**
 * Base Application Error
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Bad Request Error (400)
 */
class BadRequestError extends AppError {
  constructor(message = 'Permintaan tidak valid') {
    super(message, 400);
  }
}

/**
 * Unauthorized Error (401)
 */
class UnauthorizedError extends AppError {
  constructor(message = 'Akses ditolak. Silakan login terlebih dahulu.') {
    super(message, 401);
  }
}

/**
 * Forbidden Error (403)
 */
class ForbiddenError extends AppError {
  constructor(message = 'Akses ditolak. Anda tidak memiliki izin.') {
    super(message, 403);
  }
}

/**
 * Not Found Error (404)
 */
class NotFoundError extends AppError {
  constructor(message = 'Data tidak ditemukan') {
    super(message, 404);
  }
}

/**
 * Conflict Error (409) - for duplicate entries
 */
class ConflictError extends AppError {
  constructor(message = 'Data sudah ada') {
    super(message, 409);
  }
}

/**
 * Validation Error (400)
 */
class ValidationError extends AppError {
  constructor(message = 'Validasi gagal', errors = []) {
    super(message, 400);
    this.errors = errors;
  }
}

module.exports = {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError
};
