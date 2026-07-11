const ServiceCard = require('../models/ServiceCard');
const Appointment = require('../models/Appointment');
const ServiceCatalogItem = require('../models/ServiceCatalogItem');

// POST /api/service-cards
const createServiceCard = async (req, res) => {
  try {
    const {
      appointmentId,
      brand,
      model,
      inspectingOfficer,
      mechanic,
      selectedCatalogItemIds, // only the IDs the cashier ticked as applicable
      customServices,         // array of strings
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

    // Only save the catalog items the cashier selected as applicable.
    // completedByMechanic starts false on all of them — the mechanic ticks them off later.
    const selectedIds = (selectedCatalogItemIds || []).map(String);
    const selectedItems = await ServiceCatalogItem.find({
      _id: { $in: selectedIds },
      active: true,
    });

    const checklist = selectedItems.map((item) => ({
      catalogItem: item._id,
      completedByMechanic: false,
    }));

    // Custom services also start unchecked
    const customList = (customServices || []).map((name) => ({
      name,
      completedByMechanic: false,
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
      customServices: customList,
      notes,
    });

    const populated = await serviceCard.populate([
      { path: 'inspectingOfficer', select: 'name role' },
      { path: 'mechanic', select: 'name role' },
      { path: 'checklist.catalogItem', select: 'serviceNameEn serviceNameSi' },
    ]);

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

// GET /api/service-cards
const getServiceCards = async (req, res) => {
  try {
    const filter = {};
    if (req.query.mechanic) filter.mechanic = req.query.mechanic;
    if (req.query.status) filter.status = req.query.status;

    const serviceCards = await ServiceCard.find(filter)
      .populate('inspectingOfficer', 'name role')
      .populate('mechanic', 'name role')
      .populate('appointment', 'serviceDate startTime')
      .sort({ createdAt: -1 });

    res.json(serviceCards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/service-cards/:id
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
    if (notes !== undefined) serviceCard.notes = notes;

    if (selectedCatalogItemIds !== undefined) {
      const selectedItems = await ServiceCatalogItem.find({
        _id: { $in: selectedCatalogItemIds },
        active: true,
      });
      serviceCard.checklist = selectedItems.map((item) => ({
        catalogItem: item._id,
        completedByMechanic: false,
      }));
    }

    if (customServices !== undefined) {
      serviceCard.customServices = customServices.map((name) => ({
        name,
        completedByMechanic: false,
      }));
    }

    await serviceCard.save();
    res.json(serviceCard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/service-cards/:id/status
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

    if (status === 'Completed') {
      await Appointment.findByIdAndUpdate(serviceCard.appointment, { status: 'Completed' });
    }

    res.json(serviceCard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/service-cards/:id/checklist
// Only the assigned mechanic should call this.
// Body: { checklistIndex: 0, completed: true }  for catalog items
//       { customIndex: 1,   completed: true }    for custom services
const updateChecklistItem = async (req, res) => {
  try {
    const { checklistIndex, customIndex, completed } = req.body;
    const serviceCard = await ServiceCard.findById(req.params.id);
    if (!serviceCard) return res.status(404).json({ message: 'Service card not found' });

    if (serviceCard.status === 'Completed') {
      return res.status(400).json({ message: 'Card is already completed' });
    }

    if (checklistIndex !== undefined) {
      if (!serviceCard.checklist[checklistIndex]) {
        return res.status(400).json({ message: 'Invalid checklist index' });
      }
      serviceCard.checklist[checklistIndex].completedByMechanic = Boolean(completed);
    }

    if (customIndex !== undefined) {
      if (!serviceCard.customServices[customIndex]) {
        return res.status(400).json({ message: 'Invalid custom service index' });
      }
      serviceCard.customServices[customIndex].completedByMechanic = Boolean(completed);
    }

    serviceCard.markModified('checklist');
    serviceCard.markModified('customServices');
    await serviceCard.save();
    res.json(serviceCard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// GET /api/service-cards/ongoing
// Returns all service cards that are not Completed,
// whose appointment date is strictly before today.
const getOngoingServiceCards = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const cards = await ServiceCard.find({
      status: { $ne: 'Completed' },
    })
      .populate('inspectingOfficer', 'name role')
      .populate('mechanic', 'name role')
      .populate('checklist.catalogItem', 'serviceNameEn serviceNameSi')
      .populate({
        path: 'appointment',
        match: { serviceDate: { $lt: startOfToday } },
        select: 'serviceDate startTime status',
      })
      .sort({ createdAt: -1 });

    // populate with match doesn't filter out docs — it nulls the field instead.
    // Filter to only those whose appointment actually matched (i.e. is before today).
    const filtered = cards.filter((c) => c.appointment !== null);

    res.json(filtered);
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
  updateChecklistItem,
  getOngoingServiceCards,
};