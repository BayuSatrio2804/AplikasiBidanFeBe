// src/services/kunjunganPasien.service.js
const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const createRegistrasiKunjunganPasien = async (data) => {
    // ... (Logika Transaksi: Cek/Update Pasien, Insert Pemeriksaan, Insert layanan_kunjungan_pasien)
    // Logika persis sama dengan yang disetujui sebelumnya
    // ...
    return { id_kunjungan, id_pemeriksaan, id_pasien, ...data };
};
// ... export fungsi lainnya