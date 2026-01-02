/**
 * API Service - Base API configuration and utilities
 * Provides centralized API configuration and request handling
 */

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://bidanku.site/api';

/**
 * Get authentication token from localStorage
 * @returns {string|null} JWT token
 */
export const getToken = () => localStorage.getItem('token');

/**
 * Set authentication token in localStorage
 * @param {string} token - JWT token
 */
export const setToken = (token) => localStorage.setItem('token', token);

/**
 * Remove authentication token from localStorage
 */
export const removeToken = () => localStorage.removeItem('token');

/**
 * Get user data from localStorage
 * @returns {object|null} User data
 */
export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Set user data in localStorage
 * @param {object} user - User data
 */
export const setStoredUser = (user) => localStorage.setItem('user', JSON.stringify(user));

/**
 * Remove user data from localStorage
 */
export const removeStoredUser = () => localStorage.removeItem('user');

/**
 * Clear all authentication data
 */
export const clearAuth = () => {
  removeToken();
  removeStoredUser();
};

/**
 * Build headers for API requests
 * @param {boolean} withAuth - Include authorization header
 * @returns {object} Headers object
 */
const buildHeaders = (withAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (withAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

/**
 * Handle API response
 * @param {Response} response - Fetch response
 * @param {string} endpoint - API endpoint (for error handling logic)
 * @returns {Promise<object>} Parsed response data
 */
const handleResponse = async (response, endpoint = '') => {
  const data = await response.json();

  if (!response.ok) {
    // Handle specific error codes
    if (response.status === 401) {
      // For password change endpoint, just throw error without redirect
      if (!endpoint.includes('/auth/me') && !endpoint.includes('/auth/login')) {
        clearAuth();
        window.location.href = '/';
      }
    }

    // Build error message including validation details if available
    let errorMessage = data.message || 'Terjadi kesalahan';
    if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      // For validation errors, include first field error
      const firstError = data.errors[0];
      if (firstError.message) {
        errorMessage = firstError.message;
      }
    }

    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    error.validationErrors = data.errors;
    throw error;
  }

  return data;
};

/**
 * Make API request
 * @param {string} endpoint - API endpoint
 * @param {object} options - Request options
 * @returns {Promise<object>} Response data
 */
export const apiRequest = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    body = null,
    withAuth = true,
    headers: customHeaders = {},
  } = options;

  const config = {
    method,
    headers: {
      ...buildHeaders(withAuth),
      ...customHeaders,
    },
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return await handleResponse(response, endpoint);
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error);
    throw error;
  }
};

/**
 * Download file from API
 * @param {string} endpoint - API endpoint
 * @param {string} filename - Filename for download
 * @returns {Promise<void>}
 */
export const downloadFile = async (endpoint, filename) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = new Error('Gagal mendownload file');
    error.status = response.status;
    throw error;
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export default {
  apiRequest,
  downloadFile,
  getToken,
  setToken,
  removeToken,
  getStoredUser,
  setStoredUser,
  removeStoredUser,
  clearAuth,
};
