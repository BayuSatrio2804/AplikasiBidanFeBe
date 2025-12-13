// src/controllers/anc.controller.js
const ancService = require('../services/anc.service');

const createRegistrasiANC = async (req, res) => {
    try {
        const id_user_aksi = req.user.id;
        const newRecord = await ancService.createRegistrasiANC(req.body, id_user_aksi);
        
        res.status(201).json({
            message: 'Registrasi Layanan ANC berhasil disimpan secara lengkap.',
            data: newRecord
        });
        
    } catch (error) {
        res.status(500).json({ message: 'Gagal menyimpan registrasi ANC.', error: error.message });
    }
};

module.exports = { createRegistrasiANC };