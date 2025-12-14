// Script untuk menambahkan kolom is_verified ke tabel users
const mysql = require('mysql2/promise');
require('dotenv').config();

async function addIsVerifiedColumn() {
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

        // Cek apakah kolom is_verified sudah ada
        const [columns] = await connection.execute(
            `SHOW COLUMNS FROM users LIKE 'is_verified'`
        );

        if (columns.length > 0) {
            console.log('⚠️  Kolom is_verified sudah ada di tabel users');
        } else {
            // Tambahkan kolom is_verified
            await connection.execute(
                `ALTER TABLE users ADD COLUMN is_verified TINYINT(1) DEFAULT 1 AFTER password`
            );
            console.log('✅ Kolom is_verified berhasil ditambahkan');
        }

        // Update semua user existing menjadi verified
        const [result] = await connection.execute(
            'UPDATE users SET is_verified = 1'
        );

        console.log(`✅ Updated ${result.affectedRows} users to verified status`);

        // Tampilkan struktur tabel users
        const [tableStructure] = await connection.execute('DESCRIBE users');
        console.log('\n📋 Struktur tabel users:');
        console.table(tableStructure);

        // Tampilkan daftar user
        const [users] = await connection.execute(
            'SELECT id_user, username, email, is_verified FROM users'
        );

        console.log('\n📋 Daftar semua user:');
        console.table(users);

        console.log('\n✅ Script selesai. Semua user sekarang sudah verified dan bisa login.');
        console.log('💡 Silakan refresh halaman login dan coba login lagi.\n');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

addIsVerifiedColumn();
