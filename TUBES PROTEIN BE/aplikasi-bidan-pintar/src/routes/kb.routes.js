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
router.get('/', kbController.getAllKB);
router.post('/', validate(RegistrasiKBSchema), kbController.createRegistrasiKB);
router.get('/:id', kbController.getKBById);
router.put('/:id', validate(RegistrasiKBSchema), kbController.updateRegistrasiKB);
router.delete('/:id', kbController.deleteRegistrasiKB);

module.exports = router;