const API_BASE_URL = 'http://localhost:5000';

const imunisasiService = {
  // Get all Imunisasi records
  getAllImunisasi: async (search = '') => {
    try {
      const token = localStorage.getItem('token');
      const url = search ? `${API_BASE_URL}/imunisasi?search=${encodeURIComponent(search)}` : `${API_BASE_URL}/imunisasi`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal memuat data Imunisasi');
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
        message: 'Data Imunisasi berhasil dimuat'
      };
    } catch (error) {
      console.error('Error fetching Imunisasi:', error);
      return {
        success: false,
        message: error.message || 'Gagal memuat data Imunisasi',
        data: null
      };
    }
  },

  // Get Imunisasi by ID
  getImunisasiById: async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/imunisasi/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal memuat detail Imunisasi');
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
        message: 'Data Imunisasi berhasil dimuat'
      };
    } catch (error) {
      console.error('Error fetching Imunisasi detail:', error);
      return {
        success: false,
        message: error.message || 'Gagal memuat detail Imunisasi',
        data: null
      };
    }
  },

  // Create new Imunisasi record
  createImunisasi: async (data) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/imunisasi`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal menyimpan data Imunisasi');
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
        message: 'Data Imunisasi berhasil disimpan'
      };
    } catch (error) {
      console.error('Error creating Imunisasi:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Gagal menyimpan data Imunisasi',
        data: null
      };
    }
  },

  // Update Imunisasi record
  updateImunisasi: async (id, data) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/imunisasi/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal mengupdate data Imunisasi');
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
        message: 'Data Imunisasi berhasil diupdate'
      };
    } catch (error) {
      console.error('Error updating Imunisasi:', error);
      return {
        success: false,
        message: error.message || 'Gagal mengupdate data Imunisasi',
        data: null
      };
    }
  },

  // Delete Imunisasi record
  deleteImunisasi: async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/imunisasi/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal menghapus data Imunisasi');
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
        message: 'Data Imunisasi berhasil dihapus'
      };
    } catch (error) {
      console.error('Error deleting Imunisasi:', error);
      return {
        success: false,
        message: error.message || 'Gagal menghapus data Imunisasi',
        data: null
      };
    }
  }
};

export default imunisasiService;
