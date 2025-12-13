// src/validators/imunisasi.validator.js
const Joi = require('joi');

const RegistrasiImunisasiSchema = Joi.object({
    jenis_layanan: Joi.string().valid('Imunisasi').required(),
    tanggal: Joi.string().isoDate().required(),
    no_reg: Joi.string().allow('').optional(), 
    jenis_imunisasi: Joi.string().required(),
    
    // Data Ibu (Master Pasien)
    nama_istri: Joi.string().required(),
    nik_istri: Joi.string().length(16).pattern(/^[0-9]+$/).required(),
    umur_istri: Joi.number().integer().min(1).required(),
    alamat: Joi.string().required(),
    
    // Data Ayah (Suami)
    nama_suami: Joi.string().required(),
    nik_suami: Joi.string().length(16).pattern(/^[0-9]+$/).allow(null, '').optional(),
    umur_suami: Joi.number().integer().allow(null).optional(),
    
    // Data Bayi/Balita (Subjek Imunisasi)
    nama_bayi_balita: Joi.string().required(),
    tanggal_lahir_bayi: Joi.string().isoDate().required(),
    tb_bayi: Joi.number().min(1).required(),
    bb_bayi: Joi.number().min(1).required(),
    
    // Informasi Tambahan
    jadwal_selanjutnya: Joi.string().isoDate().required(),
    no_hp: Joi.string().min(8).max(15).required(),
    pengobatan: Joi.string().allow('').optional(), 
    
    // Field SOAP
    subjektif: Joi.string().allow('').optional(),
    objektif: Joi.string().allow('').optional(),
    analisa: Joi.string().allow('').optional(),
    tatalaksana: Joi.string().allow('').optional(),
});

module.exports = {
    RegistrasiImunisasiSchema
};