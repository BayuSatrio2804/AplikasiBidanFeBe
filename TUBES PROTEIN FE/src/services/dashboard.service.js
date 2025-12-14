/**
 * Dashboard Service - Dashboard API calls
 */

import { apiRequest } from './api';

/**
 * Get service summary/rekap layanan
 * @param {number} tahun - Optional year filter
 * @returns {Promise<object>} Response data with service summary
 */
export const getRekapLayanan = async (tahun = null) => {
  const query = tahun ? `?tahun=${tahun}` : '';
  return apiRequest(`/dashboard/rekap-layanan${query}`);
};

export default {
  getRekapLayanan,
};
