/**
 * Imunisasi (Immunization) Routes
 * Protected routes for immunization service management
 */

const express = require('express');
const router = express.Router();
const imunisasiController = require('../controllers/imunisasi.controller');
const { verifyToken } = require('../middleware/auth');
const validate = require('../middleware/validator.middleware');
const { RegistrasiImunisasiSchema } = require('../validators/imunisasi.validator');

// All routes require authentication
router.use(verifyToken);

// Immunization endpoints
router.post('/', validate(RegistrasiImunisasiSchema), imunisasiController.createRegistrasiImunisasi);

module.exports = router;