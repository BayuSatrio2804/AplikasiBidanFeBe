// src/services/audit.service.js
const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

/**
 * Mencatat riwayat upaya login (ke tabel audit_log_akses).
 * @param {string} userId - id_user (Boleh NULL jika gagal total).
 * @param {string} username - Username yang dicoba.
 * @param {'BERHASIL' | 'GAGAL'} status - Status upaya login.
 * @param {string} ipAddress - Alamat IP.
 */
const recordLoginAttempt = async (userId, username, status, ipAddress) => {
    try {
        const id_akses = uuidv4();
        // NAMA TABEL: audit_log_akses
        const query = `
            INSERT INTO audit_log_akses (id_akses, id_user, username, status, ip_address, tanggal_akses) 
            VALUES (?, ?, ?, ?, ?, NOW())
        `;
        // PASTIKAN URUTAN INI SAMA DENGAN URUTAN KOLOM DI ATAS:
        // [id_akses, id_user, username, status, ip_address]
        await db.query(query, [id_akses, userId, username, status, ipAddress]);
    } catch (error) {
        console.error('Error recording login attempt:', error);
    }
};

/**
 * Mencatat riwayat perubahan data (CRUD) (ke tabel audit_logs).
 * @param {string} userId - id_user yang melakukan aksi. (HARUS ADA DI TABEL users)
 * @param {'CREATE' | 'UPDATE' | 'DELETE'} action - Jenis aksi.
 * @param {string} description - Deskripsi tabel yang diubah (e.g., 'pasien').
 * @param {string} dataId - ID data yang terpengaruh (e.g., id_pasien).
 */
const recordDataLog = async (userId, action, description, dataId) => {
    try {
        const id_audit = uuidv4();
        // NAMA TABEL: audit_logs
        const query = `
            INSERT INTO audit_logs (id_audit, id_user, action, description, id_data_terkait, created_at)
            VALUES (?, ?, ?, ?, ?, NOW())
        `;
        
        // PASTIKAN URUTAN INI SAMA DENGAN URUTAN KOLOM DI ATAS:
        // [id_audit, id_user, action, description, id_data_terkait]
        await db.query(query, [id_audit, userId, action, description, dataId]);
        
    } catch (error) {
        // Error ini terjadi jika userId tidak ditemukan di tabel users.
        console.error('Error recording data log:', error);
        // Penting: Throw error agar Controller tahu kalau logging gagal (opsional, tapi disarankan)
        throw error; 
    }
};

module.exports = {
    recordLoginAttempt,
    recordDataLog
};