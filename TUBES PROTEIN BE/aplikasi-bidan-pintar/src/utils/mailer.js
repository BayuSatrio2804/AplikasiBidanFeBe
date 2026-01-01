/**
 * Utilitas Email
 * Menangani pengiriman email menggunakan nodemailer
 */

const nodemailer = require('nodemailer');
const {
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_CLIENT_ID,
  EMAIL_CLIENT_SECRET,
  EMAIL_REFRESH_TOKEN,
  OTP_EXPIRY_MINUTES
} = require('./constant');

// Membuat transporter (menggunakan Gmail)
const createTransporter = () => {
  if (!EMAIL_USER) {
    return null;
  }

  // Opsi 1: Menggunakan OAuth2 (Lebih Aman/Direkomendasikan)
  if (EMAIL_CLIENT_ID && EMAIL_CLIENT_SECRET && EMAIL_REFRESH_TOKEN) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: EMAIL_USER,
        clientId: EMAIL_CLIENT_ID,
        clientSecret: EMAIL_CLIENT_SECRET,
        refreshToken: EMAIL_REFRESH_TOKEN
      }
    });
  }

  // Opsi 2: Menggunakan App Password (Legacy)
  if (EMAIL_PASS) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    });
  }

  return null;
};

/**
 * Kirim kode OTP via email
 * @param {string} toEmail - Email penerima
 * @param {string} otpCode - Kode OTP yang akan dikirim
 * @returns {boolean} Status keberhasilan
 */
const sendOTP = async (toEmail, otpCode) => {
  const transporter = createTransporter();

  if (!transporter) {
    throw new Error('Konfigurasi email belum lengkap');
  }

  const mailOptions = {
    from: `Sistem Bidan Pintar <${EMAIL_USER}>`,
    to: toEmail,
    subject: 'Kode Verifikasi OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #2563eb; margin-bottom: 20px;">Verifikasi Akun Anda</h2>
        <p>Halo,</p>
        <p>Gunakan kode berikut untuk verifikasi:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #1f2937;">${otpCode}</span>
        </div>
        <p style="color: #6b7280; font-size: 14px;">Kode berlaku selama ${OTP_EXPIRY_MINUTES} menit.</p>
        <p style="color: #6b7280; font-size: 14px;">Jika Anda tidak meminta kode ini, abaikan email ini.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #9ca3af; font-size: 12px;">Tim Bidan Pintar</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
  return true;
};

module.exports = {
  sendOTP
};
