// src/routes/persalinan.routes.js
const express = require('express');
const router = express.Router();
const persalinanController = require('../controllers/persalinan.controller');
const { verifyToken } = require('../middleware/auth'); 
const validator = require('../middleware/validator.middleware');
const { RegistrasiPersalinanSchema } = require('../validators/persalinan.validator');

router.use(verifyToken); 

router.post('/', validator(RegistrasiPersalinanSchema), persalinanController.createRegistrasiPersalinan); // Transaksi Persalinan

module.exports = router;