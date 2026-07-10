const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getEmployees, createEmployee, updateEmployee } = require('../controllers/employeeController');

router.get('/', protect, getEmployees);
router.post('/', protect, authorize('owner'), createEmployee);
router.patch('/:id', protect, authorize('owner'), updateEmployee);

module.exports = router;