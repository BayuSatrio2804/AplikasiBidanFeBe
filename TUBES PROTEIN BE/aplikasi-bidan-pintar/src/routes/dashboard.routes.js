/**
 * Dashboard Routes
 * Protected routes for dashboard statistics
 */

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { verifyToken } = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

// Dashboard endpoints
router.get('/rekap-layanan', dashboardController.getRekapLayanan);

module.exports = router;