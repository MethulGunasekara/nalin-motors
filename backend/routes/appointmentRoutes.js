const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  createAppointment,
  getAllAppointments,
  getTodayAppointments,
  getUpcomingAppointments,
  getAppointmentById,
  updateAppointment,
  confirmArrival,
  cancelAppointment,
} = require('../controllers/appointmentController');

// Specific routes must come before "/:id" or Express will treat them as an :id param.
router.get('/today', protect, getTodayAppointments);
router.get('/upcoming', protect, getUpcomingAppointments);
router.get('/', protect, authorize('owner'), getAllAppointments);
router.get('/:id', protect, getAppointmentById);
router.post('/', protect, createAppointment);
router.patch('/:id', protect, updateAppointment);
router.patch('/:id/confirm-arrival', protect, confirmArrival);
router.patch('/:id/cancel', protect, cancelAppointment);

module.exports = router;