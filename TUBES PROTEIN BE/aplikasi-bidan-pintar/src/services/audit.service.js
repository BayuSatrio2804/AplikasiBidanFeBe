/**
 * Service Audit
 * Menangani pencatatan aktivitas pengguna dan upaya akses
 */

const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

/**
 * Catat upaya login
 * @param {string|null} userId - ID User (null jika user tidak ditemukan)
 * @param {string} username - Username yang dicoba
 * @param {'BERHASIL'|'GAGAL'} status - Status login
 * @param {string} ipAddress - Alamat IP Klien
 */
const recordLoginAttempt = async (userId, username, status, ipAddress) => {
  try {
    const id_akses = uuidv4();
    const query = `
      INSERT INTO audit_log_akses (id_akses, id_user, username, status, ip_address, tanggal_akses)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    await db.query(query, [id_akses, userId, username, status, ipAddress]);
  } catch (error) {
    console.error('[AUDIT] Gagal mencatat upaya login:', error.message);
  }
};

/**
 * Ambil log akses (riwayat login)
 * @param {Object} filters - Opsi filter
 * @returns {Array} Daftar log akses
 */
const getAccessLogs = async (filters = {}) => {
  try {
    let query = 'SELECT * FROM audit_log_akses WHERE 1=1';
    const params = [];

    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }
    if (filters.username) {
      query += ' AND username LIKE ?';
      params.push(`%${filters.username}%`);
    }
    if (filters.startDate) {
      query += ' AND tanggal_akses >= ?';
      params.push(filters.startDate);
    }
    if (filters.endDate) {
      query += ' AND tanggal_akses <= ?';
      params.push(filters.endDate);
    }

    query += ' ORDER BY tanggal_akses DESC LIMIT 1000';

    const [results] = await db.query(query, params);
    return results;
  } catch (error) {
    console.error('[AUDIT] Gagal mengambil log akses:', error.message);
    throw error;
  }
};

/**
 * Catat log modifikasi data (Operasi CRUD)
 * @param {string} userId - ID User yang melakukan aksi
 * @param {'CREATE'|'UPDATE'|'DELETE'} action - Jenis aksi
 * @param {string} tableName - Nama tabel yang terpengaruh
 * @param {string} dataId - ID data yang terpengaruh
 */
const recordDataLog = async (userId, action, tableName, dataId) => {
  try {
    const id_audit = uuidv4();
    const query = `
      INSERT INTO audit_logs (id_audit, id_user, action, description, id_data_terkait, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    await db.query(query, [id_audit, userId, action, tableName, dataId]);
  } catch (error) {
    console.error('[AUDIT] Gagal mencatat log data:', error.message);
    throw error;
  }
};

/**
 * Ambil log modifikasi data dasar
 * @param {Object} filters - Opsi filter
 * @returns {Array} Daftar log audit dasar
 */
const getDataLogs = async (filters = {}) => {
  try {
    let query = 'SELECT * FROM audit_logs WHERE 1=1';
    const params = [];

    if (filters.action) {
      query += ' AND action = ?';
      params.push(filters.action);
    }
    if (filters.description) {
      query += ' AND description LIKE ?';
      params.push(`%${filters.description}%`);
    }
    if (filters.username) {
      query += ' AND id_user = (SELECT id_user FROM users WHERE username LIKE ?)';
      params.push(`%${filters.username}%`);
    }
    if (filters.startDate) {
      query += ' AND created_at >= ?';
      params.push(filters.startDate);
    }
    if (filters.endDate) {
      query += ' AND created_at <= ?';
      params.push(filters.endDate);
    }

    query += ' ORDER BY created_at DESC LIMIT 1000';

    const [results] = await db.query(query, params);
    return results;
  } catch (error) {
    console.error('[AUDIT] Gagal mengambil log data:', error.message);
    throw error;
  }
};

/**
 * Ambil log modifikasi data dengan informasi detail
 * @param {Object} filters - Opsi filter
 * @returns {Array} Daftar log audit dengan info user dan detail data
 */
const getDetailedDataLogs = async (filters = {}) => {
  try {
    let query = `
      SELECT 
        a.id_audit, 
        a.id_user, 
        a.action, 
        a.description AS kategori, 
        a.id_data_terkait,
        a.created_at AS tanggal,
        u.username AS diubah_oleh,
        COALESCE(p.nama, p_anc.nama, p_kb.nama, p_pers.nama, p_imun.nama, p_kjung.nama, p_jadwal.nama, p_direct.nama) AS nama_pasien,
        COALESCE(
          anc.no_reg_baru, anc.no_reg_lama, 
          kb.nomor_registrasi_baru, kb.nomor_registrasi_lama, 
          pers.no_reg_baru, pers.no_reg_lama, 
          imun.no_reg, 
          kjung.no_reg
        ) AS nomor_registrasi
      FROM audit_logs a
      LEFT JOIN users u ON a.id_user = u.id_user
      
      -- Join untuk kategori: 'pemeriksaan'
      LEFT JOIN pemeriksaan pem ON a.id_data_terkait = pem.id_pemeriksaan
      LEFT JOIN pasien p ON pem.id_pasien = p.id_pasien
      
      -- Join untuk kategori: 'layanan_anc' -> pemeriksaan -> pasien
      LEFT JOIN layanan_anc anc ON (a.id_data_terkait = anc.id_anc OR a.id_data_terkait = anc.id_pemeriksaan)
      LEFT JOIN pemeriksaan pem_anc ON anc.id_pemeriksaan = pem_anc.id_pemeriksaan
      LEFT JOIN pasien p_anc ON (pem_anc.id_pasien = p_anc.id_pasien OR a.id_data_terkait = p_anc.id_pasien)
      
      -- Join untuk kategori: 'layanan_kb' -> pemeriksaan -> pasien
      LEFT JOIN layanan_kb kb ON (a.id_data_terkait = kb.id_kb OR a.id_data_terkait = kb.id_pemeriksaan)
      LEFT JOIN pemeriksaan pem_kb ON kb.id_pemeriksaan = pem_kb.id_pemeriksaan
      LEFT JOIN pasien p_kb ON (pem_kb.id_pasien = p_kb.id_pasien OR a.id_data_terkait = p_kb.id_pasien)
      
      -- Join untuk kategori: 'layanan_persalinan' -> pemeriksaan -> pasien
      LEFT JOIN layanan_persalinan pers ON (a.id_data_terkait = pers.id_persalinan OR a.id_data_terkait = pers.id_pemeriksaan)
      LEFT JOIN pemeriksaan pem_pers ON pers.id_pemeriksaan = pem_pers.id_pemeriksaan
      LEFT JOIN pasien p_pers ON (pem_pers.id_pasien = p_pers.id_pasien OR a.id_data_terkait = p_pers.id_pasien)
      
      -- Join untuk kategori: 'layanan_imunisasi' -> pemeriksaan -> pasien
      LEFT JOIN layanan_imunisasi imun ON (a.id_data_terkait = imun.id_imunisasi OR a.id_data_terkait = imun.id_pemeriksaan)
      LEFT JOIN pemeriksaan pem_imun ON imun.id_pemeriksaan = pem_imun.id_pemeriksaan
      LEFT JOIN pasien p_imun ON (pem_imun.id_pasien = p_imun.id_pasien OR a.id_data_terkait = p_imun.id_pasien)
      
      -- Join untuk kategori: 'layanan_kunjungan_pasien' -> pemeriksaan -> pasien
      LEFT JOIN layanan_kunjungan_pasien kjung ON (a.id_data_terkait = kjung.id_kunjungan OR a.id_data_terkait = kjung.id_pemeriksaan)
      LEFT JOIN pemeriksaan pem_kjung ON kjung.id_pemeriksaan = pem_kjung.id_pemeriksaan
      LEFT JOIN pasien p_kjung ON (pem_kjung.id_pasien = p_kjung.id_pasien OR a.id_data_terkait = p_kjung.id_pasien)

      -- Join untuk kategori: 'jadwal' (langsung ke pasien)
      LEFT JOIN jadwal jad ON a.id_data_terkait = jad.id_jadwal
      LEFT JOIN pasien p_jadwal ON jad.id_pasien = p_jadwal.id_pasien

      -- Join untuk kategori: 'pasien' (direct changes to patient data)
      LEFT JOIN pasien p_direct ON a.id_data_terkait = p_direct.id_pasien

      WHERE 1=1
    `;
    const params = [];

    if (filters.action) {
      query += ' AND a.action = ?';
      params.push(filters.action);
    }
    if (filters.kategori) {
      query += ' AND a.description LIKE ?';
      params.push(`%${filters.kategori}%`);
    }
    if (filters.username) {
      query += ' AND u.username LIKE ?';
      params.push(`%${filters.username}%`);
    }
    if (filters.startDate) {
      query += ' AND a.created_at >= ?';
      params.push(filters.startDate);
    }
    if (filters.endDate) {
      query += ' AND a.created_at <= ?';
      params.push(filters.endDate);
    }

    query += ' ORDER BY a.created_at DESC LIMIT 1000';

    const [results] = await db.query(query, params);
    return results;
  } catch (error) {
    console.error('[AUDIT] Gagal mengambil log data detail:', error.message);
    throw error;
  }
};

module.exports = {
  recordLoginAttempt,
  recordDataLog,
  getAccessLogs,
  getDataLogs,
  getDetailedDataLogs
};
