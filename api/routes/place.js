const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares/user');

const {
  addPlace,
  getPlaces,
  updatePlace,
  singlePlace,
  singlePlaceById,
  userPlaces,
  searchPlaces
} = require('../controllers/placeController');

router.route('/').get(getPlaces);

// Protected routes (user must be logged in)
router.route('/add-places').post(isLoggedIn, addPlace);
router.route('/user-places').get(isLoggedIn, userPlaces);
router.route('/update-place').put(isLoggedIn, updatePlace);

// Not Protected routes - ORDER MATTERS HERE!
// More specific routes must come before generic ones
router.route('/search/:key').get(searchPlaces);
router.route('/single-place/:id').get(singlePlaceById); // Specific endpoint for property edit page

// This generic route must come last as it will match any /:id pattern
router.route('/:id').get(singlePlace);


module.exports = router;
