// src/routes/kunjunganPasien.routes.js
const express = require('express');
const router = express.Router();
const kunjunganPasienController = require('../controllers/kunjunganPasien.controller');
const { verifyToken } = require('../middleware/auth'); 
const validator = require('../middleware/validator.middleware');
const { RegistrasiKunjunganPasienSchema } = require('../validators/kunjunganPasien.validator');

router.use(verifyToken); 

router.post('/', validator(RegistrasiKunjunganPasienSchema), kunjunganPasienController.createRegistrasiKunjunganPasien);

module.exports = router;