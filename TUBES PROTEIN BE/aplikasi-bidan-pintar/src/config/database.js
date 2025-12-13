const mysql = require('mysql2');
require('dotenv').config();

// Buat pool koneksi
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Cek koneksi saat pertama kali dijalankan (Opsional, untuk debugging)
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed:', err.code);
        console.error(err.message);
    } else {
        console.log('✅ Connected to MySQL Database:', process.env.DB_NAME);
        connection.release();
    }
});

// Export menggunakan promise() agar bisa menggunakan async/await di controller
module.exports = pool.promise();