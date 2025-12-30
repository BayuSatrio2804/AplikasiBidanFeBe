/**
 * Schedule Controller
 * Handles HTTP requests for schedule management
 */

const jadwalService = require('../services/jadwal.service');
const { success, created, notFound, serverError } = require('../utils/response');
const fs = require('fs');
const path = require('path');

/**
 * Get all schedules with optional filters
 * GET /api/jadwal
 */
const listJadwal = async (req, res) => {
  try {
    const { bulan, tahun, layanan } = req.query;
    const logMsg = `[${new Date().toISOString()}] Jadwal Filter: bulan=${bulan}, tahun=${tahun}, layanan=${layanan}\n`;
    try {
      fs.appendFileSync(path.join(__dirname, '../../debug_log.txt'), logMsg);
    } catch (e) { console.error('Log error', e); }

    const data = await jadwalService.listJadwal(bulan, tahun, layanan);
    console.log('[DEBUG-JADWAL-CONTROLLER] Result Count:', data.length);
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
    const id_petugas = req.user.id; // Get from JWT token
    const payload = {
      ...req.body,
      id_petugas // Override with authenticated user
    };
    const newJadwal = await jadwalService.createJadwal(payload);
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
    const id_petugas = req.user.id; // Get from JWT token

    const existingJadwal = await jadwalService.getDetailJadwal(id);
    if (!existingJadwal) {
      return notFound(res, 'Jadwal tidak ditemukan');
    }

    // Merge id_petugas from JWT into payload
    const payload = {
      ...req.body,
      id_petugas
    };

    const updatedJadwal = await jadwalService.updateJadwal(id, payload);
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
    if (error.message.includes('tergenerate secara otomatis')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
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