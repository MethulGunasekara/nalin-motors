const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createServiceCard,
  getServiceCardById,
  getServiceCards,
  updateServiceCard,
  updateServiceCardStatus,
  updateChecklistItem,
  getOngoingServiceCards,
} = require('../controllers/serviceCardController');

// "ongoing" must come before "/:id" or Express treats it as an id param
router.get('/ongoing', protect, getOngoingServiceCards);
router.get('/', protect, getServiceCards);
router.get('/:id', protect, getServiceCardById);
router.post('/', protect, createServiceCard);
router.patch('/:id', protect, updateServiceCard);
router.patch('/:id/status', protect, updateServiceCardStatus);
router.patch('/:id/checklist', protect, updateChecklistItem);

module.exports = router;