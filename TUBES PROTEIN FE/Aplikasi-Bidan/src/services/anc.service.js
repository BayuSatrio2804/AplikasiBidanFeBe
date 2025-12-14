const API_BASE_URL = 'http://localhost:5000';

const ancService = {
  // Get all ANC records
  getAllANC: async (search = '') => {
    try {
      const token = localStorage.getItem('token');
      const params = search ? `?search=${encodeURIComponent(search)}` : '';
      
      const response = await fetch(`${API_BASE_URL}/anc${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal memuat data ANC');
      }

      const data = await response.json();
      return {
        success: true,
        data,
        message: 'Data ANC berhasil dimuat'
      };
    } catch (error) {
      console.error('Error fetching ANC:', error);
      return {
        success: false,
        message: error.message || 'Gagal memuat data ANC',
        data: null
      };
    }
  },

  // Get ANC by ID
  getANCById: async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/anc/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal memuat detail ANC');
      }

      const data = await response.json();
      return {
        success: true,
        data,
        message: 'Data ANC berhasil dimuat'
      };
    } catch (error) {
      console.error('Error fetching ANC detail:', error);
      return {
        success: false,
        message: error.message || 'Gagal memuat detail ANC',
        data: null
      };
    }
  },

  // Create new ANC record
  createANC: async (data) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/anc`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal menyimpan data ANC');
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
        message: 'Data ANC berhasil disimpan'
      };
    } catch (error) {
      console.error('Error creating ANC:', error);
      return {
        success: false,
        message: error.message || 'Gagal menyimpan data ANC',
        data: null
      };
    }
  },

  // Update ANC record
  updateANC: async (id, data) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/anc/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal mengupdate data ANC');
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
        message: 'Data ANC berhasil diupdate'
      };
    } catch (error) {
      console.error('Error updating ANC:', error);
      return {
        success: false,
        message: error.message || 'Gagal mengupdate data ANC',
        data: null
      };
    }
  },

  // Delete ANC record
  deleteANC: async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/anc/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal menghapus data ANC');
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
        message: 'Data ANC berhasil dihapus'
      };
    } catch (error) {
      console.error('Error deleting ANC:', error);
      return {
        success: false,
        message: error.message || 'Gagal menghapus data ANC',
        data: null
      };
    }
  }
};

export default ancService;
