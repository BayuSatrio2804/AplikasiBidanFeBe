/**
 * Patient Controller
 * Handles HTTP requests for patient management
 */

const pasienService = require('../services/pasien.service');
const { success, created, notFound, badRequest, serverError } = require('../utils/response');

/**
 * Get all patients
 * GET /api/pasien
 */
const getAllPasien = async (req, res) => {
  try {
    const { search } = req.query;
    const data = await pasienService.getAllPasien(search);
    return success(res, 'Berhasil mengambil data pasien', data);
  } catch (error) {
    return serverError(res, 'Gagal mengambil data pasien', error);
  }
};

/**
 * Get patient by ID
 * GET /api/pasien/:id
 */
const getPasienById = async (req, res) => {
  try {
    const { id } = req.params;
    const pasien = await pasienService.getPasienById(id);

    if (!pasien) {
      return notFound(res, 'Pasien tidak ditemukan');
    }

    return success(res, 'Berhasil mengambil data pasien', pasien);
  } catch (error) {
    return serverError(res, 'Gagal mengambil data pasien', error);
  }
};

/**
 * Create new patient
 * POST /api/pasien
 */
const createPasien = async (req, res) => {
  try {
    const userId = req.user.id;
    const newPasien = await pasienService.createPasien(req.body, userId);
    return created(res, 'Pasien berhasil ditambahkan', newPasien);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return badRequest(res, 'NIK sudah terdaftar');
    }
    return serverError(res, 'Gagal menyimpan data pasien', error);
  }
};

/**
 * Update patient
 * PUT /api/pasien/:id
 */
const updatePasien = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if patient exists
    const existingPasien = await pasienService.getPasienById(id);
    if (!existingPasien) {
      return notFound(res, 'Pasien tidak ditemukan');
    }

    const updatedPasien = await pasienService.updatePasien(id, userId, req.body);
    return success(res, 'Data pasien berhasil diperbarui', updatedPasien);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return badRequest(res, 'NIK sudah terdaftar di pasien lain');
    }
    return serverError(res, 'Gagal memperbarui data pasien', error);
  }
};

/**
 * Delete patient
 * DELETE /api/pasien/:id
 */
const deletePasien = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pasienService.deletePasien(id, userId);

    if (result.affectedRows === 0) {
      return notFound(res, 'Pasien tidak ditemukan');
    }

    return success(res, 'Pasien berhasil dihapus');
  } catch (error) {
    return serverError(res, 'Gagal menghapus pasien', error);
  }
};

/**
 * Get patient examination history
 * GET /api/pasien/:id/riwayat
 */
const getRiwayatPasien = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if patient exists
    const existingPasien = await pasienService.getPasienById(id);
    if (!existingPasien) {
      return notFound(res, 'Pasien tidak ditemukan');
    }

    const riwayat = await pasienService.getRiwayatPasien(id);
    return success(res, `Riwayat pemeriksaan untuk ${existingPasien.nama}`, riwayat);
  } catch (error) {
    return serverError(res, 'Gagal mengambil riwayat pasien', error);
  }
};

module.exports = {
  getAllPasien,
  getPasienById,
  createPasien,
  updatePasien,
  deletePasien,
  getRiwayatPasien
};