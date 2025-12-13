const Joi = require('joi');
const { VALID_LAYANAN } = require('../utils/constant');

const JadwalSchema = Joi.object({
    id_pasien: Joi.string().uuid().required().messages({'string.guid': 'ID Pasien harus berformat UUID.'}),
    id_petugas: Joi.string().uuid().required().messages({'string.guid': 'ID Petugas harus berformat UUID.'}),
    jenis_layanan: Joi.string().valid(...VALID_LAYANAN).required(),
    tanggal: Joi.string().isoDate().required().description('Format: YYYY-MM-DD'),
    jam_mulai: Joi.string().required().description('Format: HH:MM:SS'),
    jam_selesai: Joi.string().optional().description('Format: HH:MM:SS'),
});

module.exports = {
    JadwalSchema
};