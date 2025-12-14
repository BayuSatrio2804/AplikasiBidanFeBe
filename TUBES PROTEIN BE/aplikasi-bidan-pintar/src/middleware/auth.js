/**
 * Authentication Middleware
 * JWT token verification
 */

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/constant');
const { unauthorized, forbidden } = require('../utils/response');

/**
 * Verify JWT token from Authorization header
 * Token format: Bearer <token>
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if authorization header exists and has correct format
  if (!authHeader?.startsWith('Bearer ')) {
    return unauthorized(res, 'Token tidak ditemukan atau format salah');
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify and decode token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach user data to request object
    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return forbidden(res, 'Token sudah kadaluarsa. Silakan login kembali.');
    }
    return forbidden(res, 'Token tidak valid');
  }
};

/**
 * Optional authentication - doesn't fail if no token
 * Useful for routes that work with or without auth
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email
    };
  } catch (error) {
    // Ignore token errors for optional auth
  }

  next();
};

module.exports = {
  verifyToken,
  optionalAuth
};