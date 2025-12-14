// src/services/auth.service.js
const db = require('../config/database');
const otpService = require('./otp.service'); 
const auditService = require('./audit.service');

// =========================================================
// FUNGSI UTAMA (Dengan Password untuk Login)
// =========================================================

// Fungsi Utilitas untuk Mendapatkan User (gabungan username/email)
const getUserByUsernameOrEmail = async (identifier) => {
    // Kita harus mengambil password untuk dibandingkan di Controller
    const query = `
        SELECT id_user, nama_lengkap, username, email, password 
        FROM users 
        WHERE username = ? OR email = ?
    `;
    
    const [rows] = await db.query(query, [identifier, identifier]);
    
    return rows.length > 0 ? rows[0] : null;
};

// =========================================================
// FUNGSI UTAMA (Tanpa Password untuk Reset/Profile)
// =========================================================

// Fungsi getUserById (sudah ada)
const getUserById = async (id_user) => {
    const [rows] = await db.query('SELECT id_user, nama_lengkap, username, email FROM users WHERE id_user = ?', [id_user]);
    return rows[0];
};

/**
 * [TAMBAHAN BARU] Mencari user berdasarkan Email (untuk Forgot Password)
 * Mengambil id_user dan data penting, tetapi TIDAK mengambil password.
 */
const getUserByEmail = async (email) => {
    const query = `
        SELECT id_user, nama_lengkap, username, email 
        FROM users 
        WHERE email = ?
    `;
    const [rows] = await db.query(query, [email]);
    return rows.length > 0 ? rows[0] : null;
};


// =========================================================
// FUNGSI OTENTIKASI DAN MODIFIKASI
// =========================================================

// Fungsi Register (Akun langsung aktif tanpa OTP)
const registerUser = async (id_user, nama_lengkap, username, email, hashedPassword) => {
    try {
        const query = `
            INSERT INTO users (id_user, nama_lengkap, username, email, password, is_verified) 
            VALUES (?, ?, ?, ?, ?, 1)
        `;
        const result = await db.query(query, [id_user, nama_lengkap, username, email, hashedPassword]);
        console.log('[AUTH.SERVICE] registerUser success - account is active:', { id_user, email });

        // Mengembalikan data user yang baru dibuat (tanpa password)
        return { id_user, nama_lengkap, username, email };
    } catch (error) {
        console.error('[AUTH.SERVICE] registerUser error:', error.message);
        throw error;
    }
};

// Fungsi Login Utama (Memicu pengiriman OTP)
const loginUser = async (user, ipAddress) => {
    // 1. Catat Log Berhasil
    await auditService.recordLoginAttempt(user.id_user, user.username, 'BERHASIL', ipAddress);
    
    // 2. Generate dan simpan OTP ke DB (Tabel otp_codes)
    await otpService.saveAndSendOTP(user.id_user, user.email);

    return { 
        message: `Login berhasil. Kode verifikasi (OTP) telah dikirimkan ke email ${user.email}.`
    };
};

const verifyOTP = async (user, otp_code) => {
    // Panggil logika validasi dari OTP Service
    try {
        await otpService.validateOTP(user, otp_code);
        
        // Jika validasi sukses, ambil data user yang bersih (tanpa password)
        const verifiedUser = await getUserById(user.id_user);
        return verifiedUser; // Dikembalikan ke controller untuk dibuatkan JWT

    } catch (error) {
        // Re-throw error dari OTP Service agar ditangkap di Controller
        throw error;
    }
};

const updateProfile = async (id_user, data, hashedPassword = null) => {
    // Menggunakan destructuring yang aman
    const { nama_lengkap, username, email } = data; 
    let updateQuery = 'UPDATE users SET nama_lengkap = ?, username = ?, email = ?';
    const params = [nama_lengkap, username, email];

    if (hashedPassword) {
         updateQuery += ', password = ?';
         params.push(hashedPassword);
    }

    updateQuery += ' WHERE id_user = ?';
    params.push(id_user);

    await db.query(updateQuery, params);

    return { id_user, nama_lengkap, username, email };
};

const updatePassword = async (id_user, hashedPassword) => {
    const query = 'UPDATE users SET password = ? WHERE id_user = ?';
    await db.query(query, [hashedPassword, id_user]);
};


// =========================================================
// EKSPOR SEMUA FUNGSI
// =========================================================
module.exports = {
    getUserByUsernameOrEmail,
    getUserById,
    // [PENTING]: FUNGSI INI DITAMBAHKAN
    getUserByEmail, 
    registerUser,
    loginUser,
    updateProfile,
    verifyOTP,
    updatePassword
};