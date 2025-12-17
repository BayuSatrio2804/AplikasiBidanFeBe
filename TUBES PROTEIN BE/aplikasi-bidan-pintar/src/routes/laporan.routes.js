/**
 * Report Routes
 * Protected routes for report generation and management
 */

const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporan.controller');
const { verifyToken } = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

// Report endpoints
router.get('/list', laporanController.getLaporanList);         // Get list of laporan summaries
router.get('/export', laporanController.generateLaporanBulanan); // Generate Excel (query params)
router.get('/:id', laporanController.getLaporanById);           // Get single laporan by ID
router.post('/', laporanController.createLaporan);              // Create new laporan
router.put('/:id', laporanController.updateLaporan);            // Update laporan
router.delete('/:id', laporanController.deleteLaporan);         // Delete laporan

// Legacy support - keep GET / for Excel generation
router.get('/', laporanController.generateLaporanBulanan);

module.exports = router;