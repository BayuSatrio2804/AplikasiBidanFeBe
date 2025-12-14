// src/utils/constant.js

// Pastikan Anda mengisi variabel lingkungan ini (.env)
// Contoh: EMAIL_USER="your.bidan.email@gmail.com"
//         EMAIL_PASS="your_app_password" 

// --- KONSTANTA UTAMA SISTEM ---
module.exports = {
    // Pengaturan JWT dan Hashing (Asumsi sudah ada di .env)
    JWT_SECRET: process.env.JWT_SECRET || 'ganti_dengan_secret_key_yang_kuat', 
    SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS || 10),
    TOKEN_EXPIRY: '1d', // Token JWT berlaku 1 hari

    // Pengaturan OTP (BARU, diambil dari .env)
    OTP_EXPIRY_MINUTES: parseInt(process.env.OTP_EXPIRY || 10), // Kode OTP berlaku sesuai .env atau default 10 menit (lebih aman)
    
    // Pengaturan Email (BARU, diambil dari .env)
    EMAIL_USER: process.env.EMAIL_USER, 
    EMAIL_PASS: process.env.EMAIL_PASS, 

    // --- DAFTAR JENIS LAYANAN YANG VALID (Wajib untuk validasi & DB) ---
    // Harus sinkron dengan ENUM di tabel 'pemeriksaan'
    VALID_LAYANAN: [
        'ANC', 
        'KB', 
        'Imunisasi', 
        'Persalinan', 
        'Kunjungan Pasien'
    ],
};