/**
 * Kunjungan Pasien (Patient Visit) Routes
 * Protected routes for general patient visits
 */

const express = require('express');
const router = express.Router();
const kunjunganPasienController = require('../controllers/kunjunganPasien.controller');
const { verifyToken } = require('../middleware/auth');
const validate = require('../middleware/validator.middleware');
const { RegistrasiKunjunganPasienSchema } = require('../validators/kunjunganPasien.validator');

// All routes require authentication
router.use(verifyToken);

// Patient visit endpoints
router.get('/', kunjunganPasienController.getAllKunjunganPasien);
router.post('/', validate(RegistrasiKunjunganPasienSchema), kunjunganPasienController.createRegistrasiKunjunganPasien);

// Trash/Recovery Routes (must be before :id)
router.get('/deleted', kunjunganPasienController.getDeletedKunjunganPasien);
router.put('/restore/:id', kunjunganPasienController.restore);
router.delete('/permanent/:id', kunjunganPasienController.deletePermanent);

router.get('/:id', kunjunganPasienController.getKunjunganPasienById);
router.put('/:id', validate(RegistrasiKunjunganPasienSchema), kunjunganPasienController.updateKunjunganPasien);
router.delete('/:id', kunjunganPasienController.deleteKunjunganPasien);

module.exports = router;