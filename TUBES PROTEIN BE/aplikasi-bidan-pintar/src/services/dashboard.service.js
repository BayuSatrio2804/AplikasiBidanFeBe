// src/services/dashboard.service.js
const db = require('../config/database');
const { VALID_LAYANAN } = require('../utils/constant');

const getRekapLayanan = async (tahun) => {
    let params = [];
    
    let query = `
        SELECT 
            jenis_layanan,
            COUNT(id_pasien) as jumlah_kunjungan
        FROM pemeriksaan
        WHERE jenis_layanan IN (?)
    `;
    params.push(VALID_LAYANAN);

    if (tahun) {
        query += ' AND YEAR(tanggal_pemeriksaan) = ?';
        params.push(tahun);
    }

    query += ' GROUP BY jenis_layanan';
    
    const [rows] = await db.query(query, params);
    
    let totalKunjungan = 0;
    rows.forEach(row => {
        totalKunjungan += row.jumlah_kunjungan;
    });

    const rekapData = rows.map(row => {
        const persentase = (row.jumlah_kunjungan / totalKunjungan) * 100;
        return {
            layanan: row.jenis_layanan,
            jumlah_pasien: row.jumlah_kunjungan,
            persentase: parseFloat(persentase.toFixed(2))
        };
    });

    return { total: totalKunjungan, data: rekapData };
};

module.exports = {
    getRekapLayanan
};