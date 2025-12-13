// src/services/laporan.service.js
const db = require('../config/database');

const getLaporanData = async (bulan, tahun) => {
    const query = `
        SELECT 
            p.nama AS nama_pasien,                 
            r.tanggal_pemeriksaan AS tanggal,      
            r.jenis_layanan,
            r.subjektif, r.objektif, r.analisa, r.tatalaksana                          
        FROM pemeriksaan r
        JOIN pasien p ON r.id_pasien = p.id_pasien
        WHERE MONTH(r.tanggal_pemeriksaan) = ? AND YEAR(r.tanggal_pemeriksaan) = ?
        ORDER BY r.tanggal_pemeriksaan ASC
    `;
    const [rows] = await db.query(query, [bulan, tahun]);
    return rows;
};

const recordLaporanLog = async (id_user, bulan, tahun, format) => {
    const id_pasien = null; 
    const jenis_layanan = 'BULANAN_DETIL'; 
    const query = `
        INSERT INTO laporan_log 
        (id_pasien, jenis_layanan, periode_bulan, periode_tahun, format_file, keterangan) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const keterangan = `Laporan Detil Excel Dibuat oleh Bidan ID: ${id_user}`;
    
    await db.query(query, [id_pasien, jenis_layanan, bulan, tahun, format, keterangan]);
};


module.exports = {
    getLaporanData,
    recordLaporanLog,
};