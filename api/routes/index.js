const express = require('express');
const router = express.Router();

// Import route handlers
const userRoutes = require('./user');
const placeRoutes = require('./place');
const reviewRoutes = require('./reviewRoutes');
const locationRoutes = require('./location');
const messageRoutes = require('./messageRoutes');
<<<<<<< HEAD
const adminRoutes = require('./admin');
const setupRoutes = require('./setup');
=======
>>>>>>> message-fix

// User routes
router.use('/user', userRoutes);

// Place routes
router.use('/places', placeRoutes);

// Review routes
router.use('/reviews', reviewRoutes);

// Location routes
router.use('/locations', locationRoutes);

// Message routes
router.use('/messages', messageRoutes);

<<<<<<< HEAD
// Admin routes
router.use('/admin', adminRoutes);

// Setup routes - only available in non-production environments
if (process.env.NODE_ENV !== 'production') {
  router.use('/setup', setupRoutes);
}

=======
>>>>>>> message-fix
// Debug routes - only available in non-production environments
if (process.env.NODE_ENV !== 'production') {
  router.get('/debug/places', async (req, res) => {
    try {
      const Place = require('../models/Place');
      const places = await Place.findAll();
      res.json(places);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}

module.exports = router;
