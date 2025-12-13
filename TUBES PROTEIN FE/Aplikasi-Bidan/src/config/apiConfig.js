// src/config/apiConfig.js

// KONFIGURASI API BACKEND
// Sesuaikan BASE_URL dengan URL backend Anda
const API_CONFIG = {
  // URL base backend
  // Development
  BASE_URL_DEV: 'http://localhost:5000/api',
  
  // Production
  BASE_URL_PROD: 'https://api.your-domain.com/api',
  
  // Get current base URL (sesuaikan dengan environment)
  get BASE_URL() {
    // Jika menggunakan environment variable
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
    // Default ke development
    return this.BASE_URL_DEV;
  }
};

export default API_CONFIG;
