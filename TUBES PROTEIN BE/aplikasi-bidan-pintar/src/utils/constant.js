/**
 * Konstanta Aplikasi
 * Nilai konfigurasi terpusat
 */

module.exports = {
  // Konfigurasi JWT
  JWT_SECRET: process.env.JWT_SECRET || 'default_secret_key_change_in_production',
  TOKEN_EXPIRY: process.env.TOKEN_EXPIRY || '1d',

  // Hashing Password
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS, 10) || 10,

  // Konfigurasi OTP
  OTP_EXPIRY_MINUTES: parseInt(process.env.OTP_EXPIRY, 10) || 3,

  // Konfigurasi Email
  EMAIL_USER: process.env.EMAIL_USER,
  // Password app (Legacy)
  EMAIL_PASS: process.env.EMAIL_PASS,
  // OAuth2 (Recommended)
  EMAIL_CLIENT_ID: process.env.EMAIL_CLIENT_ID,
  EMAIL_CLIENT_SECRET: process.env.EMAIL_CLIENT_SECRET,
  EMAIL_REFRESH_TOKEN: process.env.EMAIL_REFRESH_TOKEN,

  // Jenis Layanan Valid (harus sesuai dengan ENUM database)
  VALID_LAYANAN: [
    'ANC',
    'KB',
    'Imunisasi',
    'Persalinan',
    'Kunjungan Pasien'
  ],

  // Default Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,

  // Format Tanggal
  DATE_FORMAT: 'YYYY-MM-DD',
  DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss'
};