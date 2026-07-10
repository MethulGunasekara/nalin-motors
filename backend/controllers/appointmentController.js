const Appointment = require('../models/Appointment');

// POST /api/appointments
const createAppointment = async (req, res) => {
  try {
    const { vehicleNumber, customerMobile, serviceDate, startTime } = req.body;

    if (!vehicleNumber || !customerMobile || !serviceDate || !startTime) {
      return res.status(400).json({
        message: 'vehicleNumber, customerMobile, serviceDate, startTime are required',
      });
    }

    const appointment = await Appointment.create({
      vehicleNumber,
      customerMobile,
      serviceDate,
      startTime,
      loggedBy: req.employee._id,
    });

    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/appointments/today
const getTodayAppointments = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      serviceDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: 'Cancelled' },
    })
      .populate('loggedBy', 'name role')
      .sort({ startTime: 1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/appointments/upcoming
const getUpcomingAppointments = async (req, res) => {
  try {
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      serviceDate: { $gt: endOfToday },
      status: { $ne: 'Cancelled' },
    })
      .populate('loggedBy', 'name role')
      .sort({ serviceDate: 1, startTime: 1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/appointments/:id
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate('loggedBy', 'name role');
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/appointments/:id  (generic edit — e.g. reschedule)
const updateAppointment = async (req, res) => {
  try {
    const { serviceDate, startTime, vehicleNumber, customerMobile } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (appointment.status === 'Cancelled') {
      return res.status(400).json({ message: 'Cannot edit a cancelled appointment' });
    }

    let rescheduled = false;
    if (serviceDate !== undefined && new Date(serviceDate).getTime() !== appointment.serviceDate.getTime()) {
      appointment.serviceDate = serviceDate;
      rescheduled = true;
    }
    if (startTime !== undefined && startTime !== appointment.startTime) {
      appointment.startTime = startTime;
      rescheduled = true;
    }
    if (vehicleNumber !== undefined) appointment.vehicleNumber = vehicleNumber;
    if (customerMobile !== undefined) appointment.customerMobile = customerMobile;

    if (rescheduled && appointment.status !== 'Confirmed') {
      appointment.status = 'Rescheduled';
    }

    await appointment.save();
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/appointments/:id/confirm-arrival
const confirmArrival = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (appointment.status === 'Cancelled') {
      return res.status(400).json({ message: 'Cannot confirm a cancelled appointment' });
    }

    appointment.status = 'Confirmed';
    await appointment.save();
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/appointments/:id/cancel
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    appointment.status = 'Cancelled';
    await appointment.save();
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createAppointment,
  getTodayAppointments,
  getUpcomingAppointments,
  getAppointmentById,
  updateAppointment,
  confirmArrival,
  cancelAppointment,
};