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

/**
 * Get KB record by ID
 * @param {string} id - KB ID (Pemeriksaan ID)
 * @returns {Promise<object>} Response data with KB details
 */
export const getKBById = async (id) => {
  return apiRequest(`/kb/${id}`);
};

/**
 * Update KB registration
 * @param {string} id - KB ID (Pemeriksaan ID)
 * @param {object} data - Updated KB data
 * @returns {Promise<object>} Response data
 */
export const updateKB = async (id, data) => {
  return apiRequest(`/kb/${id}`, {
    method: 'PUT',
    body: {
      jenis_layanan: 'KB',
      ...data,
    },
  });
};

/**
 * Delete KB registration
 * @param {string} id - KB ID (Pemeriksaan ID)
 * @returns {Promise<object>} Response data
 */
export const deleteKB = async (id) => {
  return apiRequest(`/kb/${id}`, {
    method: 'DELETE',
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

/**
 * Update ANC registration
 * @param {string} id - ANC ID (Pemeriksaan ID)
 * @param {object} data - Updated ANC data
 * @returns {Promise<object>} Response data
 */
export const updateANC = async (id, data) => {
  return apiRequest(`/anc/${id}`, {
    method: 'PUT',
    body: {
      jenis_layanan: 'ANC',
      ...data,
    },
  });
};

/**
 * Delete ANC registration
 * @param {string} id - ANC ID (Pemeriksaan ID)
 * @returns {Promise<object>} Response data
 */
export const deleteANC = async (id) => {
  return apiRequest(`/anc/${id}`, {
    method: 'DELETE',
  });
};

/**
 * Get ANC record by ID
 * @param {string} id - ANC ID (Pemeriksaan ID)
 * @returns {Promise<object>} Response data with ANC details
 */
export const getANCById = async (id) => {
  return apiRequest(`/anc/${id}`);
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
  // Map frontend field names to backend expected names
  const mappedData = {
    jenis_layanan: 'Imunisasi',
    tanggal: data.tanggal,
    no_reg: data.no_reg || data.nomor_registrasi,
    jenis_imunisasi: data.jenis_imunisasi,
    
    // Map ibu fields
    nama_istri: data.nama_istri || data.nama_ibu,
    nik_istri: data.nik_istri || data.nik_ibu,
    umur_istri: data.umur_istri || data.umur_ibu,
    alamat: data.alamat || data.alamat_ibu,
    
    // Map ayah fields
    nama_suami: data.nama_suami || data.nama_ayah,
    nik_suami: data.nik_suami || data.nik_ayah,
    umur_suami: data.umur_suami || data.umur_ayah,
    
    // Map bayi fields
    nama_bayi_balita: data.nama_bayi_balita || data.nama_bayi,
    tanggal_lahir_bayi: data.tanggal_lahir_bayi || data.tanggal_lahir,
    tb_bayi: data.tb_bayi || data.tb,
    bb_bayi: data.bb_bayi || data.bb,
    
    // Map other fields
    jadwal_selanjutnya: data.jadwal_selanjutnya,
    no_hp: data.no_hp || data.nomor_hp,
    pengobatan: data.pengobatan,
  };
  
  return apiRequest('/imunisasi', {
    method: 'POST',
    body: mappedData,
  });
};

/**
 * Get Imunisasi record by ID
 * @param {string} id - Imunisasi ID (Pemeriksaan ID)
 * @returns {Promise<object>} Response data with Imunisasi details
 */
export const getImunisasiById = async (id) => {
  return apiRequest(`/imunisasi/${id}`);
};

/**
 * Update Imunisasi registration
 * @param {string} id - Imunisasi ID (Pemeriksaan ID)
 * @param {object} data - Updated Imunisasi data
 * @returns {Promise<object>} Response data
 */
export const updateImunisasi = async (id, data) => {
  // Map frontend field names to backend expected names
  const mappedData = {
    jenis_layanan: data.jenis_layanan || 'Imunisasi',
    tanggal: data.tanggal,
    no_reg: data.no_reg || data.nomor_registrasi,
    jenis_imunisasi: data.jenis_imunisasi,
    
    // Map ibu fields
    nama_istri: data.nama_istri || data.nama_ibu,
    nik_istri: data.nik_istri || data.nik_ibu,
    umur_istri: data.umur_istri || data.umur_ibu,
    alamat: data.alamat || data.alamat_ibu,
    
    // Map ayah fields
    nama_suami: data.nama_suami || data.nama_ayah,
    nik_suami: data.nik_suami || data.nik_ayah,
    umur_suami: data.umur_suami || data.umur_ayah,
    
    // Map bayi fields
    nama_bayi_balita: data.nama_bayi_balita || data.nama_bayi,
    tanggal_lahir_bayi: data.tanggal_lahir_bayi || data.tanggal_lahir,
    tb_bayi: data.tb_bayi || data.tb,
    bb_bayi: data.bb_bayi || data.bb,
    
    // Map other fields
    jadwal_selanjutnya: data.jadwal_selanjutnya,
    no_hp: data.no_hp || data.nomor_hp,
    pengobatan: data.pengobatan,
  };
  
  console.log('UPDATE Imunisasi - Original data:', data);
  console.log('UPDATE Imunisasi - Mapped data:', mappedData);
  
  return apiRequest(`/imunisasi/${id}`, {
    method: 'PUT',
    body: mappedData,
  });
};


/**
 * Delete Imunisasi registration
 * @param {string} id - Imunisasi ID (Pemeriksaan ID)
 * @returns {Promise<object>} Response data
 */
export const deleteImunisasi = async (id) => {
  return apiRequest(`/imunisasi/${id}`, {
    method: 'DELETE',
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
  return apiRequest(`/persalinan${search ? `?search=${encodeURIComponent(search)}` : ''}`, {
    method: 'GET',
  });
};

/**
 * Get Persalinan by ID
 * @param {string} id - Persalinan ID
 * @returns {Promise<object>} Response data with Persalinan details
 */
export const getPersalinanById = async (id) => {
  return apiRequest(`/persalinan/${id}`, {
    method: 'GET',
  });
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

/**
 * Update Persalinan registration
 * @param {string} id - Persalinan ID
 * @param {object} data - Updated Persalinan data
 * @returns {Promise<object>} Response data
 */
export const updatePersalinan = async (id, data) => {
  return apiRequest(`/persalinan/${id}`, {
    method: 'PUT',
    body: {
      jenis_layanan: 'Persalinan',
      ...data,
    },
  });
};

/**
 * Delete Persalinan registration
 * @param {string} id - Persalinan ID
 * @returns {Promise<object>} Response data
 */
export const deletePersalinan = async (id) => {
  return apiRequest(`/persalinan/${id}`, {
    method: 'DELETE',
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
  getKBById,
  updateKB,
  deleteKB,
  // ANC
  getAllANC,
  createANC,
  updateANC,
  deleteANC,
  getANCById,
  // Imunisasi
  getAllImunisasi,
  createImunisasi,
  getImunisasiById,
  updateImunisasi,
  deleteImunisasi,
  // Persalinan
  getAllPersalinan,
  getPersalinanById,
  createPersalinan,
  updatePersalinan,
  deletePersalinan,
  // Kunjungan Pasien
  getAllKunjunganPasien,
  createKunjunganPasien,
  // Pemeriksaan
  getAllPemeriksaan,
  getPemeriksaanById,
  createPemeriksaan,
  updatePemeriksaan,
};
