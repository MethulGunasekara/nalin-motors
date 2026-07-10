const mongoose = require('mongoose');

const serviceCatalogItemSchema = new mongoose.Schema(
  {
    serviceNameEn: { type: String, required: true, trim: true },
    serviceNameSi: { type: String, trim: true }, // Sinhala label
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceCatalogItem', serviceCatalogItemSchema);