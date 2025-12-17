const Joi = require('joi');
const { VALID_LAYANAN } = require('../utils/constant');

const JadwalSchema = Joi.object({
    id_pasien: Joi.string().uuid().required().messages({'string.guid': 'ID Pasien harus berformat UUID.'}),
    id_petugas: Joi.string().uuid().optional().messages({'string.guid': 'ID Petugas harus berformat UUID.'}),
    jenis_layanan: Joi.string().valid(...VALID_LAYANAN).required().messages({'any.only': `Jenis layanan harus: ${VALID_LAYANAN.join(', ')}.`}),
    tanggal: Joi.string().isoDate().required().messages({'string.isoDate': 'Tanggal format YYYY-MM-DD'}),
    jam_mulai: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required().messages({'string.pattern.base': 'Jam mulai format HH:MM'}),
    jam_selesai: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(null, '').optional().messages({'string.pattern.base': 'Jam selesai format HH:MM'})
}).unknown(false);

module.exports = {
    JadwalSchema
};