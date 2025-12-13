// src/controllers/kunjunganPasien.controller.js
const kunjunganPasienService = require('../services/kunjunganPasien.service');

const createRegistrasiKunjunganPasien = async (req, res) => {
    try {
        const newRecord = await kunjunganPasienService.createRegistrasiKunjunganPasien(req.body);
        
        res.status(201).json({
            message: 'Registrasi Layanan Kunjungan Pasien berhasil disimpan secara lengkap.',
            data: newRecord
        });
        
    } catch (error) {
        res.status(500).json({ message: 'Gagal menyimpan registrasi Kunjungan Pasien.', error: error.message });
    }
};

module.exports = {
    createRegistrasiKunjunganPasien
};