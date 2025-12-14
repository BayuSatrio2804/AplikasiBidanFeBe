// src/services/otp.service.js
const db = require('../config/database'); // Asumsi koneksi database ada di sini
const mailer = require('../utils/mailer');
const { OTP_EXPIRY_MINUTES } = require('../utils/constant'); 
const crypto = require('crypto');

/**
 * Menghasilkan kode OTP 6 digit acak.
 */
const generateOTPCode = () => {
    const min = 100000;
    const max = 999999;
    return crypto.randomInt(min, max + 1).toString();
};

/**
 * Menyimpan/memperbarui kode OTP di DB dan mengirimkan email.
 */
const saveAndSendOTP = async (id_user, email) => {
    const otpCode = generateOTPCode();

    try {
        console.log('[OTP.SERVICE] Generating OTP for:', { id_user, email, otpCode });
        
        // Menggunakan MySQL CURRENT_TIMESTAMP untuk menghindari timezone issue
        // Tambah buffer 1 menit untuk network delay
        const query = `
            INSERT INTO otp_codes (id_user, otp_code, expires_at) 
            VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? MINUTE))
            ON DUPLICATE KEY UPDATE 
            otp_code = VALUES(otp_code), 
            expires_at = VALUES(expires_at),
            created_at = CURRENT_TIMESTAMP
        `;
        const result = await db.query(query, [id_user, otpCode, OTP_EXPIRY_MINUTES + 1]); 
        console.log('[OTP.SERVICE] OTP saved to database successfully:', otpCode);

        // Try to send email, but don't fail if it doesn't work
        try {
            await mailer.sendOTP(email, otpCode);
            console.log('[OTP.SERVICE] OTP email sent to:', email);
        } catch (emailError) {
            console.warn('[OTP.SERVICE] Email send failed but OTP was saved:', emailError.message);
            console.warn('[OTP.SERVICE] DEBUG: OTP code is:', otpCode);
            // Don't throw - email is optional, OTP is saved in DB
        }

        return { success: true, otpCode };
        
    } catch (dbError) {
        console.error('[OTP.SERVICE] Database error in saveAndSendOTP:', dbError.message);
        throw new Error('Gagal menyimpan kode OTP.');
    }
};

/**
 * Memvalidasi kode OTP yang diinput pengguna.
 */
const validateOTP = async (user, otp_code) => {
    // 1. Ambil data OTP dari DB dan cek expiry dalam satu query menggunakan MySQL NOW()
    const [rows] = await db.query(
        'SELECT otp_code, expires_at, (expires_at > NOW()) as is_valid FROM otp_codes WHERE id_user = ?', 
        [user.id_user]
    );
    const otpData = rows[0];

    if (!otpData) {
        throw new Error('Kode OTP tidak ditemukan. Silakan login ulang untuk mendapatkan kode baru.');
    }

    // 2. Cek KEDALUWARSA menggunakan MySQL comparison (lebih akurat)
    console.log('[OTP.SERVICE] OTP Validation Debug:', {
        expires_at: otpData.expires_at,
        is_valid: otpData.is_valid,
        otp_code_match: otpData.otp_code === otp_code
    });
    
    if (!otpData.is_valid) {
        await db.query('DELETE FROM otp_codes WHERE id_user = ?', [user.id_user]); 
        throw new Error('Kode OTP sudah kedaluwarsa. Silakan kirim ulang.');
    }

    // 3. Cek Kesamaan Kode
    if (otpData.otp_code !== otp_code) {
        throw new Error('Kode OTP salah.');
    }

    // 4. Verifikasi Berhasil: Hapus OTP dari DB
    await db.query('DELETE FROM otp_codes WHERE id_user = ?', [user.id_user]);
    
    return true; 
};

const deleteOTP = async (id_user) => {
    try {
        await db.query('DELETE FROM otp_codes WHERE id_user = ?', [id_user]);
    } catch (error) {
        console.error('Gagal menghapus OTP:', error);
        // Lanjutkan proses meskipun gagal hapus OTP
    }
};

module.exports = {
    saveAndSendOTP,
    validateOTP,
    deleteOTP
};