// src/validators/kunjunganPasien.validator.js
const Joi = require('joi');
const { VALID_LAYANAN } = require('../utils/constant');

const JENIS_KUNJUNGAN = ["Bayi/Anak", "Umum", "Lain-lain"];

const RegistrasiKunjunganPasienSchema = Joi.object({
    // --- Informasi Layanan ---
    jenis_layanan: Joi.string().valid('Kunjungan Pasien').required().messages({'any.only': 'Jenis Layanan harus "Kunjungan Pasien".'}),
    tanggal: Joi.string().isoDate().required().description('Format: YYYY-MM-DD'),
    no_reg: Joi.string().allow('').optional(), 
    jenis_kunjungan: Joi.string().valid(...JENIS_KUNJUNGAN).required(),
    
    // --- Data Pasien (Master) ---
    nama_pasien: Joi.string().required(), // Nama pasien yang sebenarnya berkunjung
    nik_pasien: Joi.string().length(16).pattern(/^[0-9]+$/).required(), // NIK Pasien (Bayi/Anak/Dewasa)
    umur_pasien: Joi.string().required().description('Umur Pasien (cth: 6 bln atau 2 thn)'),
    bb_pasien: Joi.number().min(0).optional().description('BB Pasien'),
    td_pasien: Joi.string().allow('').optional().description('TD Pasien'),
    
    // --- Data Wali Pasien (Orang Tua/Suami) ---
    nama_wali: Joi.string().required(),
    nik_wali: Joi.string().length(16).pattern(/^[0-9]+$/).allow(null, '').optional(),
    umur_wali: Joi.number().integer().allow(null).optional(),
    
    // --- Informasi Tambahan (Klinis) ---
    keluhan: Joi.string().required().description('Keluhan wajib diisi'),
    diagnosa: Joi.string().required().description('Diagnosa wajib diisi'),
    terapi_obat: Joi.string().allow('').optional(),
    keterangan: Joi.string().allow('').optional(),
    
    // Field SOAP (dibuat opsional/kosong, terintegrasi ke data di atas)
    subjektif: Joi.string().allow('').optional(),
    objektif: Joi.string().allow('').optional(),
    analisa: Joi.string().allow('').optional(),
    tatalaksana: Joi.string().allow('').optional(),
});

module.exports = {
    RegistrasiKunjunganPasienSchema
};