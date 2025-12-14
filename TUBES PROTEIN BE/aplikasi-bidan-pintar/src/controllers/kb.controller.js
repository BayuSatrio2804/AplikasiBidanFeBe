/**
 * KB (Family Planning) Controller
 * Handles HTTP requests for KB service management
 */

const kbService = require('../services/kb.service');
const { created, serverError } = require('../utils/response');

/**
 * Create KB registration
 * POST /api/kb/registrasi
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

module.exports = {
  createRegistrasiKB
};