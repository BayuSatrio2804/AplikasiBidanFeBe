/**
 * Audit Routes
 * Protected routes for audit log retrieval
 */

const express = require('express');
const router = express.Router();
const auditController = require('../controllers/audit.controller');
const { verifyToken } = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

// Audit log endpoints
router.get('/akses', auditController.getAccessLogs);
router.get('/data', auditController.getDataLogs);
router.get('/data-detailed', auditController.getDetailedDataLogs);

module.exports = router;
