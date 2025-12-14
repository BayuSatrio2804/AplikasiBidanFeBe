// src/services/pasienService.js
import API_CONFIG from '../config/apiConfig';

const API_BASE_URL = API_CONFIG.BASE_URL;

const pasienService = {
  // Get all pasien dengan search
  getAllPasien: async (search = '') => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login kembali.');
      }

      let url = `${API_BASE_URL}/pasien`;
      if (search) {
        url += `?search=${encodeURIComponent(search)}`;
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
        throw new Error(data.message || 'Gagal mengambil data pasien');
      }

      return {
        success: true,
        message: data.message,
        data: data.data
      };

    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: []
      };
    }
  },

  // Get pasien by ID
  getPasienById: async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login kembali.');
      }

      const response = await fetch(`${API_BASE_URL}/pasien/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengambil data pasien');
      }

      return {
        success: true,
        message: data.message,
        data: data.data
      };

    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null
      };
    }
  },

  // Create new pasien
  createPasien: async (pasienData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login kembali.');
      }

      const response = await fetch(`${API_BASE_URL}/pasien`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pasienData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal menambahkan pasien');
      }

      return {
        success: true,
        message: data.message,
        data: data.data
      };

    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  },

  // Update pasien
  updatePasien: async (id, pasienData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login kembali.');
      }

      const response = await fetch(`${API_BASE_URL}/pasien/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pasienData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal memperbarui data pasien');
      }

      return {
        success: true,
        message: data.message,
        data: data.data
      };

    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  },

  // Delete pasien
  deletePasien: async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login kembali.');
      }

      const response = await fetch(`${API_BASE_URL}/pasien/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal menghapus pasien');
      }

      return {
        success: true,
        message: data.message
      };

    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  },

  // Get riwayat pemeriksaan pasien
  getRiwayatPasien: async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login kembali.');
      }

      const response = await fetch(`${API_BASE_URL}/pasien/${id}/riwayat`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengambil riwayat pasien');
      }

      return {
        success: true,
        message: data.message,
        data: data.data
      };

    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: []
      };
    }
  }
};

export default pasienService;
