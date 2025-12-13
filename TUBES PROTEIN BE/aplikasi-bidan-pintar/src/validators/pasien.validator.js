const Joi = require('joi');

const PasienSchema = Joi.object({
    nama: Joi.string().required(),
    NIK: Joi.string().length(16).pattern(/^[0-9]+$/).required().messages({
        'string.length': 'NIK harus 16 digit.',
        'string.pattern.base': 'NIK harus berupa angka.'
    }),
    umur: Joi.number().integer().min(1).required(),
    alamat: Joi.string().required(),
    no_hp: Joi.string().min(8).max(15).required(),
});

module.exports = {
    PasienSchema
};