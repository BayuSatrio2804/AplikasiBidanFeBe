// src/routes/imunisasi.routes.js
const express = require('express');
const router = express.Router();
const imunisasiController = require('../controllers/imunisasi.controller');
const { verifyToken } = require('../middleware/auth'); 
const validator = require('../middleware/validator.middleware');
const { RegistrasiImunisasiSchema } = require('../validators/imunisasi.validator');

router.use(verifyToken); 

router.post('/', validator(RegistrasiImunisasiSchema), imunisasiController.createRegistrasiImunisasi); // Transaksi Imunisasi

module.exports = router;