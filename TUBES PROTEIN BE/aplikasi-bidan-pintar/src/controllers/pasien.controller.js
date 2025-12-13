// src/controllers/pasien.controller.js
const pasienService = require('../services/pasien.service');

const getAllPasien = async (req, res) => {
    try {
        const { search } = req.query;
        const data = await pasienService.getAllPasien(search); 
        res.status(200).json({ message: 'Berhasil mengambil data pasien', data });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const createPasien = async (req, res) => {
    try {
        const id_user_aksi = req.user.id;
        const newPasien = await pasienService.createPasien(req.body, id_user_aksi); 
        res.status(201).json({ message: 'Pasien berhasil ditambahkan', data: newPasien });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'NIK sudah terdaftar, silakan cek kembali.' });
        }
        res.status(500).json({ message: 'Gagal menyimpan data', error: error.message });
    }
};

const updatePasien = async (req, res) => {
    const { id } = req.params;
    try {
        const existingPasien = await pasienService.getPasienById(id);
        if (!existingPasien) {
            return res.status(404).json({ message: 'Pasien tidak ditemukan. Gagal update.' });
        }

        const id_user_aksi = req.user.id;
        const updatedPasien = await pasienService.updatePasien(id, id_user_aksi, req.body);
        
        res.status(200).json({ message: 'Data pasien berhasil diperbarui', data: updatedPasien });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'NIK sudah terdaftar di pasien lain.' });
        }
        res.status(500).json({ message: 'Gagal memperbarui data', error: error.message });
    }
};

const deletePasien = async (req, res) => {
    const { id } = req.params;
    try {
        const id_user_aksi = req.user.id;
        const result = await pasienService.deletePasien(id, id_user_aksi);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pasien tidak ditemukan. Gagal hapus.' });
        }
        res.status(200).json({ message: 'Pasien berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus data', error: error.message });
    }
};

const getRiwayatPasien = async (req, res) => {
    const { id } = req.params;
    try {
        const existingPasien = await pasienService.getPasienById(id);
        if (!existingPasien) {
            return res.status(404).json({ message: 'Pasien tidak ditemukan.' });
        }
        const riwayat = await pasienService.getRiwayatPasien(id);
        
        res.status(200).json({
            message: `Riwayat pemeriksaan untuk pasien ${existingPasien.nama} berhasil diambil`,
            data: riwayat
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getPasienById = async (req, res) => {
    const { id } = req.params;
    try {
        console.log('Fetching pasien with ID:', id);
        const pasien = await pasienService.getPasienById(id);
        if (!pasien) {
            return res.status(404).json({ message: 'Pasien tidak ditemukan.' });
        }
        res.status(200).json({ message: 'Berhasil mengambil data pasien', data: pasien });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { getAllPasien, createPasien, getPasienById, updatePasien, deletePasien, getRiwayatPasien };