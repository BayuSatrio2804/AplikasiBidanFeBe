/**
 * Patient Routes
 * Protected routes for patient management
 */

const express = require('express');
const router = express.Router();
const pasienController = require('../controllers/pasien.controller');
const { verifyToken } = require('../middleware/auth');
const validate = require('../middleware/validator.middleware');
const { PasienSchema } = require('../validators/pasien.validator');

// All routes require authentication
router.use(verifyToken);

// Patient CRUD operations
router.get('/', pasienController.getAllPasien);
router.get('/:id', pasienController.getPasienById);
router.post('/', validate(PasienSchema), pasienController.createPasien);
router.put('/:id', validate(PasienSchema), pasienController.updatePasien);
router.delete('/:id', pasienController.deletePasien);

// Patient history
router.get('/:id/riwayat', pasienController.getRiwayatPasien);

module.exports = router;