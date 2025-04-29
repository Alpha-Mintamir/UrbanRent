// createAdmin.js - Script to create an admin user
require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findByEmail('admin@123');
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }
    
    // Create admin user with role 4
    const adminUser = await User.register({
      name: 'Admin',
      email: 'admin@123',
      password: 'admin@123',
      role: 4 // Admin role
    });
    
    console.log('Admin user created successfully:', adminUser.email);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit();
  }
}

// Run the function
createAdminUser();
