// src/validators/pemeriksaan.validator.js

const Joi = require('joi');
// ⚠️ PERBAIKAN: Import VALID_LAYANAN dari constant.js
const { VALID_LAYANAN } = require('../utils/constant'); 

// -----------------------------------------------------------------
// SKEMA UMUM PEMERIKSAAN (SOAP)
// Digunakan oleh endpoint pemeriksaan POST dan PUT
// -----------------------------------------------------------------
const PemeriksaanSchema = Joi.object({
    id_pasien: Joi.string().uuid().required().messages({
        'any.required': 'ID Pasien wajib diisi.',
        'string.uuid': 'ID Pasien harus dalam format UUID.'
    }),
    
    // Validasi jenis_layanan menggunakan array dari constant.js
    jenis_layanan: Joi.string().valid(...VALID_LAYANAN).required().messages({
        'any.required': 'Jenis layanan wajib diisi.',
        'any.only': `Jenis layanan tidak valid. Harus salah satu dari: ${VALID_LAYANAN.join(', ')}.`,
    }),

    // Data SOAP
    subjektif: Joi.string().required().messages({
        'any.required': 'Kolom Subjektif (S) wajib diisi.'
    }),
    objektif: Joi.string().required().messages({
        'any.required': 'Kolom Objektif (O) wajib diisi.'
    }),
    analisa: Joi.string().required().messages({
        'any.required': 'Kolom Analisa (A) wajib diisi.'
    }),
    tatalaksana: Joi.string().required().messages({
        'any.required': 'Kolom Tatalaksana (P) wajib diisi.'
    }),

    // Optional: Jika ingin mengizinkan input manual tanggal pemeriksaan
    tanggal_pemeriksaan: Joi.date().iso().optional(),
});

// Skema untuk update, hanya memperbolehkan update pada kolom SOAP dan tanggal_pemeriksaan
const UpdatePemeriksaanSchema = Joi.object({
    subjektif: Joi.string().optional(),
    objektif: Joi.string().optional(),
    analisa: Joi.string().optional(),
    tatalaksana: Joi.string().optional(),
    tanggal_pemeriksaan: Joi.date().iso().optional(),
});


module.exports = {
    PemeriksaanSchema,
    UpdatePemeriksaanSchema,
    // Ekspor VALID_LAYANAN juga jika diperlukan di tempat lain (opsional)
    VALID_LAYANAN, 
};