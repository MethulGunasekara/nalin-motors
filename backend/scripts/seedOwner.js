require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const exists = await Employee.findOne({ phone: '0770000000' });
  if (exists) {
    console.log('Owner already exists.');
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash('changeThisPassword123', 10);
  await Employee.create({
    name: 'Nalin',
    role: 'owner',
    phone: '0770000000',
    passwordHash,
    active: true,
  });

  console.log('Owner account created: phone 0770000000 / password changeThisPassword123');
  process.exit(0);
};

seed();