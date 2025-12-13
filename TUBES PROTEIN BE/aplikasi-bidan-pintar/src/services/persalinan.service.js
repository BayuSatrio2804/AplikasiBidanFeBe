// src/services/persalinan.service.js
const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const auditService = require('./audit.service');

const createRegistrasiPersalinan = async (data, id_user_aksi) => {
    const { 
        nama_istri, nik_istri, umur_istri, alamat, no_hp, td_ibu, bb_ibu, 
        jenis_layanan, tanggal, penolong, no_reg_lama, no_reg_baru, 
        nama_suami, nik_suami, umur_suami, 
        tanggal_lahir, jenis_kelamin, anak_ke, jenis_partus, imd_dilakukan,
        as_bayi, bb_bayi, pb_bayi, lika_bayi, lida_ibu, lila_ibu, 
        subjektif, objektif, analisa, tatalaksana, catatan
    } = data;

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction(); 
        // 1. Cek/Buat Pasien Ibu (Master Pasien)
        let id_pasien;
        const [existingPasien] = await connection.query('SELECT id_pasien FROM pasien WHERE nik = ?', [nik_istri]);

        if (existingPasien.length > 0) {
            id_pasien = existingPasien[0].id_pasien;
            await connection.query('UPDATE pasien SET nama = ?, umur = ?, alamat = ?, no_hp = ? WHERE id_pasien = ?', [nama_istri, umur_istri, alamat, no_hp, id_pasien]);
        } else {
            id_pasien = uuidv4();
            await connection.query('INSERT INTO pasien (id_pasien, nama, nik, umur, alamat, no_hp) VALUES (?, ?, ?, ?, ?, ?)', [id_pasien, nama_istri, nik_istri, umur_istri, alamat, no_hp]);
        }

        // 2. Insert ke Tabel Pemeriksaan (Kunjungan Persalinan)
        const id_pemeriksaan = uuidv4();
        const subjektif_final = `Persalinan Anak ke-${anak_ke}. ${subjektif || ''}`;
        const objektif_final = `TD Ibu: ${td_ibu}, BB Ibu: ${bb_ibu}. Hasil persalinan: ${jenis_partus}. BB Bayi: ${bb_bayi}g. ${objektif || ''}`;
        
        await connection.query(
            `INSERT INTO pemeriksaan (id_pemeriksaan, id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana, tanggal_pemeriksaan) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [id_pemeriksaan, id_pasien, jenis_layanan, subjektif_final, objektif_final, analisa, tatalaksana, tanggal]
        );

        // 3. Insert ke Tabel Layanan Persalinan (Data Spesifik Persalinan & Bayi)
        const id_persalinan = uuidv4();
        await connection.query(
            `INSERT INTO layanan_persalinan (id_persalinan, id_pemeriksaan, no_reg_lama, no_reg_baru, penolong, nama_suami, nik_suami, umur_suami, 
             tanggal_lahir, jenis_kelamin, anak_ke, jenis_partus, imd_dilakukan, as_bayi, bb_bayi, pb_bayi, 
             lila_ibu, lida_ibu, lika_bayi)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id_persalinan, id_pemeriksaan, no_reg_lama, no_reg_baru, penolong, nama_suami, nik_suami, umur_suami, 
             tanggal_lahir, jenis_kelamin, anak_ke, jenis_partus, imd_dilakukan, as_bayi, bb_bayi, pb_bayi, 
             lila_ibu, lida_ibu, lika_bayi]
        );

        await connection.commit(); 
        await auditService.recordDataLog(id_user_aksi, 'CREATE', 'layanan_persalinan', id_persalinan, `Menambahkan Registrasi Persalinan untuk NIK: ${nik_istri}`);
        connection.release();

        return { id_persalinan, id_pemeriksaan, id_pasien, ...data };

    } catch (error) {
        if (connection) {
            await connection.rollback(); 
            connection.release();
        }
        throw error;
    }
};

module.exports = { createRegistrasiPersalinan };