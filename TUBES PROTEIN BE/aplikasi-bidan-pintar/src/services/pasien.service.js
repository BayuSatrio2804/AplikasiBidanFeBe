// src/services/pasien.service.js (BAGIAN FUNGSI CRUD YANG DIKOREKSI)
const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const auditService = require('./audit.service');

const getAllPasien = async (search) => { 
    let query = 'SELECT * FROM pasien';
    let params = [];
    if (search) {
        query += ' WHERE nama LIKE ? OR nik LIKE ?';
        params.push(`%${search}%`, `%${search}%`);
    }
    query += ' ORDER BY created_at DESC';
    const [rows] = await db.query(query, params);
    return rows;
};

const getPasienById = async (id) => {
    const query = 'SELECT * FROM pasien WHERE id_pasien = ?';
    const [rows] = await db.query(query, [id]);
    return rows.length > 0 ? rows[0] : null;
};

const createPasien = async (data, id_user_aksi) => {
    const { nama, NIK, umur, alamat, no_hp } = data;
    const id_pasien = uuidv4();
    const query = `INSERT INTO pasien (id_pasien, nama, nik, umur, alamat, no_hp) VALUES (?, ?, ?, ?, ?, ?)`;
    await db.query(query, [id_pasien, nama, NIK, umur, alamat, no_hp]);
    
    // --- PANGGILAN DIKOREKSI (4 Parameter) ---
    // recordDataLog(userId, action, description, dataId)
    await auditService.recordDataLog(id_user_aksi, 'CREATE', 'pasien', id_pasien);
    return { id_pasien, ...data };
};

const updatePasien = async (id, id_user_aksi, data) => {
    const { nama, NIK, umur, alamat, no_hp } = data;
    const query = `UPDATE pasien SET nama = ?, nik = ?, umur = ?, alamat = ?, no_hp = ? WHERE id_pasien = ?`;
    await db.query(query, [nama, NIK, umur, alamat, no_hp, id]);
    
    // --- PANGGILAN DIKOREKSI (4 Parameter) ---
    // recordDataLog(userId, action, description, dataId)
    await auditService.recordDataLog(id_user_aksi, 'UPDATE', 'pasien', id);
    return { id, ...data };
};

const deletePasien = async (id, id_user_aksi) => {
    const [result] = await db.query('DELETE FROM pasien WHERE id_pasien = ?', [id]);
    if (result.affectedRows > 0) {
        // --- PANGGILAN DIKOREKSI (4 Parameter) ---
        // recordDataLog(userId, action, description, dataId)
        await auditService.recordDataLog(id_user_aksi, 'DELETE', 'pasien', id);
    }
    return result;
};

const getRiwayatPasien = async (id) => {
    const query = `SELECT * FROM pemeriksaan WHERE id_pasien = ? ORDER BY tanggal_pemeriksaan DESC`;
    const [rows] = await db.query(query, [id]);
    return rows;
};

module.exports = {
    getAllPasien, getPasienById: getPasienById, createPasien, updatePasien, deletePasien, getRiwayatPasien
};