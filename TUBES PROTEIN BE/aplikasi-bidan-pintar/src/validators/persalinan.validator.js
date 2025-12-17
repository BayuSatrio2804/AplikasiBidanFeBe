// src/validators/persalinan.validator.js
const Joi = require('joi');

const RegistrasiPersalinanSchema = Joi.object({
    jenis_layanan: Joi.string().valid('Persalinan').required(),
    tanggal: Joi.string().required(),
    penolong: Joi.string().required(),
    no_reg_lama: Joi.string().allow('').optional(),
    no_reg_baru: Joi.string().allow('').optional(),

    // Data Ibu
    nama_istri: Joi.string().required(),
    nik_istri: Joi.alternatives().try(
      Joi.string().length(16).pattern(/^[0-9]+$/),
      Joi.string().allow('')
    ).optional(),
    umur_istri: Joi.alternatives().try(Joi.number(), Joi.string()).allow('').optional(),
    alamat: Joi.string().required(),
    no_hp: Joi.string().allow('').optional(),
    td_ibu: Joi.string().allow('').optional(),
    bb_ibu: Joi.alternatives().try(Joi.number(), Joi.string()).allow('').optional(),
    
    // Data Ayah
    nama_suami: Joi.string().required(),
    nik_suami: Joi.alternatives().try(
      Joi.string().length(16).pattern(/^[0-9]+$/),
      Joi.string().allow('')
    ).allow(null).optional(),
    umur_suami: Joi.alternatives().try(Joi.number(), Joi.string()).allow(null, '').optional(),
    
    // Informasi Tambahan (Bayi & Klinis Persalinan)
    tanggal_lahir: Joi.string().required(),
    jenis_kelamin: Joi.string().valid('L', 'P', 'Tidak Diketahui').required(),
    anak_ke: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
    jenis_partus: Joi.string().allow('').optional(),
    imd_dilakukan: Joi.alternatives().try(Joi.boolean(), Joi.string().valid('true', 'false', '')).optional(),
    
    // Klinis Bayi/Ibu
    as_bayi: Joi.string().allow('').optional(),
    bb_bayi: Joi.alternatives().try(Joi.number(), Joi.string()).allow('').optional(),
    pb_bayi: Joi.alternatives().try(Joi.number(), Joi.string()).allow('').optional(),
    lila_ibu: Joi.alternatives().try(Joi.number(), Joi.string()).allow('').optional(),
    lida_ibu: Joi.alternatives().try(Joi.number(), Joi.string()).allow('').optional(),
    lika_bayi: Joi.alternatives().try(Joi.number(), Joi.string()).allow('').optional(),

    // Field SOAP
    subjektif: Joi.string().allow('').optional(),
    objektif: Joi.string().allow('').optional(),
    analisa: Joi.string().allow('').optional(),
    tatalaksana: Joi.string().allow('').optional(),
}).unknown(true);

module.exports = {
    RegistrasiPersalinanSchema
};