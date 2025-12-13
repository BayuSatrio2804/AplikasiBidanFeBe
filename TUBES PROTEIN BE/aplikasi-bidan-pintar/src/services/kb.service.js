// src/services/kb.service.js
const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const auditService = require('./audit.service');

const createRegistrasiKB = async (data, id_user_aksi) => {
    const { 
        nama_istri, nik_istri, umur_istri, alamat, no_hp, td_ibu, bb_ibu, 
        jenis_layanan, tanggal, metode, no_reg_lama, no_reg_baru, kunjungan_ulang, catatan,
        nama_suami, nik_suami, umur_suami, td_ayah, bb_ayah, subjektif, objektif, analisa, tatalaksana
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

        // 2. Insert ke Tabel Pemeriksaan (Kunjungan KB)
        const id_pemeriksaan = uuidv4();
        const subjektif_final = `Kunjungan KB. Keluhan: ${subjektif || ''}`;
        const objektif_final = `TD Ibu: ${td_ibu}, BB Ibu: ${bb_ibu}. Hasil Periksa: ${objektif || ''}`;
        
        await connection.query(
            `INSERT INTO pemeriksaan (id_pemeriksaan, id_pasien, jenis_layanan, subjektif, objektif, analisa, tatalaksana, tanggal_pemeriksaan) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [id_pemeriksaan, id_pasien, jenis_layanan, subjektif_final, objektif_final, analisa, tatalaksana, tanggal]
        );

        // 3. Insert ke Tabel Layanan KB (Data Spesifik KB)
        const id_kb = uuidv4();
        await connection.query(
            `INSERT INTO layanan_kb (id_kb, id_pemeriksaan, no_reg_lama, no_reg_baru, nama_suami, nik_suami, umur_suami, td_ayah, bb_ayah, metode_kb, kunjungan_ulang, catatan)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id_kb, id_pemeriksaan, no_reg_lama, no_reg_baru, nama_suami, nik_suami, umur_suami, td_ayah, bb_ayah, metode, kunjungan_ulang, catatan]
        );

        await connection.commit(); 
        await auditService.recordDataLog(id_user_aksi, 'CREATE', 'layanan_kb', id_kb, `Menambahkan Registrasi KB untuk NIK: ${nik_istri}`);
        connection.release();

        return { id_pemeriksaan, id_kb, id_pasien, ...data };

    } catch (error) {
        if (connection) {
            await connection.rollback(); 
            connection.release();
        }
        throw error;
    }
};

module.exports = { createRegistrasiKB };