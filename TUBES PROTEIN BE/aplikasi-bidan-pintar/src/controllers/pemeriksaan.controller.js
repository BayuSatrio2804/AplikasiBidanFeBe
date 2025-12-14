/**
 * Examination Controller
 * Handles HTTP requests for medical examination records (SOAP)
 */

const pemeriksaanService = require('../services/pemeriksaan.service');
const { success, created, notFound, serverError } = require('../utils/response');

/**
 * Get all examination records
 * GET /api/pemeriksaan
 */
const getAllPemeriksaan = async (req, res) => {
  try {
    const data = await pemeriksaanService.getAllPemeriksaan();
    return success(res, 'Berhasil mengambil data pemeriksaan', data);
  } catch (error) {
    return serverError(res, 'Gagal mengambil data pemeriksaan', error);
  }
};

/**
 * Get examination by ID
 * GET /api/pemeriksaan/:id
 */
const getDetailPemeriksaan = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await pemeriksaanService.getDetailPemeriksaan(id);

    if (!data) {
      return notFound(res, 'Data pemeriksaan tidak ditemukan');
    }

    return success(res, 'Detail pemeriksaan berhasil diambil', data);
  } catch (error) {
    return serverError(res, 'Gagal mengambil detail pemeriksaan', error);
  }
};

/**
 * Create new examination record
 * POST /api/pemeriksaan
 */
const createPemeriksaan = async (req, res) => {
  try {
    const userId = req.user.id;
    const newPemeriksaan = await pemeriksaanService.createPemeriksaan(req.body, userId);
    return created(res, 'Catatan pemeriksaan berhasil disimpan', newPemeriksaan);
  } catch (error) {
    return serverError(res, 'Gagal menyimpan data pemeriksaan', error);
  }
};

/**
 * Update examination record
 * PUT /api/pemeriksaan/:id
 */
const updatePemeriksaan = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existingPemeriksaan = await pemeriksaanService.getDetailPemeriksaan(id);
    if (!existingPemeriksaan) {
      return notFound(res, 'Data pemeriksaan tidak ditemukan');
    }

    const updatedPemeriksaan = await pemeriksaanService.updatePemeriksaan(id, userId, req.body);
    return success(res, 'Catatan SOAP berhasil diperbarui', updatedPemeriksaan);
  } catch (error) {
    return serverError(res, 'Gagal memperbarui catatan SOAP', error);
  }
};

module.exports = {
  getAllPemeriksaan,
  getDetailPemeriksaan,
  createPemeriksaan,
  updatePemeriksaan
};