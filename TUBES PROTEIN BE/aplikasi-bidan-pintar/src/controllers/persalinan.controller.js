// src/controllers/persalinan.controller.js
const persalinanService = require('../services/persalinan.service');

const createRegistrasiPersalinan = async (req, res) => {
    try {
        const id_user_aksi = req.user.id;
        const newRecord = await persalinanService.createRegistrasiPersalinan(req.body, id_user_aksi);
        
        res.status(201).json({
            message: 'Registrasi Layanan Persalinan berhasil disimpan secara lengkap.',
            data: newRecord
        });
        
    } catch (error) {
        res.status(500).json({ message: 'Gagal menyimpan registrasi Persalinan.', error: error.message });
    }
};

module.exports = { createRegistrasiPersalinan };