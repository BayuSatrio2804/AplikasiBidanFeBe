const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const listJadwal = async (bulan, tahun, layanan) => {
    let query = `
        SELECT 
            j.id_jadwal, j.tanggal, j.jam_mulai, j.jam_selesai, j.jenis_layanan,
            p.nama as nama_pasien, 
            u.nama_lengkap as nama_petugas
        FROM jadwal j
        JOIN pasien p ON j.id_pasien = p.id_pasien
        JOIN users u ON j.id_petugas = u.id_user
        WHERE 1=1 
    `;
    let params = [];

    // Filter berdasarkan bulan, tahun, dan layanan
    if (bulan && tahun) {
        query += ' AND MONTH(j.tanggal) = ? AND YEAR(j.tanggal) = ?';
        params.push(bulan, tahun);
    }
    if (layanan) {
        query += ' AND j.jenis_layanan = ?';
        params.push(layanan);
    }

    query += ' ORDER BY j.tanggal ASC, j.jam_mulai ASC';
    
    const [rows] = await db.query(query, params);
    return rows;
};

const createJadwal = async (data) => {
    const { id_pasien, id_petugas, jenis_layanan, tanggal, jam_mulai, jam_selesai } = data;
    const id_jadwal = uuidv4();

    const query = `
        INSERT INTO jadwal 
        (id_jadwal, id_pasien, id_petugas, jenis_layanan, tanggal, jam_mulai, jam_selesai) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    await db.query(query, [id_jadwal, id_pasien, id_petugas, jenis_layanan, tanggal, jam_mulai, jam_selesai]);
    return { id_jadwal, ...data };
};

const getDetailJadwal = async (id_jadwal) => {
    const query = `
        SELECT 
            j.id_jadwal, j.tanggal, j.jam_mulai, j.jam_selesai, j.jenis_layanan,
            p.nama as nama_pasien, 
            u.nama_lengkap as nama_petugas
        FROM jadwal j
        JOIN pasien p ON j.id_pasien = p.id_pasien
        JOIN users u ON j.id_petugas = u.id_user
        WHERE j.id_jadwal = ?
    `;
    const [rows] = await db.query(query, [id_jadwal]);
    return rows[0];
};

const updateJadwal = async (id_jadwal, data) => {
    const { id_pasien, id_petugas, jenis_layanan, tanggal, jam_mulai, jam_selesai } = data;

    const query = `
        UPDATE jadwal SET 
        id_pasien = ?, id_petugas = ?, jenis_layanan = ?, tanggal = ?, jam_mulai = ?, jam_selesai = ? 
        WHERE id_jadwal = ?
    `;
    
    await db.query(query, [id_pasien, id_petugas, jenis_layanan, tanggal, jam_mulai, jam_selesai, id_jadwal]);
    
    return { id_jadwal, ...data };
};

const deleteJadwal = async (id_jadwal) => {
    const [result] = await db.query('DELETE FROM jadwal WHERE id_jadwal = ?', [id_jadwal]);
    return result;
};


module.exports = {
    listJadwal,
    createJadwal,
    getDetailJadwal,
    updateJadwal,
    deleteJadwal,
};