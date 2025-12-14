/**
 * KB (Family Planning) Routes
 * Protected routes for KB service management
 */

const express = require('express');
const router = express.Router();
const kbController = require('../controllers/kb.controller');
const { verifyToken } = require('../middleware/auth');
const validate = require('../middleware/validator.middleware');
const { RegistrasiKBSchema } = require('../validators/kb.validator');

// All routes require authentication
router.use(verifyToken);

// KB endpoints
router.post('/', validate(RegistrasiKBSchema), kbController.createRegistrasiKB);

module.exports = router;