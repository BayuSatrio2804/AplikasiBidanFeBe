/**
 * Audit Service (Frontend)
 * Handles audit log API calls
 */

import { apiRequest } from './api';

/**
 * Get access logs
 */
export const getAccessLogs = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.username) params.append('username', filters.username);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);

  const query = params.toString() ? `?${params.toString()}` : '';
  return apiRequest(`/audit/akses${query}`, 'GET');
};

/**
 * Get data modification logs
 */
export const getDataLogs = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.action) params.append('action', filters.action);
  if (filters.description) params.append('description', filters.description);
  if (filters.username) params.append('username', filters.username);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);

  const query = params.toString() ? `?${params.toString()}` : '';
  return apiRequest(`/audit/data${query}`, 'GET');
};

/**
 * Get data modification logs with detailed information
 */
export const getDetailedDataLogs = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.action) params.append('action', filters.action);
  if (filters.kategori) params.append('kategori', filters.kategori);
  if (filters.username) params.append('username', filters.username);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);

  const query = params.toString() ? `?${params.toString()}` : '';
  return apiRequest(`/audit/data-detailed${query}`, 'GET');
};

export default {
  getAccessLogs,
  getDataLogs,
  getDetailedDataLogs
};
