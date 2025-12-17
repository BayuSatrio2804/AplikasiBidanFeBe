const persalinanService = require('../services/persalinan.service');
const { success, serverError } = require('../utils/response');

/**
 * Create new delivery registration
 * POST /api/persalinan
 */
const createRegistrasiPersalinan = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await persalinanService.createRegistrasiPersalinan(req.body, userId);
    return success(res, 'Registrasi Persalinan berhasil disimpan', result, 201);
  } catch (error) {
    return serverError(res, 'Gagal menyimpan registrasi Persalinan', error);
  }
};

/**
 * Get delivery by ID
 * GET /api/persalinan/:id
 */
const getPersalinanById = async (req, res) => {
  try {
    const { id } = req.params;
    const persalinanRecord = await persalinanService.getPersalinanById(id);
    
    if (!persalinanRecord) {
      return res.status(404).json({
        success: false,
        message: 'Data Persalinan tidak ditemukan'
      });
    }
    
    return success(res, 'Data Persalinan berhasil diambil', persalinanRecord);
  } catch (error) {
    return serverError(res, 'Gagal mengambil data Persalinan', error);
  }
};

/**
 * Get all delivery records
 * GET /api/persalinan
 */
const getAllPersalinan = async (req, res) => {
  try {
    const { search } = req.query;
    const persalinanList = await persalinanService.getAllPersalinan(search);
    return success(res, 'Data Persalinan berhasil diambil', persalinanList);
  } catch (error) {
    return serverError(res, 'Gagal mengambil data Persalinan', error);
  }
};

/**
 * Update delivery registration
 * PUT /api/persalinan/:id
 */
const updateRegistrasiPersalinan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const updatedRecord = await persalinanService.updateRegistrasiPersalinan(id, req.body, userId);
    return success(res, 'Data Persalinan berhasil diperbarui', updatedRecord);
  } catch (error) {
    return serverError(res, 'Gagal memperbarui data Persalinan', error);
  }
};

/**
 * Delete delivery registration
 * DELETE /api/persalinan/:id
 */
const deleteRegistrasiPersalinan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    await persalinanService.deleteRegistrasiPersalinan(id, userId);
    return success(res, 'Data Persalinan berhasil dihapus');
  } catch (error) {
    return serverError(res, 'Gagal menghapus data Persalinan', error);
  }
};

module.exports = {
  createRegistrasiPersalinan,
  getPersalinanById,
  getAllPersalinan,
  updateRegistrasiPersalinan,
  deleteRegistrasiPersalinan
};
