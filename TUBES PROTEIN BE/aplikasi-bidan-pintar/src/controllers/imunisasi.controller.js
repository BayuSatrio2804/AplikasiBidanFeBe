/**
 * Imunisasi (Immunization) Controller
 * Handles HTTP requests for immunization service management
 */

const imunisasiService = require('../services/imunisasi.service');
const { created, serverError } = require('../utils/response');

/**
 * Create immunization registration
 * POST /api/imunisasi/registrasi
 */
const createRegistrasiImunisasi = async (req, res) => {
  try {
    const userId = req.user.id;
    const newRecord = await imunisasiService.createRegistrasiImunisasi(req.body, userId);
    return created(res, 'Registrasi Layanan Imunisasi berhasil disimpan', newRecord);
  } catch (error) {
    return serverError(res, 'Gagal menyimpan registrasi Imunisasi', error);
  }
};

module.exports = {
  createRegistrasiImunisasi
};