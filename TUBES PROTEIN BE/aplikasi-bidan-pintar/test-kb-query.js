/**
 * Test KB getKBById query
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function testGetKBById() {
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

    // Get first KB ID
    const [kbList] = await connection.execute(`
      SELECT id_pemeriksaan FROM pemeriksaan WHERE jenis_layanan = 'KB' LIMIT 1
    `);

    if (kbList.length === 0) {
      console.log('❌ No KB records found');
      return;
    }

    const testId = kbList[0].id_pemeriksaan;
    console.log(`Testing with KB ID: ${testId}\n`);

    // Test the exact query from service
    const query = `
      SELECT 
        p.id_pemeriksaan, 
        p.tanggal_pemeriksaan, 
        p.jenis_layanan,
        pas.nama, 
        pas.nik, 
        pas.umur, 
        pas.alamat, 
        pas.no_hp,
        kb.id_kb, 
        kb.nomor_registrasi_lama as no_reg_lama, 
        kb.nomor_registrasi_baru as no_reg_baru, 
        kb.metode,
        kb.metode as metode_kb,
        kb.td_ibu, 
        kb.bb_ibu, 
        kb.nama_ayah as nama_suami, 
        kb.nik_ayah as nik_suami, 
        kb.umur_ayah as umur_suami, 
        kb.td_ayah, 
        kb.bb_ayah,
        kb.kunjungan_ulang, 
        kb.catatan
      FROM pemeriksaan p
      LEFT JOIN pasien pas ON p.id_pasien = pas.id_pasien
      LEFT JOIN layanan_kb kb ON p.id_pemeriksaan = kb.id_pemeriksaan
      WHERE p.id_pemeriksaan = ? AND p.jenis_layanan = 'KB'
    `;

    const [result] = await connection.execute(query, [testId]);
    
    console.log('Query result:');
    console.log(JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testGetKBById();
