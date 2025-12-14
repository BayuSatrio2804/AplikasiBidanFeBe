/**
 * Report Routes
 * Protected routes for report generation
 */

const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporan.controller');
const { verifyToken } = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

// Report endpoints
router.get('/', laporanController.generateLaporanBulanan);

module.exports = router;