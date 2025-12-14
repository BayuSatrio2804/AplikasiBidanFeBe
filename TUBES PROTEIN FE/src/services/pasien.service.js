/**
 * Pasien Service - Patient management API calls
 */

import { apiRequest } from './api';

/**
 * Get all patients with optional search
 * @param {string} search - Search by name or NIK
 * @returns {Promise<object>} Response data with patients list
 */
export const getAllPasien = async (search = '') => {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return apiRequest(`/pasien${query}`);
};

/**
 * Get patient by ID
 * @param {string} id - Patient ID (UUID)
 * @returns {Promise<object>} Response data with patient details
 */
export const getPasienById = async (id) => {
  return apiRequest(`/pasien/${id}`);
};

/**
 * Create new patient
 * @param {object} data - { nama, NIK, umur, alamat, no_hp }
 * @returns {Promise<object>} Response data with created patient
 */
export const createPasien = async (data) => {
  return apiRequest('/pasien', {
    method: 'POST',
    body: data,
  });
};

/**
 * Update patient
 * @param {string} id - Patient ID (UUID)
 * @param {object} data - { nama, NIK, umur, alamat, no_hp }
 * @returns {Promise<object>} Response data with updated patient
 */
export const updatePasien = async (id, data) => {
  return apiRequest(`/pasien/${id}`, {
    method: 'PUT',
    body: data,
  });
};

/**
 * Delete patient
 * @param {string} id - Patient ID (UUID)
 * @returns {Promise<object>} Response data
 */
export const deletePasien = async (id) => {
  return apiRequest(`/pasien/${id}`, {
    method: 'DELETE',
  });
};

/**
 * Get patient medical history
 * @param {string} id - Patient ID (UUID)
 * @returns {Promise<object>} Response data with medical history
 */
export const getRiwayatPasien = async (id) => {
  return apiRequest(`/pasien/${id}/riwayat`);
};

export default {
  getAllPasien,
  getPasienById,
  createPasien,
  updatePasien,
  deletePasien,
  getRiwayatPasien,
};
