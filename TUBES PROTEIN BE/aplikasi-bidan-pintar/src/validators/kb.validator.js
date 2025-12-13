// src/validators/kb.validator.js
const Joi = require('joi');

const KB_METODE = ["KDM", "PIL", "SUNTIK", "IMP", "IUD", "LAINNYA"]; 

const RegistrasiKBSchema = Joi.object({
    jenis_layanan: Joi.string().valid('KB').required(),
    tanggal: Joi.string().isoDate().required(),
    metode: Joi.string().valid(...KB_METODE).required(), 
    no_reg_lama: Joi.string().allow('').optional(),
    no_reg_baru: Joi.string().allow('').optional(),
    kunjungan_ulang: Joi.string().isoDate().allow(null, '').optional(),

    // Data Ibu
    nama_istri: Joi.string().required(),
    nik_istri: Joi.string().length(16).pattern(/^[0-9]+$/).required(),
    umur_istri: Joi.number().integer().min(1).required(),
    td_ibu: Joi.string().required(),
    bb_ibu: Joi.number().min(1).required(),
    alamat: Joi.string().required(),
    no_hp: Joi.string().min(8).max(15).required(),

    // Data Ayah
    nama_suami: Joi.string().required(),
    nik_suami: Joi.string().length(16).pattern(/^[0-9]+$/).allow(null, '').optional(),
    umur_suami: Joi.number().integer().allow(null).optional(),
    td_ayah: Joi.string().allow('').optional(),
    bb_ayah: Joi.number().allow(null).optional(),
    
    catatan: Joi.string().allow('').optional(),
    
    // Field SOAP 
    subjektif: Joi.string().allow('').optional(),
    objektif: Joi.string().allow('').optional(),
    analisa: Joi.string().allow('').optional(),
    tatalaksana: Joi.string().allow('').optional(),
});

module.exports = {
    RegistrasiKBSchema
};