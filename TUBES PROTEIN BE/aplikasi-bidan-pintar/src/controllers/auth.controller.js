/**
 * Authentication Controller
 * Handles user authentication, registration, and profile management
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const authService = require('../services/auth.service');
const auditService = require('../services/audit.service');
const otpService = require('../services/otp.service');
const { JWT_SECRET, SALT_ROUNDS, TOKEN_EXPIRY } = require('../utils/constant');
const { success, created, badRequest, notFound, unauthorized, forbidden, serverError } = require('../utils/response');

/**
 * Register new user
 * POST /api/auth/register
 */
const register = async (req, res) => {
  const { nama_lengkap, username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const id_user = uuidv4();

    const newUser = await authService.registerUser(
      id_user,
      nama_lengkap,
      username,
      email,
      hashedPassword
    );

    return created(res, 'Registrasi berhasil! Silakan login menggunakan akun Anda.', {
      id_user: newUser.id_user,
      nama_lengkap: newUser.nama_lengkap,
      username: newUser.username,
      email: newUser.email
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      const message = error.sqlMessage?.includes('username')
        ? 'Username sudah digunakan'
        : 'Email sudah terdaftar';
      return badRequest(res, message);
    }
    return serverError(res, 'Gagal mendaftarkan pengguna', error);
  }
};

/**
 * Login user (sends OTP)
 * POST /api/auth/login
 */
const login = async (req, res) => {
  const { usernameOrEmail, password } = req.body;
  const ipAddress = req.ip;

  try {
    // Find user
    const user = await authService.getUserByUsernameOrEmail(usernameOrEmail);

    if (!user) {
      await auditService.recordLoginAttempt(null, usernameOrEmail, 'GAGAL', ipAddress);
      return notFound(res, 'Pengguna tidak ditemukan');
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      await auditService.recordLoginAttempt(user.id_user, user.username, 'GAGAL', ipAddress);
      return unauthorized(res, 'Password salah');
    }

    // Send OTP
    await otpService.saveAndSendOTP(user.id_user, user.email);

    return success(res, 'Password benar. Kode OTP telah dikirim ke email Anda.', {
      email: user.email
    });
  } catch (error) {
    return serverError(res, 'Login gagal', error);
  }
};

/**
 * Verify OTP and complete login
 * POST /api/auth/verify-otp
 */
const verifyOTP = async (req, res) => {
  const { usernameOrEmail, otp_code } = req.body;

  try {
    // Find user
    const user = await authService.getUserByUsernameOrEmail(usernameOrEmail);

    if (!user) {
      return badRequest(res, 'Pengguna tidak ditemukan');
    }

    // Verify OTP
    const verifiedUser = await authService.verifyOTP(user, otp_code);

    // Generate JWT token
    const token = jwt.sign(
      { id: verifiedUser.id_user, username: verifiedUser.username, email: verifiedUser.email },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    return success(res, 'Verifikasi berhasil. Anda berhasil login.', {
      token,
      user: {
        id_user: verifiedUser.id_user,
        nama_lengkap: verifiedUser.nama_lengkap,
        username: verifiedUser.username,
        email: verifiedUser.email
      }
    });
  } catch (error) {
    if (error.message.includes('OTP') || error.message.includes('Pengguna')) {
      return badRequest(res, error.message);
    }
    return serverError(res, 'Verifikasi gagal', error);
  }
};

/**
 * Resend OTP code
 * POST /api/auth/resend-otp
 */
const resendOTP = async (req, res) => {
  const { usernameOrEmail } = req.body;

  try {
    const user = await authService.getUserByUsernameOrEmail(usernameOrEmail);

    if (!user) {
      return notFound(res, 'Pengguna tidak ditemukan');
    }

    await otpService.saveAndSendOTP(user.id_user, user.email);

    return success(res, 'Kode OTP baru telah dikirim ke email Anda.', {
      email: user.email
    });
  } catch (error) {
    return serverError(res, 'Gagal mengirim ulang OTP', error);
  }
};

/**
 * Get user profile
 * GET /api/auth/profile
 */
const getProfile = async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.id);

    if (!user) {
      return notFound(res, 'Pengguna tidak ditemukan');
    }

    return success(res, 'Profil berhasil diambil', user);
  } catch (error) {
    return serverError(res, 'Gagal mengambil profil', error);
  }
};

/**
 * Update user profile
 * PUT /api/auth/profile
 */
const updateProfile = async (req, res) => {
  const { password } = req.body;

  try {
    console.log('📝 Update Profile Request:');
    console.log('   User ID:', req.user.id);
    console.log('   Request body:', { ...req.body, password: password ? '[HIDDEN]' : undefined });

    let hashedPassword = null;

    if (password) {
      hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      console.log('   🔐 Password will be updated');
    }

    const updatedData = await authService.updateProfile(req.user.id, req.body, hashedPassword);
    console.log('✅ Profile updated successfully:', { id_user: updatedData.id_user, nama_lengkap: updatedData.nama_lengkap });

    return success(res, 'Profil berhasil diperbarui', updatedData);
  } catch (error) {
    console.error('❌ Update profile error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      const message = error.sqlMessage?.includes('username')
        ? 'Username sudah digunakan'
        : 'Email sudah terdaftar';
      return badRequest(res, message);
    }
    return serverError(res, 'Gagal memperbarui profil', error);
  }
};

/**
 * Request password reset (sends OTP)
 * POST /api/auth/forgot-password
 */
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await authService.getUserByEmail(email);

    // Security: Don't reveal if email exists
    if (!user) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return success(res, 'Jika email terdaftar, kode reset password telah dikirimkan');
    }

    await otpService.saveAndSendOTP(user.id_user, email);

    return success(res, 'Kode verifikasi untuk reset password telah dikirimkan ke email Anda');
  } catch (error) {
    return serverError(res, 'Gagal memproses permintaan reset password', error);
  }
};

/**
 * Verify reset password code
 * POST /api/auth/verify-reset-code
 */
const verifyResetCode = async (req, res) => {
  const { email, otp_code } = req.body;

  try {
    const user = await authService.getUserByEmail(email);

    if (!user) {
      return notFound(res, 'Pengguna tidak ditemukan');
    }

    // Validate OTP (validateOTP already deletes the OTP on success)
    await otpService.validateOTP({ id_user: user.id_user }, otp_code);

    // Generate short-lived reset token
    const resetToken = jwt.sign(
      { id: user.id_user, is_reset: true },
      JWT_SECRET,
      { expiresIn: '5m' }
    );

    return success(res, 'Kode verifikasi berhasil', {
      reset_token: resetToken,
      id_user: user.id_user
    });
  } catch (error) {
    const isValidationError = error.message.includes('kedaluwarsa') || error.message.includes('tidak valid');
    if (isValidationError) {
      return badRequest(res, error.message);
    }
    return serverError(res, 'Verifikasi gagal', error);
  }
};

/**
 * Reset password with token
 * POST /api/auth/reset-password
 */
const resetPassword = async (req, res) => {
  const resetToken = req.headers['x-reset-token'] || req.body.reset_token;
  const { id_user, new_password } = req.body;

  if (!resetToken) {
    return unauthorized(res, 'Token reset tidak ditemukan');
  }

  try {
    // Verify reset token
    const decoded = jwt.verify(resetToken, JWT_SECRET);

    // Validate token payload
    if (!decoded.is_reset || decoded.id !== id_user) {
      return forbidden(res, 'Token reset tidak valid atau tidak cocok dengan ID pengguna');
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(new_password, SALT_ROUNDS);
    await authService.updatePassword(id_user, hashedPassword);

    return success(res, 'Password berhasil diatur ulang. Silakan login dengan password baru Anda.');
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return unauthorized(res, 'Token reset sudah kedaluwarsa');
    }
    if (error.name === 'JsonWebTokenError') {
      return forbidden(res, 'Token reset tidak valid');
    }
    return serverError(res, 'Gagal reset password', error);
  }
};

/**
 * Get all active users (bidans)
 * GET /api/auth/users
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await authService.getAllActiveUsers();
    
    return success(res, 'Daftar pengguna berhasil diambil', users);
  } catch (error) {
    return serverError(res, 'Gagal mengambil daftar pengguna', error);
  }
};

module.exports = {
  register,
  login,
  verifyOTP,
  resendOTP,
  getProfile,
  updateProfile,
  requestPasswordReset,
  verifyResetCode,
  resetPassword,
  getAllUsers
};