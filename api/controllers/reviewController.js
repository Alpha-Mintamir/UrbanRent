const Review = require('../models/Review');
const User = require('../models/User');

// Get all reviews for a property
exports.getReviewsByProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const reviews = await Review.findAll({
      where: { property_id: propertyId },
      include: [{
        model: User,
        as: 'User',
        attributes: ['name', 'email']
      }],
      order: [['created_at', 'DESC']]
    });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};

// Get average rating for a property
exports.getAverageRating = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const result = await Review.findOne({
      where: { property_id: propertyId },
      attributes: [
        [Review.sequelize.fn('AVG', Review.sequelize.col('rating')), 'avgRating'],
        [Review.sequelize.fn('COUNT', Review.sequelize.col('review_id')), 'totalReviews']
      ]
    });

    res.json({
      avgRating: Number(result?.dataValues.avgRating || 0).toFixed(1),
      totalReviews: Number(result?.dataValues.totalReviews || 0)
    });
  } catch (error) {
    console.error('Error calculating average rating:', error);
    res.status(500).json({ message: 'Failed to calculate average rating' });
  }
};

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;
    
    console.log('User attempting to create review:', req.user);
    
    // Check if user is a tenant (role === 1)
    if (req.user.role !== 1) {
      return res.status(403).json({ message: 'Only tenants can submit property reviews' });
    }

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if user has already reviewed this property
    const existingReview = await Review.findOne({
      where: {
        property_id: propertyId,
        user_id: userId
      }
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this property' });
    }

    // Create the review
    const review = await Review.create({
      property_id: propertyId,
      user_id: userId,
      rating,
      comment: comment || null // Make comment optional
    });

    // Fetch the created review with user details
    const reviewWithUser = await Review.findOne({
      where: { review_id: review.review_id },
      include: [{
        model: User,
        as: 'User',
        attributes: ['name', 'email']
      }]
    });

    res.status(201).json(reviewWithUser);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Failed to create review' });
  }
};
