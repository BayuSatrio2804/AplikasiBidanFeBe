// src/controllers/pemeriksaan.controller.js
const pemeriksaanService = require('../services/pemeriksaan.service');

const getAllPemeriksaan = async (req, res) => {
    try {
        const data = await pemeriksaanService.getAllPemeriksaan();
        res.status(200).json({ message: 'Berhasil mengambil data pemeriksaan', data });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const createPemeriksaan = async (req, res) => {
    try {
        const id_user_aksi = req.user.id;
        const newPemeriksaan = await pemeriksaanService.createPemeriksaan(req.body, id_user_aksi);

        res.status(201).json({
            message: 'Catatan pemeriksaan berhasil disimpan.',
            data: newPemeriksaan
        });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menyimpan data pemeriksaan.', error: error.message });
    }
};

const getDetailPemeriksaan = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await pemeriksaanService.getDetailPemeriksaan(id);
        if (!data) {
            return res.status(404).json({ message: 'Data pemeriksaan tidak ditemukan' });
        }
        res.status(200).json({ message: 'Detail pemeriksaan berhasil diambil', data });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const updatePemeriksaan = async (req, res) => {
    const { id } = req.params;
    try {
        const existingPemeriksaan = await pemeriksaanService.getDetailPemeriksaan(id);
        if (!existingPemeriksaan) {
            return res.status(404).json({ message: 'Data pemeriksaan tidak ditemukan' });
        }

        const id_user_aksi = req.user.id;
        const updatedPemeriksaan = await pemeriksaanService.updatePemeriksaan(id, id_user_aksi, req.body);

        res.status(200).json({ message: 'Catatan SOAP berhasil diperbarui.', data: updatedPemeriksaan });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengupdate catatan SOAP.', error: error.message });
    }
};

module.exports = { getAllPemeriksaan, createPemeriksaan, getDetailPemeriksaan, updatePemeriksaan };