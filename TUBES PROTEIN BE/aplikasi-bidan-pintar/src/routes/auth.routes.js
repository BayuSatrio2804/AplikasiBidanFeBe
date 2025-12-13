// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth');
const validator = require('../middleware/validator.middleware');
// === Import Skema OTP dan Lupa Password ===
const { 
    RegisterSchema, 
    LoginSchema, 
    UpdateProfileSchema, 
    OTPVerificationSchema,  
    ForgotPasswordRequestSchema,
    ForgotPasswordVerifySchema,
    ForgotPasswordResetSchema 
} = require('../validators/auth.validator'); 

// =========================================================
// ENDPOINT PUBLIK (Registrasi, Login, OTP, Lupa Password)
// =========================================================
router.post('/register', validator(RegisterSchema), authController.register);
// Login hanya untuk memicu pengiriman OTP/Email Verifikasi
router.post('/login', validator(LoginSchema), authController.login); 
// Verifikasi OTP yang dikirim saat Register/Login/Reset Password
router.post('/verify-otp', validator(OTPVerificationSchema), authController.verifyOTP); 

// Lupa Password - Langkah 1: Kirim Kode OTP
router.post('/forgot-password/request', 
    validator(ForgotPasswordRequestSchema), 
    authController.requestPasswordReset
); 

// Lupa Password - Langkah 2: Verifikasi Kode OTP (Mendapatkan Reset Token)
router.post('/forgot-password/verify-code', 
    validator(ForgotPasswordVerifySchema), 
    authController.verifyResetCode
); 

// Lupa Password - Langkah 3: Reset Password (Menggunakan Reset Token di Header/Body)
router.post('/forgot-password/reset', 
    validator(ForgotPasswordResetSchema), 
    authController.resetPassword
);

// =========================================================
// ENDPOINT TERLINDUNGI (Membutuhkan JWT)
// =========================================================
router.get('/me', verifyToken, authController.getProfile); 
router.put('/me', verifyToken, validator(UpdateProfileSchema), authController.updateProfile);


module.exports = router;