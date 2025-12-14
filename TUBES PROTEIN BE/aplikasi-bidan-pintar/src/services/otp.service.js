/**
 * OTP (One-Time Password) Service
 * Handles OTP generation, validation, and delivery
 */

const db = require('../config/database');
const mailer = require('../utils/mailer');
const { OTP_EXPIRY_MINUTES } = require('../utils/constant');
const crypto = require('crypto');

/**
 * Generate a random 6-digit OTP code
 * @returns {string} 6-digit OTP code
 */
const generateOTPCode = () => {
  return crypto.randomInt(100000, 999999 + 1).toString();
};

/**
 * Save OTP to database and send via email
 * @param {string} id_user - User ID
 * @param {string} email - User email
 * @returns {Object} Result with success status
 */
const saveAndSendOTP = async (id_user, email) => {
  const otpCode = generateOTPCode();

  // Save OTP with expiry time (using database time for consistency)
  const query = `
    INSERT INTO otp_codes (id_user, otp_code, expires_at)
    VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? MINUTE))
    ON DUPLICATE KEY UPDATE
      otp_code = VALUES(otp_code),
      expires_at = VALUES(expires_at),
      created_at = CURRENT_TIMESTAMP
  `;

  await db.query(query, [id_user, otpCode, OTP_EXPIRY_MINUTES + 1]);

  // Attempt to send email (non-blocking)
  try {
    await mailer.sendOTP(email, otpCode);
  } catch (emailError) {
    console.warn('[OTP] Email failed but OTP saved:', emailError.message);
    // In development, log the OTP for testing
    if (process.env.NODE_ENV === 'development') {
      console.log('[OTP] Code for testing:', otpCode);
    }
  }

  return { success: true };
};

/**
 * Validate OTP code for a user
 * @param {Object} user - User object with id_user
 * @param {string} otp_code - OTP code to validate
 * @returns {boolean} True if valid
 * @throws {Error} If OTP is invalid or expired
 */
const validateOTP = async (user, otp_code) => {
  // Get OTP data with validity check using database time
  const [rows] = await db.query(
    `SELECT otp_code, expires_at, (expires_at > NOW()) AS is_valid 
     FROM otp_codes WHERE id_user = ?`,
    [user.id_user]
  );

  const otpData = rows[0];

  if (!otpData) {
    throw new Error('Kode OTP tidak ditemukan. Silakan login ulang.');
  }

  // Check expiry
  if (!otpData.is_valid) {
    await deleteOTP(user.id_user);
    throw new Error('Kode OTP sudah kedaluwarsa. Silakan kirim ulang.');
  }

  // Check code match
  if (otpData.otp_code !== otp_code) {
    throw new Error('Kode OTP salah.');
  }

  // Delete OTP after successful validation
  await deleteOTP(user.id_user);

  return true;
};

/**
 * Delete OTP for a user
 * @param {string} id_user - User ID
 */
const deleteOTP = async (id_user) => {
  try {
    await db.query('DELETE FROM otp_codes WHERE id_user = ?', [id_user]);
  } catch (error) {
    console.error('[OTP] Failed to delete:', error.message);
  }
};

module.exports = {
  saveAndSendOTP,
  validateOTP,
  deleteOTP
};