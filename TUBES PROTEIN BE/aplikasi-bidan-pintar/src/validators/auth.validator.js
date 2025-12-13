const Joi = require('joi');

// =========================================================
// SKEMA OTENTIKASI UTAMA
// =========================================================
const RegisterSchema = Joi.object({
    nama_lengkap: Joi.string().required().messages({
        'any.required': 'Nama lengkap wajib diisi.'
    }),
    username: Joi.string().min(3).required().messages({
        'any.required': 'Username wajib diisi.',
        'string.min': 'Username minimal 3 karakter.'
    }),
    email: Joi.string().email().required().messages({
        'any.required': 'Email wajib diisi.',
        'string.email': 'Format email tidak valid.'
    }),
    password: Joi.string().min(6).required().messages({
        'any.required': 'Password wajib diisi.',
        'string.min': 'Password minimal 6 karakter.'
    }),
});

const LoginSchema = Joi.object({
    usernameOrEmail: Joi.string().required().description('Bisa berupa username atau email').messages({
        'any.required': 'Username atau Email wajib diisi.'
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password wajib diisi.'
    }),
});

const UpdateProfileSchema = Joi.object({
    // Semua optional karena tujuannya hanya memperbarui sebagian data
    nama_lengkap: Joi.string().optional(),
    username: Joi.string().min(3).optional().messages({
        'string.min': 'Username minimal 3 karakter.'
    }),
    email: Joi.string().email().optional().messages({
        'string.email': 'Format email tidak valid.'
    }),
    password: Joi.string().min(6).optional().messages({ 
        'string.min': 'Password minimal 6 karakter.'
    }), 
});

// =========================================================
// SKEMA OTP
// =========================================================
const OTPVerificationSchema = Joi.object({
    usernameOrEmail: Joi.string().required().messages({
        'any.required': 'Username atau Email wajib diisi.'
    }),
    otp_code: Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({
        'any.required': 'Kode OTP wajib diisi.',
        'string.length': 'Kode OTP harus 6 digit.',
        'string.pattern.base': 'Kode OTP harus berupa angka.'
    }),
});

// =========================================================
// SKEMA LUPA PASSWORD
// =========================================================
const ForgotPasswordRequestSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email harus format email yang valid.',
        'any.required': 'Email wajib diisi.'
    }),
});

const ForgotPasswordVerifySchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email harus format email yang valid.',
        'any.required': 'Email wajib diisi.'
    }),
    otp_code: Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({
        'string.length': 'Kode OTP harus 6 digit.',
        'string.pattern.base': 'Kode OTP harus berupa angka.',
        'any.required': 'Kode OTP wajib diisi.'
    }),
});

const ForgotPasswordResetSchema = Joi.object({
    id_user: Joi.string().guid({ version: 'uuidv4' }).required().messages({
        'string.guid': 'ID User harus format UUID yang valid (v4).',
        'any.required': 'ID User wajib diisi.'
    }),
    new_password: Joi.string().min(6).required().messages({
        'string.min': 'Password minimal harus 6 karakter.',
        'any.required': 'Password baru wajib diisi.'
    }),
    // Opsi: reset_token: Joi.string().optional() jika dikirim via body
});

module.exports = {
    RegisterSchema,
    LoginSchema,
    UpdateProfileSchema,
    OTPVerificationSchema, 
    ForgotPasswordRequestSchema,
    ForgotPasswordVerifySchema,
    ForgotPasswordResetSchema,
};