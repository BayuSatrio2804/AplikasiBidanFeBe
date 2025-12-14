// src/services/dashboardService.js
import API_CONFIG from '../config/apiConfig';

const API_BASE_URL = API_CONFIG.BASE_URL;

const dashboardService = {
  // Get Rekap Layanan - Dashboard statistics
  getRekapLayanan: async (tahun = null) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login kembali.');
      }

      let url = `${API_BASE_URL}/dashboard/rekap-layanan`;
      if (tahun) {
        url += `?tahun=${tahun}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengambil data rekap layanan');
      }

      return {
        success: true,
        message: data.message,
        total: data.total,
        data: data.data
      };

    } catch (error) {
      return {
        success: false,
        message: error.message,
        total: 0,
        data: []
      };
    }
  }
};

export default dashboardService;
