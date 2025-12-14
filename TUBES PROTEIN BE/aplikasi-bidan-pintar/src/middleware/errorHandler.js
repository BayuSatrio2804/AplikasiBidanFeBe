/**
 * Global Error Handler Middleware
 * Centralized error handling for the application
 */

const { AppError } = require('../utils/errors');

/**
 * Handle MySQL duplicate entry errors
 */
const handleDuplicateError = (err) => {
  const message = err.sqlMessage?.includes('username') 
    ? 'Username sudah digunakan'
    : err.sqlMessage?.includes('email')
    ? 'Email sudah terdaftar'
    : err.sqlMessage?.includes('nik')
    ? 'NIK sudah terdaftar'
    : 'Data sudah ada';
  return { statusCode: 400, message };
};

/**
 * Handle JWT errors
 */
const handleJWTError = () => ({
  statusCode: 401,
  message: 'Token tidak valid. Silakan login kembali.'
});

/**
 * Handle JWT expired error
 */
const handleJWTExpiredError = () => ({
  statusCode: 401,
  message: 'Token sudah kadaluarsa. Silakan login kembali.'
});

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('[ERROR]', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Terjadi kesalahan server';
  let errors = err.errors || null;

  // Handle specific error types
  if (err.code === 'ER_DUP_ENTRY') {
    const handled = handleDuplicateError(err);
    statusCode = handled.statusCode;
    message = handled.message;
  } else if (err.name === 'JsonWebTokenError') {
    const handled = handleJWTError();
    statusCode = handled.statusCode;
    message = handled.message;
  } else if (err.name === 'TokenExpiredError') {
    const handled = handleJWTExpiredError();
    statusCode = handled.statusCode;
    message = handled.message;
  }

  // Don't leak error details in production
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    message = 'Terjadi kesalahan server';
  }

  const response = {
    success: false,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development' && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

/**
 * 404 Not Found handler for undefined routes
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} tidak ditemukan`
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};
