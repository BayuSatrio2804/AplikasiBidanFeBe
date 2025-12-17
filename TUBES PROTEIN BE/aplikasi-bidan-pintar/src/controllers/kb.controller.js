/**
 * KB (Family Planning) Controller
 * Handles HTTP requests for KB service management
 */

const kbService = require('../services/kb.service');
const { created, serverError, notFound, success } = require('../utils/response');

/**
 * Create KB registration
 * POST /api/kb
 */
const createRegistrasiKB = async (req, res) => {
  try {
    const userId = req.user.id;
    const newRecord = await kbService.createRegistrasiKB(req.body, userId);
    return created(res, 'Registrasi Layanan KB berhasil disimpan', newRecord);
  } catch (error) {
    return serverError(res, 'Gagal menyimpan registrasi KB', error);
  }
};

/**
 * Get KB record by ID
 * GET /api/kb/:id
 */
const getKBById = async (req, res) => {
  try {
    const { id } = req.params;
    const kbRecord = await kbService.getKBById(id);
    
    if (!kbRecord) {
      return notFound(res, 'Data KB tidak ditemukan');
    }
    
    return success(res, 'Data KB berhasil diambil', kbRecord);
  } catch (error) {
    return serverError(res, 'Gagal mengambil data KB', error);
  }
};

/**
 * Update KB registration
 * PUT /api/kb/:id
 */
const updateRegistrasiKB = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const updatedRecord = await kbService.updateRegistrasiKB(id, req.body, userId);
    return success(res, 'Data KB berhasil diperbarui', updatedRecord);
  } catch (error) {
    return serverError(res, 'Gagal memperbarui data KB', error);
  }
};

/**
 * Delete KB registration
 * DELETE /api/kb/:id
 */
const deleteRegistrasiKB = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    await kbService.deleteRegistrasiKB(id, userId);
    return success(res, 'Data KB berhasil dihapus');
  } catch (error) {
    return serverError(res, 'Gagal menghapus data KB', error);
  }
};

/**
 * Get all KB records (with optional search)
 * GET /api/kb
 */
const getAllKB = async (req, res) => {
  try {
    const { search = '' } = req.query;
    const kbRecords = await kbService.getAllKB(search);
    return success(res, 'Data KB berhasil diambil', kbRecords);
  } catch (error) {
    return serverError(res, 'Gagal mengambil data KB', error);
  }
};

module.exports = {
  createRegistrasiKB,
  getKBById,
  updateRegistrasiKB,
  deleteRegistrasiKB,
  getAllKB
};