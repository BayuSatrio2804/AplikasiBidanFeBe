// src/routes/anc.routes.js
const express = require('express');
const router = express.Router();
const ancController = require('../controllers/anc.controller');
const { verifyToken } = require('../middleware/auth'); 
const validator = require('../middleware/validator.middleware');
const { RegistrasiANCSchema } = require('../validators/anc.validator');

router.use(verifyToken); 

router.post('/', validator(RegistrasiANCSchema), ancController.createRegistrasiANC); // Transaksi ANC

module.exports = router;