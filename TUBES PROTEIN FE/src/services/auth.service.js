/**
 * Auth Service - Authentication API calls
 */

import { apiRequest, setToken, setStoredUser, clearAuth } from './api';

/**
 * Register new user
 * @param {object} userData - { nama_lengkap, username, email, password }
 * @returns {Promise<object>} Response data
 */
export const register = async (userData) => {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: userData,
    withAuth: false,
  });
};

/**
 * Login user (triggers OTP)
 * @param {object} credentials - { usernameOrEmail, password }
 * @returns {Promise<object>} Response data with email
 */
export const login = async (credentials) => {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: credentials,
    withAuth: false,
  });
};

/**
 * Verify OTP and get token
 * @param {object} data - { usernameOrEmail, otp_code }
 * @returns {Promise<object>} Response data with token and user
 */
export const verifyOTP = async (data) => {
  const response = await apiRequest('/auth/verify-otp', {
    method: 'POST',
    body: data,
    withAuth: false,
  });

  // Store token and user data
  if (response.success && response.data) {
    setToken(response.data.token);
    setStoredUser(response.data.user);
  }

  return response;
};

/**
 * Resend OTP code
 * @param {object} data - { usernameOrEmail }
 * @returns {Promise<object>} Response data
 */
export const resendOTP = async (data) => {
  return apiRequest('/auth/resend-otp', {
    method: 'POST',
    body: data,
    withAuth: false,
  });
};

/**
 * Request password reset
 * @param {object} data - { email }
 * @returns {Promise<object>} Response data
 */
export const forgotPasswordRequest = async (data) => {
  return apiRequest('/auth/forgot-password/request', {
    method: 'POST',
    body: data,
    withAuth: false,
  });
};

/**
 * Verify reset code
 * @param {object} data - { email, otp_code }
 * @returns {Promise<object>} Response data with reset_token
 */
export const verifyResetCode = async (data) => {
  return apiRequest('/auth/forgot-password/verify-code', {
    method: 'POST',
    body: data,
    withAuth: false,
  });
};

/**
 * Reset password
 * @param {object} data - { id_user, new_password }
 * @param {string} resetToken - Reset token from header
 * @returns {Promise<object>} Response data
 */
export const resetPassword = async (data, resetToken) => {
  return apiRequest('/auth/forgot-password/reset', {
    method: 'POST',
    body: data,
    withAuth: false,
    headers: {
      'X-Reset-Token': resetToken,
    },
  });
};

/**
 * Get current user profile
 * @returns {Promise<object>} Response data with user profile
 */
export const getProfile = async () => {
  return apiRequest('/auth/me');
};

/**
 * Update user profile
 * @param {object} data - { nama_lengkap?, username?, email?, password? }
 * @returns {Promise<object>} Response data with updated profile
 */
export const updateProfile = async (data) => {
  const response = await apiRequest('/auth/me', {
    method: 'PUT',
    body: data,
  });

  // Update stored user data
  if (response.success && response.data) {
    setStoredUser(response.data);
  }

  return response;
};

/**
 * Get all active users (bidans)
 * @returns {Promise<object>} Response data with users array
 */
export const getAllUsers = async () => {
  return apiRequest('/auth/users');
};

/**
 * Logout user
 */
export const logout = () => {
  clearAuth();
};

export default {
  register,
  login,
  verifyOTP,
  resendOTP,
  forgotPasswordRequest,
  verifyResetCode,
  resetPassword,
  getProfile,
  updateProfile,
  getAllUsers,
};
