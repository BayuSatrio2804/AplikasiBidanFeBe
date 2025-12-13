const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporan.controller');
const { verifyToken } = require('../middleware/auth'); 

router.use(verifyToken); 

router.get('/', laporanController.generateLaporanBulanan); // FR-05

module.exports = router;