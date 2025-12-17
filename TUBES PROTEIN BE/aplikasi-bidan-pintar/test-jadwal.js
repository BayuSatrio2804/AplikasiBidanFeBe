// Test script untuk verify jadwal endpoint
// Run: node test-jadwal.js

const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5000/api';

// Test data - replace with actual values from your database
const testPayload = {
    id_pasien: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', // Replace with actual UUID
    jenis_layanan: 'ANC',
    tanggal: '2025-12-20',
    jam_mulai: '10:00',
    jam_selesai: '11:00'
};

async function testJadwal() {
    console.log('\n🔍 Testing Jadwal Endpoint...\n');
    
    try {
        // First, get token from login
        console.log('1️⃣  Logging in first...');
        const loginRes = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usernameOrEmail: 'bayu',
                password: 'bayu'
            })
        });

        const loginData = await loginRes.json();
        
        if (!loginData.token) {
            console.log('❌ Login failed:', loginData.message);
            return;
        }

        const token = loginData.token;
        console.log('✅ Login successful, got token');

        // Now test jadwal creation
        console.log('\n2️⃣  Creating jadwal...');
        console.log('📤 Payload being sent:', JSON.stringify(testPayload, null, 2));

        const jadwalRes = await fetch(`${API_BASE}/jadwal`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(testPayload)
        });

        const jadwalData = await jadwalRes.json();

        console.log('\n📊 Response Status:', jadwalRes.status);
        console.log('📦 Response Data:', JSON.stringify(jadwalData, null, 2));

        if (jadwalRes.ok) {
            console.log('\n✅ JADWAL CREATED SUCCESSFULLY!');
        } else {
            console.log('\n❌ JADWAL CREATION FAILED!');
            console.log('⚠️  Pesan Error:', jadwalData.message);
            
            if (jadwalData.errors) {
                console.log('\n🔴 Validation Errors:');
                jadwalData.errors.forEach(err => {
                    console.log(`  - ${err.field}: ${err.message}`);
                });
            }
        }

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.log('\n⚠️  Pastikan backend running di http://localhost:5000');
        console.log('💡 Jalankan: npm start');
    }
}

testJadwal();
