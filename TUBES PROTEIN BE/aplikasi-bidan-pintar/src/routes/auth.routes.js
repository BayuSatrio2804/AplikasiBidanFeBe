/**
 * Authentication Routes
 * Public and protected authentication endpoints
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth');
const validate = require('../middleware/validator.middleware');
const {
  RegisterSchema,
  LoginSchema,
  UpdateProfileSchema,
  OTPVerificationSchema,
  ForgotPasswordRequestSchema,
  ForgotPasswordVerifySchema,
  ForgotPasswordResetSchema
} = require('../validators/auth.validator');

// ============================================
// Public Routes (No authentication required)
// ============================================

// Registration
router.post('/register', validate(RegisterSchema), authController.register);

// Login (triggers OTP)
router.post('/login', validate(LoginSchema), authController.login);

// OTP verification
router.post('/verify-otp', validate(OTPVerificationSchema), authController.verifyOTP);
router.post('/resend-otp', authController.resendOTP);

// Password reset flow
router.post('/forgot-password/request', validate(ForgotPasswordRequestSchema), authController.requestPasswordReset);
router.post('/forgot-password/verify-code', validate(ForgotPasswordVerifySchema), authController.verifyResetCode);
router.post('/forgot-password/reset', validate(ForgotPasswordResetSchema), authController.resetPassword);

// ============================================
// Protected Routes (Authentication required)
// ============================================

router.get('/me', verifyToken, authController.getProfile);
router.put('/me', verifyToken, validate(UpdateProfileSchema), authController.updateProfile);

module.exports = router;