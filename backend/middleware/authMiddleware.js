const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.employee = await Employee.findById(decoded.id).select('-passwordHash');
      if (!req.employee || !req.employee.active) {
        return res.status(401).json({ message: 'Not authorized, account inactive' });
      }
      return next();
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token' });
};

// Usage: authorize('owner') or authorize('owner', 'cashier')
const authorize = (...roles) => (req, res, next) => {
  if (!req.employee || !roles.includes(req.employee.role)) {
    return res.status(403).json({ message: 'Forbidden: insufficient role' });
  }
  next();
};

module.exports = { protect, authorize };