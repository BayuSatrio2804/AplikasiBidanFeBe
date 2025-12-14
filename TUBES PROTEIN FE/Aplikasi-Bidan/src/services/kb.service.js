const API_BASE_URL = 'http://localhost:5000';

const kbService = {
  // Get all KB records
  getAllKB: async (search = '') => {
    try {
      const token = localStorage.getItem('token');
      const url = search ? `${API_BASE_URL}/kb?search=${encodeURIComponent(search)}` : `${API_BASE_URL}/kb`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal memuat data KB');
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
        message: 'Data KB berhasil dimuat'
      };
    } catch (error) {
      console.error('Error fetching KB:', error);
      return {
        success: false,
        message: error.message || 'Gagal memuat data KB',
        data: null
      };
    }
  },

  // Get KB by ID
  getKBById: async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/kb/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal memuat detail KB');
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
        message: 'Data KB berhasil dimuat'
      };
    } catch (error) {
      console.error('Error fetching KB detail:', error);
      return {
        success: false,
        message: error.message || 'Gagal memuat detail KB',
        data: null
      };
    }
  },

  // Create new KB record
  createKB: async (data) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/kb`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal menyimpan data KB');
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
        message: 'Data KB berhasil disimpan'
      };
    } catch (error) {
      console.error('Error creating KB:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Gagal menyimpan data KB',
        data: null
      };
    }
  },

  // Update KB record
  updateKB: async (id, data) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/kb/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal mengupdate data KB');
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
        message: 'Data KB berhasil diupdate'
      };
    } catch (error) {
      console.error('Error updating KB:', error);
      return {
        success: false,
        message: error.message || 'Gagal mengupdate data KB',
        data: null
      };
    }
  },

  // Delete KB record
  deleteKB: async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/kb/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal menghapus data KB');
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
        message: 'Data KB berhasil dihapus'
      };
    } catch (error) {
      console.error('Error deleting KB:', error);
      return {
        success: false,
        message: error.message || 'Gagal menghapus data KB',
        data: null
      };
    }
  }
};

export default kbService;
