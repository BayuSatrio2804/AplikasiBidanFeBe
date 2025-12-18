/**
 * Kunjungan Pasien (Patient Visit) Controller
 * Handles HTTP requests for general patient visits
 */

const kunjunganPasienService = require('../services/kunjunganPasien.service');
const { success, created, serverError } = require('../utils/response');

/**
 * Get all patient visits with search
 * GET /api/kunjungan-pasien
 */
const getAllKunjunganPasien = async (req, res) => {
  try {
    const { search } = req.query;
    const data = await kunjunganPasienService.getAllKunjunganPasien(search);
    return success(res, 'Data kunjungan pasien berhasil diambil', data);
  } catch (error) {
    return serverError(res, 'Gagal mengambil data kunjungan pasien', error);
  }
};

/**
 * Get patient visit by ID
 * GET /api/kunjungan-pasien/:id
 */
const getKunjunganPasienById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await kunjunganPasienService.getKunjunganPasienById(id);
    return success(res, 'Data kunjungan pasien berhasil diambil', data);
  } catch (error) {
    return serverError(res, 'Gagal mengambil data kunjungan pasien', error);
  }
};

/**
 * Create patient visit registration
 * POST /api/kunjungan-pasien
 */
const createRegistrasiKunjunganPasien = async (req, res) => {
  try {
    const userId = req.user?.id;
    const newRecord = await kunjunganPasienService.createRegistrasiKunjunganPasien(req.body, userId);
    return created(res, 'Registrasi Kunjungan Pasien berhasil disimpan', newRecord);
  } catch (error) {
    return serverError(res, 'Gagal menyimpan registrasi Kunjungan Pasien', error);
  }
};

/**
 * Update patient visit
 * PUT /api/kunjungan-pasien/:id
 */
const updateKunjunganPasien = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const result = await kunjunganPasienService.updateKunjunganPasien(id, req.body, userId);
    return success(res, result.message, null);
  } catch (error) {
    return serverError(res, 'Gagal mengupdate data kunjungan pasien', error);
  }
};

/**
 * Delete patient visit
 * DELETE /api/kunjungan-pasien/:id
 */
const deleteKunjunganPasien = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const result = await kunjunganPasienService.deleteKunjunganPasien(id, userId);
    return success(res, result.message, null);
  } catch (error) {
    return serverError(res, 'Gagal menghapus data kunjungan pasien', error);
  }
};

module.exports = {
  getAllKunjunganPasien,
  getKunjunganPasienById,
  createRegistrasiKunjunganPasien,
  updateKunjunganPasien,
  deleteKunjunganPasien
};