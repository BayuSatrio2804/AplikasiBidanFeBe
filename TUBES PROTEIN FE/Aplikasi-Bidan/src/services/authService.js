// src/services/authService.js
import API_CONFIG from '../config/apiConfig';

const API_BASE_URL = API_CONFIG.BASE_URL;

const authService = {
  // 1. REGISTER - Daftar akun baru
  register: async (namaLengkap, username, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama_lengkap: namaLengkap,
          username,
          email,
          password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registrasi gagal');
      }
      return {
        success: true,
        message: data.message,
        user: data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },

  // 2. LOGIN - Login akan mengirim OTP setiap kali
  login: async (usernameOrEmail, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usernameOrEmail,
          password,
        }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login gagal');
      }
      
      // Login berhasil, OTP akan dikirim - return email untuk verifikasi
      return {
        success: true,
        email: data.email,
        message: data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },

  // 3. VERIFY OTP - Verifikasi OTP setelah login/register
  verifyOTP: async (usernameOrEmail, otpCode) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usernameOrEmail,
          otp_code: otpCode,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Verifikasi OTP gagal');
      }
      
      // Simpan token dan user data ke localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return {
        success: true,
        message: data.message,
        token: data.token,
        user: data.user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },

  // 4. FORGOT PASSWORD - Request untuk reset password (langkah 1)
  requestPasswordReset: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Permintaan reset password gagal');
      }
      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },

  // 5. VERIFY RESET CODE - Verifikasi kode OTP untuk reset password (langkah 2)
  verifyResetCode: async (email, otpCode) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp_code: otpCode,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Verifikasi kode gagal');
      }
      
      // Simpan reset token untuk langkah selanjutnya
      localStorage.setItem('resetToken', data.reset_token);
      
      return {
        success: true,
        message: data.message,
        resetToken: data.reset_token,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },

  // 6. RESET PASSWORD - Reset password dengan password baru (langkah 3)
  resetPassword: async (email, newPassword) => {
    try {
      const resetToken = localStorage.getItem('resetToken');
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resetToken}`,
        },
        body: JSON.stringify({
          email,
          new_password: newPassword,
          confirm_password: newPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Reset password gagal');
      }
      
      // Hapus reset token setelah berhasil
      localStorage.removeItem('resetToken');
      
      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },

  // Helper: Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('resetToken');
  },

  // Helper: Get stored token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Helper: Get stored user
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Helper: Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default authService;
