// Test script untuk verify login endpoint
// Run: node test-login.js

const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5000/api';

async function testLogin() {
    console.log('\n🔍 Testing Login Endpoint...\n');
    
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usernameOrEmail: 'bayu',
                password: 'bayu' // Sesuaikan dengan password yang benar
            })
        });
        
        const data = await response.json();
        
        console.log('📊 Response Status:', response.status);
        console.log('📦 Response Data:', JSON.stringify(data, null, 2));
        
        if (response.ok) {
            console.log('\n✅ LOGIN BERHASIL!');
            console.log('📧 OTP dikirim ke:', data.email);
            console.log('\n💡 Cek email untuk kode OTP 6 digit');
        } else {
            console.log('\n❌ LOGIN GAGAL!');
            console.log('⚠️  Pesan Error:', data.message);
            
            if (response.status === 401) {
                console.log('\n🔑 Password salah atau user tidak ditemukan');
                console.log('💡 Coba jalankan: node update-verified-users.js');
            }
        }
        
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.log('\n⚠️  Pastikan backend running di http://localhost:5000');
        console.log('💡 Jalankan: npm start');
    }
}

testLogin();
