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

// Public endpoint untuk auto-linking (no auth required)
router.get('/ibu/:nik', imunisasiController.getDataIbuByNIK);

// All other routes require authentication
router.use(verifyToken);

// Immunization endpoints
router.get('/', imunisasiController.getAllImunisasi);
router.post('/', validate(RegistrasiImunisasiSchema), imunisasiController.createRegistrasiImunisasi);

// Trash/Recovery Routes (must be before :id)
router.get('/deleted', imunisasiController.getDeletedImunisasi);
router.put('/restore/:id', imunisasiController.restore);
router.delete('/permanent/:id', imunisasiController.deletePermanent);

router.get('/:id', imunisasiController.getImunisasiById);
router.put('/:id', validate(RegistrasiImunisasiSchema), imunisasiController.updateRegistrasiImunisasi);
router.delete('/:id', imunisasiController.deleteRegistrasiImunisasi);

module.exports = router;