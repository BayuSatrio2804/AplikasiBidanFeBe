/**
 * Authentication Service
 * Handles user authentication, registration, and profile management
 */

const db = require('../config/database');
const otpService = require('./otp.service');
const auditService = require('./audit.service');

/**
 * Find user by username or email (includes password for authentication)
 * @param {string} identifier - Username or email
 * @returns {Object|null} User data with password
 */
const getUserByUsernameOrEmail = async (identifier) => {
  const query = `
    SELECT id_user, nama_lengkap, username, email, password, is_verified
    FROM users 
    WHERE username = ? OR email = ?
  `;
  const [rows] = await db.query(query, [identifier, identifier]);
  return rows[0] || null;
};

/**
 * Find user by ID (without password)
 * @param {string} id_user - User ID
 * @returns {Object|null} User data
 */
const getUserById = async (id_user) => {
  const query = `
    SELECT id_user, nama_lengkap, username, email, is_verified, created_at
    FROM users 
    WHERE id_user = ?
  `;
  const [rows] = await db.query(query, [id_user]);
  return rows[0] || null;
};

/**
 * Find user by email (for password reset)
 * @param {string} email - User email
 * @returns {Object|null} User data
 */
const getUserByEmail = async (email) => {
  const query = `
    SELECT id_user, nama_lengkap, username, email, is_verified
    FROM users 
    WHERE email = ?
  `;
  const [rows] = await db.query(query, [email]);
  return rows[0] || null;
};

/**
 * Register new user
 * @param {string} id_user - Generated user ID
 * @param {string} nama_lengkap - Full name
 * @param {string} username - Username
 * @param {string} email - Email address
 * @param {string} hashedPassword - Bcrypt hashed password
 * @returns {Object} Created user data
 */
const registerUser = async (id_user, nama_lengkap, username, email, hashedPassword) => {
  const query = `
    INSERT INTO users (id_user, nama_lengkap, username, email, password, is_verified) 
    VALUES (?, ?, ?, ?, ?, 1)
  `;
  
  await db.query(query, [id_user, nama_lengkap, username, email, hashedPassword]);
  
  return { id_user, nama_lengkap, username, email };
};

/**
 * Process login and send OTP
 * @param {Object} user - User object
 * @param {string} ipAddress - Client IP address
 * @returns {Object} Login result with message
 */
const loginUser = async (user, ipAddress) => {
  // Record successful login attempt
  await auditService.recordLoginAttempt(user.id_user, user.username, 'BERHASIL', ipAddress);
  
  // Generate and send OTP
  await otpService.saveAndSendOTP(user.id_user, user.email);

  return { 
    message: `Kode verifikasi (OTP) telah dikirimkan ke email ${user.email}`
  };
};

/**
 * Verify OTP code
 * @param {Object} user - User object
 * @param {string} otp_code - OTP code to verify
 * @returns {Object} Verified user data
 */
const verifyOTP = async (user, otp_code) => {
  await otpService.validateOTP(user, otp_code);
  return getUserById(user.id_user);
};

/**
 * Update user profile
 * @param {string} id_user - User ID
 * @param {Object} data - Profile data to update
 * @param {string|null} hashedPassword - New password (optional)
 * @returns {Object} Updated user data
 */
const updateProfile = async (id_user, data, hashedPassword = null) => {
  const { nama_lengkap, username, email } = data;
  
  const fields = [];
  const params = [];

  // Only update fields that are provided
  if (nama_lengkap !== undefined) {
    fields.push('nama_lengkap = ?');
    params.push(nama_lengkap);
  }

  if (username !== undefined) {
    fields.push('username = ?');
    params.push(username);
  }

  if (email !== undefined) {
    fields.push('email = ?');
    params.push(email);
  }

  if (hashedPassword) {
    fields.push('password = ?');
    params.push(hashedPassword);
  }

  // If no fields to update, return current user data
  if (fields.length === 0) {
    return getUserById(id_user);
  }

  params.push(id_user);

  const query = `UPDATE users SET ${fields.join(', ')} WHERE id_user = ?`;
  console.log('🔄 Updating profile:', { query, params: params.map((p, i) => i === params.length - 1 ? 'user_id' : p) });
  
  const [result] = await db.query(query, params);
  console.log('✅ Update result:', { affectedRows: result.affectedRows, changedRows: result.changedRows });

  // Return updated user data
  return getUserById(id_user);
};

/**
 * Update user password
 * @param {string} id_user - User ID
 * @param {string} hashedPassword - New hashed password
 */
const updatePassword = async (id_user, hashedPassword) => {
  const query = 'UPDATE users SET password = ? WHERE id_user = ?';
  await db.query(query, [hashedPassword, id_user]);
};

/**
 * Get all active users (bidans)
 * @returns {Array} Array of active users
 */
const getAllActiveUsers = async () => {
  const query = `
    SELECT 
      id_user,
      nama_lengkap,
      username,
      email,
      is_verified,
      created_at,
      updated_at
    FROM users
    WHERE is_verified = 1
    ORDER BY nama_lengkap ASC
  `;
  const [rows] = await db.query(query);
  return rows;
};

module.exports = {
  getUserByUsernameOrEmail,
  getUserById,
  getUserByEmail,
  registerUser,
  loginUser,
  verifyOTP,
  updateProfile,
  updatePassword,
  getAllActiveUsers
};