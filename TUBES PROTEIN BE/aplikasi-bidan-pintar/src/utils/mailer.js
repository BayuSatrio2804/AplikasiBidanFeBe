// src/utils/mailer.js
const nodemailer = require('nodemailer');
const { EMAIL_USER, EMAIL_PASS, OTP_EXPIRY_MINUTES } = require('./constant');

// Konfigurasi Transporter (Menggunakan Gmail sebagai contoh)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER, 
        pass: EMAIL_PASS, // Gunakan App Password Gmail Anda
    },
});

/**
 * Mengirimkan kode OTP ke email tujuan.
 */
const sendOTP = async (toEmail, otpCode) => {
    if (!EMAIL_USER || !EMAIL_PASS) {
        // Log error jika konfigurasi belum lengkap
        console.error("ERROR: Konfigurasi EMAIL_USER atau EMAIL_PASS (App Password) belum diatur di .env.");
        throw new Error("Konfigurasi email server belum lengkap.");
    }
    
    const mailOptions = {
        from: `Sistem Bidan Pintar <${EMAIL_USER}>`,
        to: toEmail,
        subject: 'Kode Verifikasi One-Time Password (OTP)',
        html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                <h2 style="color: #007bff;">Verifikasi Akun Anda</h2>
                <p>Halo,</p>
                <p>Anda telah meminta kode verifikasi. Gunakan kode di bawah ini untuk melanjutkan:</p>
                <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
                    <span style="font-size: 24px; font-weight: bold; color: #343a40;">${otpCode}</span>
                </div>
                <p>Kode ini akan kedaluwarsa dalam **${OTP_EXPIRY_MINUTES} menit**.</p>
                <p>Jika Anda tidak meminta kode ini, abaikan email ini.</p>
                <p>Terima kasih,<br>Tim Bidan Pintar</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Gagal mengirim email OTP:', error);
        throw new Error('Gagal mengirimkan kode OTP melalui email.');
    }
};

module.exports = { sendOTP };