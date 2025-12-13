// src/routes/pasien.routes.js
const express = require('express');
const router = express.Router();
const pasienController = require('../controllers/pasien.controller');
const { verifyToken } = require('../middleware/auth');
const validator = require('../middleware/validator.middleware');
const { PasienSchema } = require('../validators/pasien.validator');

router.use(verifyToken); // Lindungi semua route pasien

router.get('/', pasienController.getAllPasien); // List & Cari Pasien (FR-04)
router.post('/', validator(PasienSchema), pasienController.createPasien); // Tambah Pasien (FR-02)
router.get('/:id', pasienController.getPasienById);
router.put('/:id', validator(PasienSchema), pasienController.updatePasien); // Update Pasien (FR-02)
router.delete('/:id', pasienController.deletePasien); // Hapus Pasien (FR-02)
router.get('/:id/riwayat', pasienController.getRiwayatPasien); // Riwayat Pemeriksaan (FR-08)

module.exports = router;