const API_BASE_URL = 'http://localhost:5000';

const persalinanService = {
  // Get all persalinan records
  getAllPersalinan: async (search = '') => {
    try {
      const token = localStorage.getItem('token');
      const params = search ? `?search=${encodeURIComponent(search)}` : '';
      
      const response = await fetch(`${API_BASE_URL}/persalinan${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal memuat data persalinan');
      }

      const data = await response.json();
      return {
        success: true,
        data,
        message: 'Data persalinan berhasil dimuat'
      };
    } catch (error) {
      console.error('Error fetching persalinan:', error);
      return {
        success: false,
        message: error.message || 'Gagal memuat data persalinan',
        data: null
      };
    }
  },

  // Get persalinan by ID
  getPersalinanById: async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/persalinan/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal memuat detail persalinan');
      }

      const data = await response.json();
      return {
        success: true,
        data,
        message: 'Data persalinan berhasil dimuat'
      };
    } catch (error) {
      console.error('Error fetching persalinan detail:', error);
      return {
        success: false,
        message: error.message || 'Gagal memuat detail persalinan',
        data: null
      };
    }
  },

  // Create new persalinan record
  createPersalinan: async (data) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/persalinan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal menyimpan data persalinan');
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
        message: 'Data persalinan berhasil disimpan'
      };
    } catch (error) {
      console.error('Error creating persalinan:', error);
      return {
        success: false,
        message: error.message || 'Gagal menyimpan data persalinan',
        data: null
      };
    }
  },

  // Update persalinan record
  updatePersalinan: async (id, data) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/persalinan/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal mengupdate data persalinan');
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
        message: 'Data persalinan berhasil diupdate'
      };
    } catch (error) {
      console.error('Error updating persalinan:', error);
      return {
        success: false,
        message: error.message || 'Gagal mengupdate data persalinan',
        data: null
      };
    }
  },

  // Delete persalinan record
  deletePersalinan: async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/persalinan/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal menghapus data persalinan');
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
        message: 'Data persalinan berhasil dihapus'
      };
    } catch (error) {
      console.error('Error deleting persalinan:', error);
      return {
        success: false,
        message: error.message || 'Gagal menghapus data persalinan',
        data: null
      };
    }
  }
};

export default persalinanService;
