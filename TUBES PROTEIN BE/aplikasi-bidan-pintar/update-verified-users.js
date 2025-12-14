// Script untuk update semua user menjadi verified
// Jalankan sekali saja untuk fix user yang sudah ada sebelum sistem verifikasi

const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateAllUsersToVerified() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306
        });

        console.log('✅ Connected to database');

        // Update semua user yang belum verified menjadi verified
        const [result] = await connection.execute(
            'UPDATE users SET is_verified = 1 WHERE is_verified = 0 OR is_verified IS NULL'
        );

        console.log(`\n✅ Updated ${result.affectedRows} users to verified status`);

        // Tampilkan daftar user yang sudah diupdate
        const [users] = await connection.execute(
            'SELECT id_user, username, email, is_verified FROM users'
        );

        console.log('\n📋 Daftar semua user:');
        console.table(users);

        console.log('\n✅ Script selesai. Semua user sekarang sudah verified dan bisa login.');
        console.log('💡 Silakan coba login lagi di aplikasi.\n');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

updateAllUsersToVerified();
