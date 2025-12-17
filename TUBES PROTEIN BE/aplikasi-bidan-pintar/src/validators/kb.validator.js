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
  
  // Mother data (Data Ibu) - required name, rest are flexible
  nama_ibu: Joi.string().min(1).required(),
  nik_ibu: Joi.alternatives().try(
    Joi.string().allow(''),
    Joi.number()
  ).optional(),
  umur_ibu: Joi.alternatives().try(
    Joi.number(),
    Joi.string().allow(''),
    Joi.number().allow(null)
  ).optional(),
  td_ibu: Joi.string().allow('').optional(),
  bb_ibu: Joi.string().allow('').optional(),
  
  // Father/Spouse data (Data Ayah) - required name, rest are flexible
  nama_ayah: Joi.string().min(1).required(),
  nik_ayah: Joi.alternatives().try(
    Joi.string().allow(''),
    Joi.number()
  ).optional(),
  umur_ayah: Joi.alternatives().try(
    Joi.number(),
    Joi.string().allow(''),
    Joi.number().allow(null)
  ).optional(),
  td_ayah: Joi.string().allow('').optional(),
  bb_ayah: Joi.string().allow('').optional(),
  
  // Address and contact
  alamat: Joi.string().min(1).required(),
  nomor_hp: Joi.string().allow('').optional(),
  
  // Follow-up
  kunjungan_ulang: Joi.string().allow('').optional(),
  catatan: Joi.string().allow('').optional()
}).unknown(true);

module.exports = {
  RegistrasiKBSchema
};