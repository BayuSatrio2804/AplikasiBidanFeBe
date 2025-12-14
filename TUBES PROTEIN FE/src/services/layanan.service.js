/**
 * Layanan Service - Service registration API calls (KB, ANC, Imunisasi, Persalinan, Kunjungan Pasien)
 */

import { apiRequest } from './api';

// =====================
// Pemeriksaan (Shared)
// =====================

/**
 * Get all pemeriksaan by jenis_layanan
 * @param {string} jenisLayanan - Filter by service type (KB, ANC, Imunisasi, Persalinan, Kunjungan Pasien)
 * @param {string} search - Optional search query
 * @returns {Promise<object>} Response data with pemeriksaan list
 */
export const getPemeriksaanByLayanan = async (jenisLayanan, search = '') => {
  const params = new URLSearchParams();
  if (jenisLayanan) params.append('jenis_layanan', jenisLayanan);
  if (search) params.append('search', search);
  
  const query = params.toString() ? `?${params.toString()}` : '';
  return apiRequest(`/pemeriksaan${query}`);
};

// =====================
// KB (Family Planning)
// =====================

/**
 * Get all KB records
 * @param {string} search - Optional search query
 * @returns {Promise<object>} Response data with KB list
 */
export const getAllKB = async (search = '') => {
  return getPemeriksaanByLayanan('KB', search);
};

/**
 * Create KB registration
 * @param {object} data - KB registration data
 * @returns {Promise<object>} Response data
 */
export const createKB = async (data) => {
  return apiRequest('/kb', {
    method: 'POST',
    body: {
      jenis_layanan: 'KB',
      ...data,
    },
  });
};

// =====================
// ANC (Antenatal Care)
// =====================

/**
 * Get all ANC records
 * @param {string} search - Optional search query
 * @returns {Promise<object>} Response data with ANC list
 */
export const getAllANC = async (search = '') => {
  return getPemeriksaanByLayanan('ANC', search);
};

/**
 * Create ANC registration
 * @param {object} data - ANC registration data
 * @returns {Promise<object>} Response data
 */
export const createANC = async (data) => {
  return apiRequest('/anc', {
    method: 'POST',
    body: {
      jenis_layanan: 'ANC',
      ...data,
    },
  });
};

// =====================
// Imunisasi (Immunization)
// =====================

/**
 * Get all Imunisasi records
 * @param {string} search - Optional search query
 * @returns {Promise<object>} Response data with Imunisasi list
 */
export const getAllImunisasi = async (search = '') => {
  return getPemeriksaanByLayanan('Imunisasi', search);
};

/**
 * Create Imunisasi registration
 * @param {object} data - Imunisasi registration data
 * @returns {Promise<object>} Response data
 */
export const createImunisasi = async (data) => {
  return apiRequest('/imunisasi', {
    method: 'POST',
    body: {
      jenis_layanan: 'Imunisasi',
      ...data,
    },
  });
};

// =====================
// Persalinan (Delivery)
// =====================

/**
 * Get all Persalinan records
 * @param {string} search - Optional search query
 * @returns {Promise<object>} Response data with Persalinan list
 */
export const getAllPersalinan = async (search = '') => {
  return getPemeriksaanByLayanan('Persalinan', search);
};

/**
 * Create Persalinan registration
 * @param {object} data - Persalinan registration data
 * @returns {Promise<object>} Response data
 */
export const createPersalinan = async (data) => {
  return apiRequest('/persalinan', {
    method: 'POST',
    body: {
      jenis_layanan: 'Persalinan',
      ...data,
    },
  });
};

// =====================
// Kunjungan Pasien (Patient Visit)
// =====================

/**
 * Get all Kunjungan Pasien records
 * @param {string} search - Optional search query
 * @returns {Promise<object>} Response data with Kunjungan Pasien list
 */
export const getAllKunjunganPasien = async (search = '') => {
  return getPemeriksaanByLayanan('Kunjungan Pasien', search);
};

/**
 * Create Kunjungan Pasien registration
 * @param {object} data - Kunjungan Pasien registration data
 * @returns {Promise<object>} Response data
 */
export const createKunjunganPasien = async (data) => {
  return apiRequest('/kunjungan-pasien', {
    method: 'POST',
    body: {
      jenis_layanan: 'Kunjungan Pasien',
      ...data,
    },
  });
};

// =====================
// Pemeriksaan (Medical Examination)
// =====================

/**
 * Get all examinations
 * @returns {Promise<object>} Response data with examinations list
 */
export const getAllPemeriksaan = async () => {
  return apiRequest('/pemeriksaan');
};

/**
 * Get examination by ID
 * @param {string} id - Examination ID (UUID)
 * @returns {Promise<object>} Response data with examination details
 */
export const getPemeriksaanById = async (id) => {
  return apiRequest(`/pemeriksaan/${id}`);
};

/**
 * Create examination (SOAP format)
 * @param {object} data - { id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana, tanggal_pemeriksaan? }
 * @returns {Promise<object>} Response data
 */
export const createPemeriksaan = async (data) => {
  return apiRequest('/pemeriksaan', {
    method: 'POST',
    body: data,
  });
};

/**
 * Update examination
 * @param {string} id - Examination ID (UUID)
 * @param {object} data - Examination data
 * @returns {Promise<object>} Response data
 */
export const updatePemeriksaan = async (id, data) => {
  return apiRequest(`/pemeriksaan/${id}`, {
    method: 'PUT',
    body: data,
  });
};

export default {
  // Shared
  getPemeriksaanByLayanan,
  // KB
  getAllKB,
  createKB,
  // ANC
  getAllANC,
  createANC,
  // Imunisasi
  getAllImunisasi,
  createImunisasi,
  // Persalinan
  getAllPersalinan,
  createPersalinan,
  // Kunjungan Pasien
  getAllKunjunganPasien,
  createKunjunganPasien,
  // Pemeriksaan
  getAllPemeriksaan,
  getPemeriksaanById,
  createPemeriksaan,
  updatePemeriksaan,
};
