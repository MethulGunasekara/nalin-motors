const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');

// GET /api/employees?role=cashier
const getEmployees = async (req, res) => {
  try {
    const filter = { active: true };
    if (req.query.role) filter.role = req.query.role;
    const employees = await Employee.find(filter).select('-passwordHash');
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/employees  (owner only)
const createEmployee = async (req, res) => {
  try {
    const { name, role, phone, password } = req.body;

    if (!name || !role || !phone || !password) {
      return res.status(400).json({ message: 'name, role, phone, password are required' });
    }

    const existing = await Employee.findOne({ phone });
    if (existing) {
      return res.status(409).json({ message: 'An employee with this phone already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const employee = await Employee.create({ name, role, phone, passwordHash });

    res.status(201).json({
      _id: employee._id,
      name: employee.name,
      role: employee.role,
      phone: employee.phone,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/employees/:id  (owner only)
const updateEmployee = async (req, res) => {
  try {
    const { name, role, phone, active, password } = req.body;
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    if (name !== undefined) employee.name = name;
    if (role !== undefined) employee.role = role;
    if (phone !== undefined) employee.phone = phone;
    if (active !== undefined) employee.active = active;
    if (password) employee.passwordHash = await bcrypt.hash(password, 10);

    await employee.save();
    res.json({
      _id: employee._id,
      name: employee.name,
      role: employee.role,
      phone: employee.phone,
      active: employee.active,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getEmployees, createEmployee, updateEmployee };