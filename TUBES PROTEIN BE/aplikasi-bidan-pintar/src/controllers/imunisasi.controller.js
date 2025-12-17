const imunisasiService = require('../services/imunisasi.service');
const { success, serverError } = require('../utils/response');

/**
 * Create new immunization registration
 * POST /api/imunisasi
 */
const createRegistrasiImunisasi = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await imunisasiService.createRegistrasiImunisasi(req.body, userId);
    return success(res, 'Registrasi Imunisasi berhasil disimpan', result, 201);
  } catch (error) {
    return serverError(res, 'Gagal menyimpan registrasi Imunisasi', error);
  }
};

/**
 * Get immunization by ID
 * GET /api/imunisasi/:id
 */
const getImunisasiById = async (req, res) => {
  try {
    const { id } = req.params;
    const imunisasiRecord = await imunisasiService.getImunisasiById(id);
    
    if (!imunisasiRecord) {
      return res.status(404).json({
        success: false,
        message: 'Data Imunisasi tidak ditemukan'
      });
    }
    
    return success(res, 'Data Imunisasi berhasil diambil', imunisasiRecord);
  } catch (error) {
    return serverError(res, 'Gagal mengambil data Imunisasi', error);
  }
};

/**
 * Get all immunization records
 * GET /api/imunisasi
 */
const getAllImunisasi = async (req, res) => {
  try {
    const { search } = req.query;
    const imunisasiList = await imunisasiService.getAllImunisasi(search);
    return success(res, 'Data Imunisasi berhasil diambil', imunisasiList);
  } catch (error) {
    return serverError(res, 'Gagal mengambil data Imunisasi', error);
  }
};

/**
 * Update immunization registration
 * PUT /api/imunisasi/:id
 */
const updateRegistrasiImunisasi = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const updatedRecord = await imunisasiService.updateRegistrasiImunisasi(id, req.body, userId);
    return success(res, 'Data Imunisasi berhasil diperbarui', updatedRecord);
  } catch (error) {
    return serverError(res, 'Gagal memperbarui data Imunisasi', error);
  }
};

/**
 * Delete immunization registration
 * DELETE /api/imunisasi/:id
 */
const deleteRegistrasiImunisasi = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    await imunisasiService.deleteRegistrasiImunisasi(id, userId);
    return success(res, 'Data Imunisasi berhasil dihapus');
  } catch (error) {
    return serverError(res, 'Gagal menghapus data Imunisasi', error);
  }
};

module.exports = {
  createRegistrasiImunisasi,
  getImunisasiById,
  getAllImunisasi,
  updateRegistrasiImunisasi,
  deleteRegistrasiImunisasi
};
