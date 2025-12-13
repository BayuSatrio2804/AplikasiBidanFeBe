// src/routes/pemeriksaan.routes.js
const express = require('express');
const router = express.Router();
const pemeriksaanController = require('../controllers/pemeriksaan.controller');
const { verifyToken } = require('../middleware/auth'); 
const validator = require('../middleware/validator.middleware');
const { PemeriksaanSchema } = require('../validators/pemeriksaan.validator'); 

router.use(verifyToken); // Lindungi semua route pemeriksaan

router.get('/', pemeriksaanController.getAllPemeriksaan);
router.post('/', validator(PemeriksaanSchema), pemeriksaanController.createPemeriksaan); // Catat SOAP Standar (FR-03)
router.get('/:id', pemeriksaanController.getDetailPemeriksaan);
router.put('/:id', validator(PemeriksaanSchema), pemeriksaanController.updatePemeriksaan); // Update SOAP (FR-03)

module.exports = router;