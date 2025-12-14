/**
 * Schedule Routes
 * Protected routes for schedule management
 */

const express = require('express');
const router = express.Router();
const jadwalController = require('../controllers/jadwal.controller');
const { verifyToken } = require('../middleware/auth');
const validate = require('../middleware/validator.middleware');
const { JadwalSchema } = require('../validators/jadwal.validator');

// All routes require authentication
router.use(verifyToken);

// Schedule CRUD operations
router.get('/', jadwalController.listJadwal);
router.get('/:id', jadwalController.getDetailJadwal);
router.post('/', validate(JadwalSchema), jadwalController.createJadwal);
router.put('/:id', validate(JadwalSchema), jadwalController.updateJadwal);
router.delete('/:id', jadwalController.deleteJadwal);

module.exports = router;