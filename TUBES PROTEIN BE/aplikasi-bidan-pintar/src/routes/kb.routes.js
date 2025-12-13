// src/routes/kb.routes.js
const express = require('express');
const router = express.Router();
const kbController = require('../controllers/kb.controller');
const { verifyToken } = require('../middleware/auth'); 
const validator = require('../middleware/validator.middleware');
const { RegistrasiKBSchema } = require('../validators/kb.validator');

router.use(verifyToken); 

router.post('/', validator(RegistrasiKBSchema), kbController.createRegistrasiKB); // Transaksi KB

module.exports = router;