const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createServiceCard,
  getServiceCardById,
  getServiceCards,
  updateServiceCard,
  updateServiceCardStatus,
} = require('../controllers/serviceCardController');

router.get('/', protect, getServiceCards);
router.get('/:id', protect, getServiceCardById);
router.post('/', protect, createServiceCard);
router.patch('/:id', protect, updateServiceCard);
router.patch('/:id/status', protect, updateServiceCardStatus);

module.exports = router;