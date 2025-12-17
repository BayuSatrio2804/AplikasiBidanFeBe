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
router.get('/', imunisasiController.getAllImunisasi);
router.post('/', validate(RegistrasiImunisasiSchema), imunisasiController.createRegistrasiImunisasi);
router.get('/:id', imunisasiController.getImunisasiById);
router.put('/:id', validate(RegistrasiImunisasiSchema), imunisasiController.updateRegistrasiImunisasi);
router.delete('/:id', imunisasiController.deleteRegistrasiImunisasi);

module.exports = router;