// src/validators/anc.validator.js
const Joi = require('joi');

const RegistrasiANCSchema = Joi.object({
    jenis_layanan: Joi.string().valid('ANC').required(),
    tanggal: Joi.string().isoDate().required(),
    tindakan: Joi.string().allow('').optional(), 
    no_reg_lama: Joi.string().allow('').optional(),
    no_reg_baru: Joi.string().allow('').optional(),

    // Data Ibu & Ayah
    nama_istri: Joi.string().required(),
    nik_istri: Joi.string().length(16).pattern(/^[0-9]+$/).required(),
    umur_istri: Joi.number().integer().min(1).required(),
    alamat: Joi.string().required(),
    no_hp: Joi.string().min(8).max(15).required(),
    
    nama_suami: Joi.string().required(),
    nik_suami: Joi.string().length(16).pattern(/^[0-9]+$/).allow(null, '').optional(),
    umur_suami: Joi.number().integer().allow(null).optional(),
    
    // Informasi Tambahan (Kehamilan & Hasil)
    hpht: Joi.string().isoDate().optional(),
    hpl: Joi.string().isoDate().optional(),
    hasil_pemeriksaan: Joi.string().required(),
    keterangan: Joi.string().allow('').optional(),

    // Field SOAP (diperlukan untuk konsistensi skema pemeriksaan)
    subjektif: Joi.string().allow('').optional(),
    objektif: Joi.string().allow('').optional(),
    analisa: Joi.string().allow('').optional(),
    tatalaksana: Joi.string().allow('').optional(),
});

module.exports = {
    RegistrasiANCSchema
};