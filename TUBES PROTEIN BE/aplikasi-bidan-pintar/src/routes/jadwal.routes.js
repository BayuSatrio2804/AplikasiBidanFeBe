const express = require('express');
const router = express.Router();
const jadwalController = require('../controllers/jadwal.controller');
const { verifyToken } = require('../middleware/auth'); 
const validator = require('../middleware/validator.middleware');
const { JadwalSchema } = require('../validators/jadwal.validator');

router.use(verifyToken); 

router.get('/', jadwalController.listJadwal);
router.post('/', validator(JadwalSchema), jadwalController.createJadwal);
router.get('/:id', jadwalController.getDetailJadwal);
router.put('/:id', validator(JadwalSchema), jadwalController.updateJadwal);
router.delete('/:id', jadwalController.deleteJadwal);

module.exports = router;