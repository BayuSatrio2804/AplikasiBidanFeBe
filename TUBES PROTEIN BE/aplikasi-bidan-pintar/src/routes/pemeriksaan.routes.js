/**
 * Examination Routes
 * Protected routes for medical examination (SOAP) management
 */

const express = require('express');
const router = express.Router();
const pemeriksaanController = require('../controllers/pemeriksaan.controller');
const { verifyToken } = require('../middleware/auth');
const validate = require('../middleware/validator.middleware');
const { PemeriksaanSchema } = require('../validators/pemeriksaan.validator');

// All routes require authentication
router.use(verifyToken);

// Examination CRUD operations
router.get('/', pemeriksaanController.getAllPemeriksaan);
router.get('/:id', pemeriksaanController.getDetailPemeriksaan);
router.post('/', validate(PemeriksaanSchema), pemeriksaanController.createPemeriksaan);
router.put('/:id', validate(PemeriksaanSchema), pemeriksaanController.updatePemeriksaan);

module.exports = router;