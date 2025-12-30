// src/validators/imunisasi.validator.js
const Joi = require('joi');

const RegistrasiImunisasiSchema = Joi.object({
    jenis_layanan: Joi.string().valid('Imunisasi').required(),
    tanggal: Joi.string().required(),
    no_reg: Joi.string().allow('').optional(),
    jenis_imunisasi: Joi.string().required(),
    pengobatan: Joi.string().allow('').optional(),

    // Data Ibu
    nama_istri: Joi.string().required(),
    nik_istri: Joi.string().length(16).pattern(/^[0-9]+$/).required(),
    umur_istri: Joi.alternatives().try(Joi.number(), Joi.string()).allow('').optional(),
    alamat: Joi.string().required(),
    no_hp: Joi.string().allow('').optional(),

    // Data Ayah
    nama_suami: Joi.string().allow('').optional(),
    nik_suami: Joi.alternatives().try(
        Joi.string().length(16).pattern(/^[0-9]+$/),
        Joi.string().allow('')
    ).allow(null).optional(),
    umur_suami: Joi.alternatives().try(Joi.number(), Joi.string()).allow(null, '').optional(),

    // Data Bayi
    nama_bayi_balita: Joi.string().required(),
    tanggal_lahir_bayi: Joi.string().required(),
    tb_bayi: Joi.alternatives().try(Joi.number(), Joi.string()).allow('').optional(),
    bb_bayi: Joi.alternatives().try(Joi.number(), Joi.string()).allow('').optional(),

    // Info Tambahan
    jadwal_selanjutnya: Joi.string().allow('').optional(),
    jam_jadwal_selanjutnya: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).allow('').optional(),
    jam_jadwal_selanjutnya_selesai: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).allow('').optional(),

    // Field SOAP (optional)
    subjektif: Joi.string().allow('').optional(),
    objektif: Joi.string().allow('').optional(),
    analisa: Joi.string().allow('').optional(),
    tatalaksana: Joi.string().allow('').optional(),
}).unknown(true);

module.exports = {
    RegistrasiImunisasiSchema
};