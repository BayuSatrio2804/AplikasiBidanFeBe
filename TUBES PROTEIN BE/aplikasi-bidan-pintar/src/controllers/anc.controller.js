/**
 * ANC (Antenatal Care) Controller
 * Handles HTTP requests for ANC service management
 */

const ancService = require('../services/anc.service');
const { created, serverError } = require('../utils/response');

/**
 * Create ANC registration
 * POST /api/anc/registrasi
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

module.exports = {
  createRegistrasiANC
};