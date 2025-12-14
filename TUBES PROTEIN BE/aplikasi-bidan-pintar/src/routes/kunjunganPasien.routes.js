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
router.post('/', validate(RegistrasiKunjunganPasienSchema), kunjunganPasienController.createRegistrasiKunjunganPasien);

module.exports = router;