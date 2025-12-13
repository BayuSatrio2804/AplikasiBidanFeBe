// src/controllers/kb.controller.js
const kbService = require('../services/kb.service');

const createRegistrasiKB = async (req, res) => {
    try {
        const id_user_aksi = req.user.id;
        const newRecord = await kbService.createRegistrasiKB(req.body, id_user_aksi);
        
        res.status(201).json({
            message: 'Registrasi Layanan KB berhasil disimpan secara lengkap.',
            data: newRecord
        });
        
    } catch (error) {
        res.status(500).json({ message: 'Gagal menyimpan registrasi KB.', error: error.message });
    }
};

module.exports = { createRegistrasiKB };