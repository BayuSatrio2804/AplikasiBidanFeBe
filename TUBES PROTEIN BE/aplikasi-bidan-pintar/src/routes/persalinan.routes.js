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
router.get('/', persalinanController.getAllPersalinan);
router.post('/', validate(RegistrasiPersalinanSchema), persalinanController.createRegistrasiPersalinan);
router.get('/:id', persalinanController.getPersalinanById);
router.put('/:id', validate(RegistrasiPersalinanSchema), persalinanController.updateRegistrasiPersalinan);
router.delete('/:id', persalinanController.deleteRegistrasiPersalinan);

module.exports = router;