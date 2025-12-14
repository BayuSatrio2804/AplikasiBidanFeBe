/**
 * Schedule Controller
 * Handles HTTP requests for schedule management
 */

const jadwalService = require('../services/jadwal.service');
const { success, created, notFound, serverError } = require('../utils/response');

/**
 * Get all schedules with optional filters
 * GET /api/jadwal
 */
const listJadwal = async (req, res) => {
  try {
    const { bulan, tahun, layanan } = req.query;
    const data = await jadwalService.listJadwal(bulan, tahun, layanan);
    return success(res, 'Berhasil mengambil data jadwal', data);
  } catch (error) {
    return serverError(res, 'Gagal mengambil data jadwal', error);
  }
};

/**
 * Create new schedule
 * POST /api/jadwal
 */
const createJadwal = async (req, res) => {
  try {
    const newJadwal = await jadwalService.createJadwal(req.body);
    return created(res, 'Jadwal berhasil dibuat', newJadwal);
  } catch (error) {
    return serverError(res, 'Gagal membuat jadwal', error);
  }
};

/**
 * Get schedule by ID
 * GET /api/jadwal/:id
 */
const getDetailJadwal = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await jadwalService.getDetailJadwal(id);

    if (!data) {
      return notFound(res, 'Jadwal tidak ditemukan');
    }

    return success(res, 'Detail jadwal ditemukan', data);
  } catch (error) {
    return serverError(res, 'Gagal mengambil detail jadwal', error);
  }
};

/**
 * Update schedule
 * PUT /api/jadwal/:id
 */
const updateJadwal = async (req, res) => {
  try {
    const { id } = req.params;

    const existingJadwal = await jadwalService.getDetailJadwal(id);
    if (!existingJadwal) {
      return notFound(res, 'Jadwal tidak ditemukan');
    }

    const updatedJadwal = await jadwalService.updateJadwal(id, req.body);
    return success(res, 'Jadwal berhasil diperbarui', updatedJadwal);
  } catch (error) {
    return serverError(res, 'Gagal memperbarui jadwal', error);
  }
};

/**
 * Delete schedule
 * DELETE /api/jadwal/:id
 */
const deleteJadwal = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await jadwalService.deleteJadwal(id);

    if (result.affectedRows === 0) {
      return notFound(res, 'Jadwal tidak ditemukan');
    }

    return success(res, 'Jadwal berhasil dihapus', { id_jadwal: id });
  } catch (error) {
    return serverError(res, 'Gagal menghapus jadwal', error);
  }
};

module.exports = {
  listJadwal,
  createJadwal,
  getDetailJadwal,
  updateJadwal,
  deleteJadwal
};