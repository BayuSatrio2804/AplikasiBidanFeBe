// src/validators/imunisasi.validator.js
const Joi = require('joi');

const RegistrasiImunisasiSchema = Joi.object({
    jenis_layanan: Joi.any().optional(),
    tanggal: Joi.any().optional(),
    no_reg: Joi.any().optional(), 
    jenis_imunisasi: Joi.any().optional(),
    
    // Data Ibu (Master Pasien)
    nama_istri: Joi.any().optional(),
    nik_istri: Joi.any().optional(),
    umur_istri: Joi.any().optional(),
    alamat: Joi.any().optional(),
    
    // Data Ayah (Suami)
    nama_suami: Joi.any().optional(),
    nik_suami: Joi.any().optional(),
    umur_suami: Joi.any().optional(),
    
    // Data Bayi/Balita (Subjek Imunisasi)
    nama_bayi_balita: Joi.any().optional(),
    tanggal_lahir_bayi: Joi.any().optional(),
    tb_bayi: Joi.any().optional(),
    bb_bayi: Joi.any().optional(),
    
    // Informasi Tambahan
    jadwal_selanjutnya: Joi.any().optional(),
    no_hp: Joi.any().optional(),
    pengobatan: Joi.any().optional(), 
    
    // Field SOAP (optional - constructed by backend)
    subjektif: Joi.any().optional(),
    objektif: Joi.any().optional(),
    analisa: Joi.any().optional(),
    tatalaksana: Joi.any().optional(),
}).unknown(true).allow('');

module.exports = {
    RegistrasiImunisasiSchema
};