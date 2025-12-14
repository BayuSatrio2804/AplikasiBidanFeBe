/**
 * Persalinan (Delivery/Birth) Routes
 * Protected routes for delivery service management
 */

const express = require('express');
const router = express.Router();
const persalinanController = require('../controllers/persalinan.controller');
const { verifyToken } = require('../middleware/auth');
const validate = require('../middleware/validator.middleware');
const { RegistrasiPersalinanSchema } = require('../validators/persalinan.validator');

// All routes require authentication
router.use(verifyToken);

// Delivery endpoints
router.post('/', validate(RegistrasiPersalinanSchema), persalinanController.createRegistrasiPersalinan);

module.exports = router;