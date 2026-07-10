const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ['cashier', 'mechanic', 'owner'], required: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true }, // for staff login
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);