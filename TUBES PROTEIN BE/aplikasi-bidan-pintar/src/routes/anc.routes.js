/**
 * ANC (Antenatal Care) Routes
 * Protected routes for ANC service management
 */

const express = require('express');
const router = express.Router();
const ancController = require('../controllers/anc.controller');
const { verifyToken } = require('../middleware/auth');
const validate = require('../middleware/validator.middleware');
const { RegistrasiANCSchema } = require('../validators/anc.validator');

// All routes require authentication
router.use(verifyToken);

// ANC endpoints
router.post('/', validate(RegistrasiANCSchema), ancController.createRegistrasiANC);

module.exports = router;