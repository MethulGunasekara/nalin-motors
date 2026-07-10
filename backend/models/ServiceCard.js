const mongoose = require('mongoose');

const serviceCardSchema = new mongoose.Schema(
  {
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    vehicleNumber: { type: String, required: true, trim: true, uppercase: true },
    brand: { type: String, trim: true },
    model: { type: String, trim: true },
    customerMobile: { type: String, required: true, trim: true },
    inspectingOfficer: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    mechanic: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    checklist: [
      {
        catalogItem: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceCatalogItem' },
        completedByMechanic: { type: Boolean, default: false },
      },
    ],
    customServices: [
      {
        name: { type: String, trim: true },
        completedByMechanic: { type: Boolean, default: false },
      }
    ],
    notes: { type: String, trim: true },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceCard', serviceCardSchema);