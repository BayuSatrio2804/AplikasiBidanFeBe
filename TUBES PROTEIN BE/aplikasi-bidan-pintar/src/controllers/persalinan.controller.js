/**
 * Persalinan (Delivery/Birth) Controller
 * Handles HTTP requests for delivery service management
 */

const persalinanService = require('../services/persalinan.service');
const { created, serverError } = require('../utils/response');

/**
 * Create delivery registration
 * POST /api/persalinan/registrasi
 */
const createRegistrasiPersalinan = async (req, res) => {
  try {
    const userId = req.user.id;
    const newRecord = await persalinanService.createRegistrasiPersalinan(req.body, userId);
    return created(res, 'Registrasi Layanan Persalinan berhasil disimpan', newRecord);
  } catch (error) {
    return serverError(res, 'Gagal menyimpan registrasi Persalinan', error);
  }
};

module.exports = {
  createRegistrasiPersalinan
};