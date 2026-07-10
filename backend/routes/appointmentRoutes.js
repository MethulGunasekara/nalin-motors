const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createAppointment,
  getTodayAppointments,
  getUpcomingAppointments,
  getAppointmentById,
  updateAppointment,
  confirmArrival,
  cancelAppointment,
} = require('../controllers/appointmentController');

// NOTE: specific routes ("today", "upcoming") must come before "/:id"
// or Express will try to match them as an :id param instead.
router.get('/today', protect, getTodayAppointments);
router.get('/upcoming', protect, getUpcomingAppointments);
router.get('/:id', protect, getAppointmentById);
router.post('/', protect, createAppointment);
router.patch('/:id', protect, updateAppointment);
router.patch('/:id/confirm-arrival', protect, confirmArrival);
router.patch('/:id/cancel', protect, cancelAppointment);

module.exports = router;