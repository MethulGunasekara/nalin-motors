const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    vehicleNumber: { type: String, required: true, trim: true, uppercase: true },
    customerMobile: { type: String, required: true, trim: true },
    serviceDate: { type: Date, required: true },
    startTime: { type: String, required: true }, // e.g. "09:30"
    status: {
      type: String,
      enum: ['Booked', 'Confirmed', 'Rescheduled', 'Cancelled', 'Completed'],
      default: 'Booked',
    },
    loggedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);