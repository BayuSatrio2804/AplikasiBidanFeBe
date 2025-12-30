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
  umur_istri: Joi.alternatives().try(Joi.number(), Joi.string()).allow('').optional(),
  alamat: Joi.string().required(),

  // Contact information
  no_hp: Joi.string().allow('').optional(),

  // Registration numbers
  no_reg_lama: Joi.string().allow('').optional(),
  no_reg_baru: Joi.string().allow('').optional(),

  // Spouse information (optional)
  nama_suami: Joi.string().allow('').optional(),
  nik_suami: Joi.alternatives().try(
    Joi.string().length(16).pattern(/^[0-9]+$/),
    Joi.string().allow('')
  ).optional(),
  umur_suami: Joi.alternatives().try(Joi.number(), Joi.string()).allow(null, '').optional(),

  // Pregnancy information (optional)
  hpht: Joi.string().allow('').optional(),
  hpl: Joi.string().allow('').optional(),
  jam_hpl: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).allow('').optional(),
  jam_hpl_selesai: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).allow('').optional(),

  // Examination findings (required)
  hasil_pemeriksaan: Joi.string().allow('').optional(),

  // Additional information (optional)
  tindakan: Joi.string().allow('').optional(),
  keterangan: Joi.string().allow('').optional()
}).unknown(true);

module.exports = {
  RegistrasiANCSchema
};