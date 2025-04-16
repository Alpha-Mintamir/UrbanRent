const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { isLoggedIn } = require('../middlewares/user');

// Add a review (auth required)
router.post('/properties/:propertyId/reviews', isLoggedIn, reviewController.createReview);

// Get all reviews for a property
router.get('/properties/:propertyId/reviews', reviewController.getReviewsByProperty);

// Get average rating for a property
router.get('/properties/:propertyId/average-rating', reviewController.getAverageRating);

module.exports = router;
