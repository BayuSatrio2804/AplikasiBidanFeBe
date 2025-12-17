// Test script untuk KB registration
// Run: node test-kb-registration.js

const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5000/api';

// Token admin (replace with actual token from login if expired)
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtYSI6IkFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzM0MzgyMzUyfQ.mlr7cSuBKPJFnNZnVrn3zLhWqLcw3dTkj5rKp5d-Cjw';

async function testKBRegistration() {
    console.log('\n🔍 Testing KB Registration Endpoint...\n');
    
    const testData = {
        jenis_layanan: 'KB',
        tanggal: '2025-12-17',
        nomor_registrasi_lama: '12345678',
        nomor_registrasi_baru: '15338YT5837',
        metode: 'IUD KB',
        nama_ibu: 'Siti Aminah',
        nik_ibu: '1432484634789012',  // 16 digits
        umur_ibu: 30,
        td_ibu: '110/80',
        bb_ibu: '40',
        nama_ayah: 'Arief Suryanto',
        nik_ayah: '2348009348234123',  // 16 digits
        umur_ayah: 46,
        td_ayah: '120/80',
        bb_ayah: '78',
        alamat: 'Jalan Malaiya no 15',
        nomor_hp: '085651124350',
        kunjungan_ulang: '02/81/2026',
        catatan: 'Follow-up IUD checking'
    };

    try {
        console.log('📤 Sending data:', JSON.stringify(testData, null, 2));
        console.log('\n⏳ Waiting for response...\n');

        const response = await fetch(`${API_BASE}/kb`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            },
            body: JSON.stringify(testData)
        });
        
        const data = await response.json();
        
        console.log('📊 Response Status:', response.status);
        console.log('📦 Response Data:', JSON.stringify(data, null, 2));
        
        if (response.ok) {
            console.log('\n✅ KB REGISTRATION BERHASIL!');
            console.log('📋 Registered ID:', data.data?.id_pemeriksaan);
        } else {
            console.log('\n❌ KB REGISTRATION GAGAL!');
            console.log('⚠️  Message:', data.message);
            
            if (data.errors) {
                console.log('\n🔴 Validation Errors:');
                data.errors.forEach(err => {
                    console.log(`   - ${err.field}: ${err.message}`);
                });
            }
        }
        
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.log('\n⚠️  Pastikan backend running di http://localhost:5000');
        console.log('💡 Jalankan: npm start');
    }
}

testKBRegistration();
