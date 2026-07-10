const ServiceCard = require('../models/ServiceCard');
const Appointment = require('../models/Appointment');
const ServiceCatalogItem = require('../models/ServiceCatalogItem');

// POST /api/service-cards
// Creates a service card from a confirmed appointment.
const createServiceCard = async (req, res) => {
  try {
    const {
      appointmentId,
      brand,
      model,
      inspectingOfficer,
      mechanic,
      selectedCatalogItemIds, // array of ServiceCatalogItem _ids the cashier ticked
      customServices,         // array of free-text strings
      notes,
    } = req.body;

    if (!appointmentId || !inspectingOfficer || !mechanic) {
      return res.status(400).json({
        message: 'appointmentId, inspectingOfficer, mechanic are required',
      });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    if (appointment.status !== 'Confirmed') {
      return res.status(400).json({
        message: 'A service card can only be created for a Confirmed appointment',
      });
    }

    // Build the checklist against the full active catalog, marking selected ones.
    const catalogItems = await ServiceCatalogItem.find({ active: true });
    const selectedSet = new Set((selectedCatalogItemIds || []).map(String));
    const checklist = catalogItems.map((item) => ({
      catalogItem: item._id,
      selected: selectedSet.has(String(item._id)),
    }));

    const serviceCard = await ServiceCard.create({
      appointment: appointment._id,
      vehicleNumber: appointment.vehicleNumber,
      brand,
      model,
      customerMobile: appointment.customerMobile,
      inspectingOfficer,
      mechanic,
      checklist,
      customServices: customServices || [],
      notes,
    });

    const populated = await serviceCard
      .populate('inspectingOfficer', 'name role')
      .populate('mechanic', 'name role')
      .populate('checklist.catalogItem', 'serviceNameEn serviceNameSi');

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/service-cards/:id
const getServiceCardById = async (req, res) => {
  try {
    const serviceCard = await ServiceCard.findById(req.params.id)
      .populate('inspectingOfficer', 'name role')
      .populate('mechanic', 'name role')
      .populate('checklist.catalogItem', 'serviceNameEn serviceNameSi')
      .populate('appointment', 'vehicleNumber serviceDate startTime status');

    if (!serviceCard) return res.status(404).json({ message: 'Service card not found' });
    res.json(serviceCard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/service-cards?mechanic=<id>&status=Pending
const getServiceCards = async (req, res) => {
  try {
    const filter = {};
    if (req.query.mechanic) filter.mechanic = req.query.mechanic;
    if (req.query.status) filter.status = req.query.status;

    const serviceCards = await ServiceCard.find(filter)
      .populate('inspectingOfficer', 'name role')
      .populate('mechanic', 'name role')
      .sort({ createdAt: -1 });

    res.json(serviceCards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/service-cards/:id
// General edit — e.g. cashier adjusts checklist/custom services/notes before handoff.
const updateServiceCard = async (req, res) => {
  try {
    const { brand, model, selectedCatalogItemIds, customServices, notes } = req.body;
    const serviceCard = await ServiceCard.findById(req.params.id);
    if (!serviceCard) return res.status(404).json({ message: 'Service card not found' });

    if (serviceCard.status === 'Completed') {
      return res.status(400).json({ message: 'Cannot edit a completed service card' });
    }

    if (brand !== undefined) serviceCard.brand = brand;
    if (model !== undefined) serviceCard.model = model;
    if (customServices !== undefined) serviceCard.customServices = customServices;
    if (notes !== undefined) serviceCard.notes = notes;

    if (selectedCatalogItemIds !== undefined) {
      const selectedSet = new Set(selectedCatalogItemIds.map(String));
      serviceCard.checklist = serviceCard.checklist.map((entry) => ({
        catalogItem: entry.catalogItem,
        selected: selectedSet.has(String(entry.catalogItem)),
      }));
    }

    await serviceCard.save();
    res.json(serviceCard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/service-cards/:id/status
// Body: { "status": "In Progress" | "Completed" | "Pending" }
const updateServiceCardStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'In Progress', 'Completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `status must be one of ${validStatuses.join(', ')}` });
    }

    const serviceCard = await ServiceCard.findById(req.params.id);
    if (!serviceCard) return res.status(404).json({ message: 'Service card not found' });

    serviceCard.status = status;
    await serviceCard.save();

    // Keep the parent appointment in sync once work is fully done.
    if (status === 'Completed') {
      await Appointment.findByIdAndUpdate(serviceCard.appointment, { status: 'Completed' });
    }

    res.json(serviceCard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createServiceCard,
  getServiceCardById,
  getServiceCards,
  updateServiceCard,
  updateServiceCardStatus,
};