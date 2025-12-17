// src/validators/anc.validator.js
/**
 * ANC Registration Validator
 * Validates data sent from frontend LayananANC component
 */
const Joi = require('joi');

const RegistrasiANCSchema = Joi.object({
    // Service information
    jenis_layanan: Joi.string().valid('ANC').required(),
    tanggal: Joi.string().required(),
    
    // Mother information (required)
    nama_istri: Joi.string().required(),
    nik_istri: Joi.string().length(16).pattern(/^[0-9]+$/).required(),
    umur_istri: Joi.number().required(),
    alamat: Joi.string().required(),
    
    // Contact information
    no_hp: Joi.string().allow('').optional(),
    
    // Registration numbers
    no_reg_lama: Joi.string().allow('').optional(),
    no_reg_baru: Joi.string().allow('').optional(),
    
    // Spouse information (optional)
    nama_suami: Joi.string().allow('').optional(),
    nik_suami: Joi.string().allow('').optional(),
    umur_suami: Joi.number().allow(null).optional(),
    
    // Pregnancy information (optional)
    hpht: Joi.string().allow('').optional(),
    hpl: Joi.string().allow('').optional(),
    
    // Examination findings (required)
    hasil_pemeriksaan: Joi.string().required(),
    
    // Additional information (optional)
    tindakan: Joi.string().allow('').optional(),
    keterangan: Joi.string().allow('').optional()
}).unknown(true);

module.exports = {
    RegistrasiANCSchema
};