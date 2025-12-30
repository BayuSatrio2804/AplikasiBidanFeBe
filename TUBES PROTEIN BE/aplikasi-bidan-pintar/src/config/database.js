/**
 * Konfigurasi Database
 * Pengaturan koneksi pool MySQL dengan dukungan promise
 */

const mysql = require('mysql2');
require('dotenv').config();

// Konfigurasi database dari environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'aplikasi_bidan',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10,
  queueLimit: 0,
  timezone: '+00:00',
  // Mengaktifkan multiple statements untuk migrasi/setup
  multipleStatements: false,
  // Penanganan tanggal yang lebih baik
  dateStrings: true
};

// Membuat connection pool
const pool = mysql.createPool(dbConfig);

// Tes koneksi saat startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Koneksi database gagal:', err.code);
    console.error('   Pesan:', err.message);

    // Memberikan pesan error yang membantu
    if (err.code === 'ECONNREFUSED') {
      console.error('   → Pastikan server MySQL sudah berjalan');
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   → Periksa kredensial database Anda (username/password)');
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.error('   → Database tidak ditemukan');
    }
  } else {
    console.log('Terhubung ke Database MySQL:', dbConfig.database);
    connection.release();
  }
});

// Export promise-based pool untuk dukungan async/await
module.exports = pool.promise();