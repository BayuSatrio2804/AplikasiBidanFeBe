// src/validators/persalinan.validator.js
const Joi = require('joi');

const RegistrasiPersalinanSchema = Joi.object({
    jenis_layanan: Joi.string().valid('Persalinan').required(),
    tanggal: Joi.string().isoDate().required(),
    penolong: Joi.string().required(),
    no_reg_lama: Joi.string().allow('').optional(),
    no_reg_baru: Joi.string().allow('').optional(),

    // Data Ibu
    nama_istri: Joi.string().required(),
    nik_istri: Joi.string().length(16).pattern(/^[0-9]+$/).required(),
    umur_istri: Joi.number().integer().min(1).required(),
    alamat: Joi.string().required(),
    no_hp: Joi.string().min(8).max(15).required(),
    td_ibu: Joi.string().required(),
    bb_ibu: Joi.number().min(1).required(),
    
    // Data Ayah
    nama_suami: Joi.string().required(),
    nik_suami: Joi.string().length(16).pattern(/^[0-9]+$/).allow(null, '').optional(),
    umur_suami: Joi.number().integer().allow(null).optional(),
    
    // Informasi Tambahan (Bayi & Klinis Persalinan)
    tanggal_lahir: Joi.string().isoDate().required(),
    jenis_kelamin: Joi.string().valid('L', 'P', 'Tidak Diketahui').required(),
    anak_ke: Joi.number().integer().min(1).required(),
    jenis_partus: Joi.string().required(),
    imd_dilakukan: Joi.boolean().required(), 
    
    // Klinis Bayi/Ibu
    as_bayi: Joi.string().allow('').optional(),
    bb_bayi: Joi.number().min(1).required(),
    pb_bayi: Joi.number().min(1).required(),
    lila_ibu: Joi.number().min(1).required(),
    lida_ibu: Joi.number().min(1).required(),
    lika_bayi: Joi.number().min(1).required(),

    // Field SOAP
    subjektif: Joi.string().allow('').optional(),
    objektif: Joi.string().allow('').optional(),
    analisa: Joi.string().allow('').optional(),
    tatalaksana: Joi.string().allow('').optional(),
});

module.exports = {
    RegistrasiPersalinanSchema
};