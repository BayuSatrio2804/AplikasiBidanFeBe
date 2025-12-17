/**
 * ANC (Antenatal Care) Controller
 * Handles HTTP requests for ANC service management
 */

const ancService = require('../services/anc.service');
const { created, serverError } = require('../utils/response');

const { notFound, badRequest, success } = require('../utils/response');

/**
 * Create ANC registration
 * POST /api/anc
 */
const createRegistrasiANC = async (req, res) => {
  try {
    const userId = req.user.id;
    const newRecord = await ancService.createRegistrasiANC(req.body, userId);
    return created(res, 'Registrasi Layanan ANC berhasil disimpan', newRecord);
  } catch (error) {
    return serverError(res, 'Gagal menyimpan registrasi ANC', error);
  }
};

/**
 * Get ANC record by ID
 * GET /api/anc/:id
 */
const getANCById = async (req, res) => {
  try {
    const { id } = req.params;
    const ancRecord = await ancService.getANCById(id);
    
    if (!ancRecord) {
      return notFound(res, 'Data ANC tidak ditemukan');
    }
    
    return success(res, 'Data ANC berhasil diambil', ancRecord);
  } catch (error) {
    return serverError(res, 'Gagal mengambil data ANC', error);
  }
};

/**
 * Update ANC registration
 * PUT /api/anc/:id
 */
const updateANCRegistrasi = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const updatedRecord = await ancService.updateANCRegistrasi(id, req.body, userId);
    return success(res, 'Data ANC berhasil diperbarui', updatedRecord);
  } catch (error) {
    return serverError(res, 'Gagal memperbarui data ANC', error);
  }
};

/**
 * Delete ANC registration
 * DELETE /api/anc/:id
 */
const deleteANCRegistrasi = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    await ancService.deleteANCRegistrasi(id, userId);
    return success(res, 'Data ANC berhasil dihapus');
  } catch (error) {
    return serverError(res, 'Gagal menghapus data ANC', error);
  }
};

module.exports = {
  createRegistrasiANC,
  getANCById,
  updateANCRegistrasi,
  deleteANCRegistrasi
};