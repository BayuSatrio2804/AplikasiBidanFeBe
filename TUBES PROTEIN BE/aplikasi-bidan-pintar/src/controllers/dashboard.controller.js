/**
 * Dashboard Controller
 * Handles HTTP requests for dashboard statistics
 */

const dashboardService = require('../services/dashboard.service');
const { success, serverError } = require('../utils/response');

/**
 * Get service summary statistics
 * GET /api/dashboard/rekap-layanan
 */
const getRekapLayanan = async (req, res) => {
  try {
    const { tahun } = req.query;
    const rekap = await dashboardService.getRekapLayanan(tahun);

    return success(res, 'Data rekap layanan berhasil diambil', {
      total: rekap.total,
      data: rekap.data
    });
  } catch (error) {
    return serverError(res, 'Gagal mengambil data dashboard', error);
  }
};

module.exports = {
  getRekapLayanan
};