/**
 * Query database to check KB data
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkKBData() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'aplikasi_bidan',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Connected to database\n');

    // Check pemeriksaan table
    console.log('📋 Checking pemeriksaan table:');
    const [pemeriksaan] = await connection.execute(`
      SELECT id_pemeriksaan, jenis_layanan, tanggal_pemeriksaan FROM pemeriksaan WHERE jenis_layanan = 'KB'
    `);
    console.log(`Found ${pemeriksaan.length} KB records in pemeriksaan`);
    if (pemeriksaan.length > 0) {
      console.table(pemeriksaan);
    }
    console.log();

    // Check layanan_kb table
    console.log('📋 Checking layanan_kb table:');
    const [layananKB] = await connection.execute(`
      SELECT id_kb, id_pemeriksaan, metode FROM layanan_kb
    `);
    console.log(`Found ${layananKB.length} records in layanan_kb`);
    if (layananKB.length > 0) {
      console.table(layananKB);
    }
    console.log();

    // Check pasien table
    console.log('📋 Checking pasien table:');
    const [pasien] = await connection.execute(`
      SELECT id_pasien, nama, nik FROM pasien
    `);
    console.log(`Found ${pasien.length} patients`);
    if (pasien.length > 0) {
      console.table(pasien);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkKBData();
