const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { isLoggedIn } = require('../middleware/authMiddleware');

// Test route to check authentication
router.get('/auth-test', isLoggedIn, (req, res) => {
  res.json({ 
    success: true, 
    message: 'Authentication successful',
    user: req.user
  });
});

// Get all reviews for a property
router.get('/properties/:propertyId/reviews', reviewController.getReviewsByProperty);

// Get average rating for a property
router.get('/properties/:propertyId/average-rating', reviewController.getAverageRating);

// Create a new review for a property (requires authentication)
router.post('/properties/:propertyId/reviews', isLoggedIn, reviewController.createReview);

module.exports = router;
