/**
 * Laporan Service - Report API calls
 */

import { downloadFile, apiRequest } from './api';
import * as XLSX from 'xlsx';

/**
 * Get list of laporan summaries
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} Laporan list
 */
export const getLaporanList = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.jenis_layanan) {
    params.append('jenis_layanan', filters.jenis_layanan);
  }
  
  if (filters.periode) {
    params.append('periode', filters.periode);
  }
  
  if (filters.search) {
    params.append('search', filters.search);
  }
  
  if (filters.limit) {
    params.append('limit', filters.limit);
  }
  
  const queryString = params.toString();
  const endpoint = queryString ? `/laporan/list?${queryString}` : '/laporan/list';
  
  const response = await apiRequest(endpoint);
  return response.data || [];
};

/**
 * Get laporan by ID
 * @param {string} id - Laporan ID
 * @returns {Promise<Object>} Laporan data
 */
export const getLaporanById = async (id) => {
  const response = await apiRequest(`/laporan/${id}`);
  return response.data;
};

/**
 * Create new laporan
 * @param {Object} data - Laporan data
 * @returns {Promise<Object>} Created laporan
 */
export const createLaporan = async (data) => {
  const response = await apiRequest('/laporan', {
    method: 'POST',
    body: data
  });
  return response.data;
};

/**
 * Update laporan
 * @param {string} id - Laporan ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated laporan
 */
export const updateLaporan = async (id, data) => {
  const response = await apiRequest(`/laporan/${id}`, {
    method: 'PUT',
    body: data
  });
  return response.data;
};

/**
 * Delete laporan
 * @param {string} id - Laporan ID
 * @returns {Promise<void>}
 */
export const deleteLaporan = async (id) => {
  const response = await apiRequest(`/laporan/${id}`, {
    method: 'DELETE'
  });
  return response.data;
};

/**
 * Download monthly report in Excel format from API
 * @param {number} bulan - Month (1-12)
 * @param {number} tahun - Year
 * @returns {Promise<void>}
 */
export const downloadLaporanBulanan = async (bulan, tahun) => {
  const params = new URLSearchParams({
    format: 'excel',
    bulan: bulan.toString(),
    tahun: tahun.toString(),
  });
  
  const filename = `Laporan_Detil_${String(bulan).padStart(2, '0')}_${tahun}.xlsx`;
  return downloadFile(`/laporan?${params.toString()}`, filename);
};

/**
 * Export data list to Excel file (client-side generation)
 * @param {Array} data - Array of data objects to export
 * @param {string} filename - Name for the exported file
 * @returns {void}
 */
export const exportToExcel = (data, filename = 'laporan.xlsx') => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  
  // Convert data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan');
  
  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, filename);
};

/**
 * Export table data to Excel (from HTML table element)
 * @param {string} tableId - ID of the HTML table element
 * @param {string} filename - Name for the exported file
 * @returns {void}
 */
export const exportTableToExcel = (tableId, filename = 'laporan.xlsx') => {
  const table = document.getElementById(tableId);
  if (!table) {
    throw new Error('Table not found');
  }
  
  // Convert table to workbook
  const workbook = XLSX.utils.table_to_book(table);
  
  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, filename);
};

export default {
  getLaporanList,
  getLaporanById,
  createLaporan,
  updateLaporan,
  deleteLaporan,
  downloadLaporanBulanan,
  exportToExcel,
  exportTableToExcel,
};

