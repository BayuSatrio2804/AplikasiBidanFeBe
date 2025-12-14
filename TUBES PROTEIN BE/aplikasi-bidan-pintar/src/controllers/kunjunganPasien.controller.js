/**
 * Kunjungan Pasien (Patient Visit) Controller
 * Handles HTTP requests for general patient visits
 */

const kunjunganPasienService = require('../services/kunjunganPasien.service');
const { created, serverError } = require('../utils/response');

/**
 * Create patient visit registration
 * POST /api/kunjungan-pasien/registrasi
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

module.exports = {
  createRegistrasiKunjunganPasien
};