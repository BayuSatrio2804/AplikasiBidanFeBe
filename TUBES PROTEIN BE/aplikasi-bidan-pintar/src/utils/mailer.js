/**
 * Email Utility
 * Handles sending emails using nodemailer
 */

const nodemailer = require('nodemailer');
const { EMAIL_USER, EMAIL_PASS, OTP_EXPIRY_MINUTES } = require('./constant');

// Create transporter (using Gmail by default)
const createTransporter = () => {
  if (!EMAIL_USER || !EMAIL_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });
};

/**
 * Send OTP code via email
 * @param {string} toEmail - Recipient email
 * @param {string} otpCode - OTP code to send
 * @returns {boolean} Success status
 */
const sendOTP = async (toEmail, otpCode) => {
  const transporter = createTransporter();

  if (!transporter) {
    throw new Error('Email configuration incomplete');
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