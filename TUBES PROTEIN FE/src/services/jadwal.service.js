/**
 * Jadwal Service - Schedule management API calls
 */

import { apiRequest } from './api';

/**
 * Get all schedules with optional filters
 * @param {object} filters - { bulan?, tahun?, layanan? }
 * @returns {Promise<object>} Response data with schedules list
 */
export const getAllJadwal = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.bulan) params.append('bulan', filters.bulan);
  if (filters.tahun) params.append('tahun', filters.tahun);
  if (filters.layanan) params.append('layanan', filters.layanan);
  
  const query = params.toString() ? `?${params.toString()}` : '';
  return apiRequest(`/jadwal${query}`);
};

/**
 * Get schedule by ID
 * @param {string} id - Schedule ID (UUID)
 * @returns {Promise<object>} Response data with schedule details
 */
export const getJadwalById = async (id) => {
  return apiRequest(`/jadwal/${id}`);
};

/**
 * Create new schedule
 * @param {object} data - { id_pasien, id_petugas, jenis_layanan, tanggal, jam_mulai, jam_selesai? }
 * @returns {Promise<object>} Response data with created schedule
 */
export const createJadwal = async (data) => {
  return apiRequest('/jadwal', {
    method: 'POST',
    body: data,
  });
};

/**
 * Update schedule
 * @param {string} id - Schedule ID (UUID)
 * @param {object} data - { id_pasien, id_petugas, jenis_layanan, tanggal, jam_mulai, jam_selesai? }
 * @returns {Promise<object>} Response data with updated schedule
 */
export const updateJadwal = async (id, data) => {
  return apiRequest(`/jadwal/${id}`, {
    method: 'PUT',
    body: data,
  });
};

/**
 * Delete schedule
 * @param {string} id - Schedule ID (UUID)
 * @returns {Promise<object>} Response data
 */
export const deleteJadwal = async (id) => {
  return apiRequest(`/jadwal/${id}`, {
    method: 'DELETE',
  });
};

export default {
  getAllJadwal,
  getJadwalById,
  createJadwal,
  updateJadwal,
  deleteJadwal,
};
