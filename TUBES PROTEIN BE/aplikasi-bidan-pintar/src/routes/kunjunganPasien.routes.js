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
router.get('/:id', kunjunganPasienController.getKunjunganPasienById);
router.post('/', validate(RegistrasiKunjunganPasienSchema), kunjunganPasienController.createRegistrasiKunjunganPasien);
router.put('/:id', validate(RegistrasiKunjunganPasienSchema), kunjunganPasienController.updateKunjunganPasien);
router.delete('/:id', kunjunganPasienController.deleteKunjunganPasien);

module.exports = router;