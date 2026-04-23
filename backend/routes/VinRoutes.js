const express = require('express');
const router = express.Router();

const vinController = require('../controllers/VinController');
const authMiddleware = require('../middleware/AuthMiddleware');
const validationMiddleware = require('../middleware/ValidationMiddleware');

router.post('/decode', authMiddleware, validationMiddleware.validateDecodeVin, vinController.decodeVin);
router.get('/history', authMiddleware, vinController.getHistory);
router.delete('/history/:id', authMiddleware, validationMiddleware.validateDeleteHistoryEntry, vinController.deleteHistoryEntry);

module.exports = router;