/**
 * KB (Family Planning) Validator
 * Validates data exactly as sent from frontend LayananKB component
 */
const Joi = require('joi');

const RegistrasiKBSchema = Joi.object({
  // Service identification
  jenis_layanan: Joi.string().valid('KB').required(),
  tanggal: Joi.string().required(),

  // Registration info
  nomor_registrasi_lama: Joi.string().allow('').optional(),
  nomor_registrasi_baru: Joi.string().allow('').optional(),

  // Method (required)
  metode: Joi.string().required(),

  // Mother data (Data Ibu) - required fields match form
  nama_ibu: Joi.string().min(1).required(),
  nik_ibu: Joi.string().length(16).pattern(/^[0-9]+$/).required(),
  umur_ibu: Joi.alternatives().try(
    Joi.number(),
    Joi.string().allow(''),
    Joi.number().allow(null)
  ).optional(),
  td_ibu: Joi.string().allow('').optional(),
  bb_ibu: Joi.alternatives().try(Joi.string(), Joi.number()).allow('').optional(),

  // Father/Spouse data (Data Ayah) - required fields match form
  nama_ayah: Joi.string().min(1).required(),
  nik_ayah: Joi.string().allow('').optional(), // optional at DB level
  umur_ayah: Joi.alternatives().try(
    Joi.number(),
    Joi.string().allow(''),
    Joi.number().allow(null)
  ).optional(),
  td_ayah: Joi.string().allow('').optional(),
  bb_ayah: Joi.alternatives().try(Joi.string(), Joi.number()).allow('').optional(),

  // Address and contact
  alamat: Joi.string().min(1).required(),
  nomor_hp: Joi.string().allow('').optional(),

  // Follow-up
  kunjungan_ulang: Joi.string().allow('').optional(),
  jam_kunjungan_ulang: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).allow('').optional(),
  jam_kunjungan_ulang_selesai: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).allow('').optional(),
  catatan: Joi.string().allow('').optional()
}).unknown(true);

module.exports = {
  RegistrasiKBSchema
};