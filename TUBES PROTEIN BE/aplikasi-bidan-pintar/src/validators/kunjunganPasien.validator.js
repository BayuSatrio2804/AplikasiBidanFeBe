// src/validators/kunjunganPasien.validator.js
const Joi = require('joi');

const JENIS_KUNJUNGAN = ["Bayi", "Anak", "Hamil", "Nifas", "KB", "Lansia"];

const RegistrasiKunjunganPasienSchema = Joi.object({
    // --- Informasi Layanan ---
    jenis_layanan: Joi.string().valid('Kunjungan Pasien').optional().messages({'any.only': 'Jenis Layanan harus "Kunjungan Pasien".'}),
    tanggal: Joi.string().isoDate().required().description('Format: YYYY-MM-DD'),
    no_reg: Joi.string().allow('', null).optional(), 
    jenis_kunjungan: Joi.string().valid(...JENIS_KUNJUNGAN).required(),
    
    // --- Data Pasien (Master) ---
    nama_pasien: Joi.string().required(), // Nama pasien yang sebenarnya berkunjung
    nik_pasien: Joi.string().length(16).pattern(/^[0-9]+$/).allow('', null).optional()
        .messages({
            'string.length': 'NIK Pasien harus 16 digit',
            'string.pattern.base': 'NIK Pasien hanya boleh berisi angka'
        }), // NIK Pasien harus 16 digit angka
    umur_pasien: Joi.alternatives().try(
      Joi.number().integer(),
      Joi.string()
    ).required().description('Umur Pasien (angka atau string seperti "6 bln")'),
    bb_pasien: Joi.alternatives().try(
      Joi.number().min(0),
      Joi.string().allow('', null)
    ).optional().description('BB Pasien'),
    td_pasien: Joi.string().allow('', null).optional().description('TD Pasien'),
    
    // --- Data Wali Pasien (Orang Tua/Suami) ---
    nama_wali: Joi.string().allow('', null).optional(),
    nik_wali: Joi.string().length(16).pattern(/^[0-9]+$/).allow('', null).optional()
        .messages({
            'string.length': 'NIK Wali harus 16 digit',
            'string.pattern.base': 'NIK Wali hanya boleh berisi angka'
        }), // NIK Wali harus 16 digit angka
    umur_wali: Joi.alternatives().try(
      Joi.number().integer(),
      Joi.string().allow('', null)
    ).optional(),
    
    // --- Informasi Tambahan (Klinis) ---
    keluhan: Joi.string().required().description('Keluhan wajib diisi'),
    diagnosa: Joi.string().required().description('Diagnosa wajib diisi'),
    terapi_obat: Joi.string().allow('', null).optional(),
    keterangan: Joi.string().allow('', null).optional(),
    
    // Field SOAP (dibuat opsional/kosong, terintegrasi ke data di atas)
    subjektif: Joi.string().allow('', null).optional(),
    objektif: Joi.string().allow('', null).optional(),
    analisa: Joi.string().allow('', null).optional(),
    tatalaksana: Joi.string().allow('', null).optional(),
});

module.exports = {
    RegistrasiKunjunganPasienSchema
};