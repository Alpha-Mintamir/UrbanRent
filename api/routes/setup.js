// setup.js - Routes for initial setup tasks
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Route to create admin user
router.get('/create-admin', async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findByEmail('admin@123');
    
    if (existingAdmin) {
      return res.status(200).json({
        success: true,
        message: 'Admin user already exists',
        user: {
          id: existingAdmin.user_id,
          email: existingAdmin.email,
          role: existingAdmin.role
        }
      });
    }
    
    // Create admin user with role 4
    const adminUser = await User.register({
      name: 'Admin',
      email: 'admin@123',
      password: 'admin@123',
      role: 4 // Admin role
    });
    
    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        id: adminUser.user_id,
        email: adminUser.email,
        role: adminUser.role
      }
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating admin user',
      error: error.message
    });
  }
});

module.exports = router;
