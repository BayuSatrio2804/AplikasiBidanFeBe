const jadwalService = require('../services/jadwal.service');
const db = require('../config/database');

// 1. GET List & Filter Jadwal
const listJadwal = async (req, res) => {
    const { bulan, tahun, layanan } = req.query; 

    try {
        const data = await jadwalService.listJadwal(bulan, tahun, layanan);

        res.status(200).json({ message: 'Berhasil mengambil data jadwal', data });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 2. POST Buat Jadwal Baru
const createJadwal = async (req, res) => {
    try {
        const newJadwal = await jadwalService.createJadwal(req.body);

        res.status(201).json({ message: 'Jadwal berhasil dibuat', data: newJadwal });
    } catch (error) {
        res.status(500).json({ message: 'Gagal membuat jadwal', error: error.message });
    }
};

// 3. GET Detail Jadwal
const getDetailJadwal = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await jadwalService.getDetailJadwal(id);
        
        if (!data) {
            return res.status(404).json({ message: 'Data jadwal tidak ditemukan' });
        }

        res.status(200).json({ message: 'Detail jadwal ditemukan', data });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 4. PUT Update Jadwal
const updateJadwal = async (req, res) => {
    const { id } = req.params;
    try {
        const existingJadwal = await jadwalService.getDetailJadwal(id);
        if (!existingJadwal) {
            return res.status(404).json({ message: 'Jadwal tidak ditemukan' });
        }

        const updatedJadwal = await jadwalService.updateJadwal(id, req.body);
        res.status(200).json({ message: 'Jadwal berhasil diperbarui', data: updatedJadwal });

    } catch (error) {
        res.status(500).json({ message: 'Gagal update jadwal', error: error.message });
    }
};

// 5. DELETE Hapus Jadwal
const deleteJadwal = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await jadwalService.deleteJadwal(id); // Dipindahkan ke Service
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Jadwal tidak ditemukan' });
        }
        res.status(200).json({ 
            message: 'Jadwal berhasil dihapus',
            id_jadwal: id
        });
        
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus jadwal', error: error.message });
    }
};

module.exports = {
    listJadwal,
    createJadwal,
    getDetailJadwal,
    updateJadwal,
    deleteJadwal
};