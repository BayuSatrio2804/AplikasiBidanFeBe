/**
 * Application Constants
 * Centralized configuration values
 */

module.exports = {
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'default_secret_key_change_in_production',
  TOKEN_EXPIRY: process.env.TOKEN_EXPIRY || '1d',
  
  // Password Hashing
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS, 10) || 10,
  
  // OTP Configuration
  OTP_EXPIRY_MINUTES: parseInt(process.env.OTP_EXPIRY, 10) || 10,
  
  // Email Configuration
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  
  // Valid Service Types (must match database ENUM)
  VALID_LAYANAN: [
    'ANC',
    'KB',
    'Imunisasi',
    'Persalinan',
    'Kunjungan Pasien'
  ],

  // Pagination Defaults
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,

  // Date Format
  DATE_FORMAT: 'YYYY-MM-DD',
  DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss'
};