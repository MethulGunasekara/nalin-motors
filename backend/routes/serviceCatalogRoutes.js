const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getCatalogItems,
  createCatalogItem,
  updateCatalogItem,
} = require('../controllers/serviceCatalogController');

router.get('/', protect, getCatalogItems);
router.post('/', protect, authorize('owner'), createCatalogItem);
router.patch('/:id', protect, authorize('owner'), updateCatalogItem);

module.exports = router;