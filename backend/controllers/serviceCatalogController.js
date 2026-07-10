const ServiceCatalogItem = require('../models/ServiceCatalogItem');

// GET /api/service-catalog
const getCatalogItems = async (req, res) => {
  try {
    const items = await ServiceCatalogItem.find({ active: true }).sort({ serviceNameEn: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/service-catalog  (owner only)
const createCatalogItem = async (req, res) => {
  try {
    const { serviceNameEn, serviceNameSi } = req.body;
    if (!serviceNameEn) {
      return res.status(400).json({ message: 'serviceNameEn is required' });
    }
    const item = await ServiceCatalogItem.create({ serviceNameEn, serviceNameSi });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/service-catalog/:id  (owner only)
const updateCatalogItem = async (req, res) => {
  try {
    const { serviceNameEn, serviceNameSi, active } = req.body;
    const item = await ServiceCatalogItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Catalog item not found' });

    if (serviceNameEn !== undefined) item.serviceNameEn = serviceNameEn;
    if (serviceNameSi !== undefined) item.serviceNameSi = serviceNameSi;
    if (active !== undefined) item.active = active;

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCatalogItems, createCatalogItem, updateCatalogItem };