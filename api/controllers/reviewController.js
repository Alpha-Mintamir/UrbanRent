const Review = require('../models/Review');
const User = require('../models/User');

// Add a new review
exports.createReview = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { rating, comment } = req.body;
    const user_id = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Invalid rating (1-5 required)' });
    }

    const review = await Review.create({
      property_id: propertyId,
      user_id,
      rating,
      comment,
    });
    res.status(201).json({ message: 'Review added', review });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add review', error: error.message });
  }
};

// Get all reviews for a property (with user info)
exports.getReviewsByProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const reviews = await Review.findAll({
      where: { property_id: propertyId },
      include: [{ model: User, attributes: ['user_id', 'name', 'email'] }],
      order: [['created_at', 'DESC']]
    });
    console.log('Found reviews:', reviews);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
  }
};

// Get average rating for a property
exports.getAverageRating = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const result = await Review.findAll({
      where: { property_id: propertyId },
      attributes: [[Review.sequelize.fn('AVG', Review.sequelize.col('rating')), 'avgRating']]
    });
    res.json({ avgRating: Number(result[0]?.dataValues.avgRating || 0).toFixed(2) });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch average rating', error: error.message });
  }
};
