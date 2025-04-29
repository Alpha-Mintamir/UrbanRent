// admin.js - Admin routes
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isLoggedIn } = require('../middlewares/user');

// Admin login route
router.post('/login', adminController.adminLogin);

// Protected admin routes
router.get('/dashboard', isLoggedIn, adminController.isAdmin, adminController.getDashboardAnalytics);
router.post('/report', isLoggedIn, adminController.isAdmin, adminController.generateReport);

module.exports = router;
