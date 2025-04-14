const Place = require('../models/Place');

// Adds a place in the DB
exports.addPlace = async (req, res) => {
  try {
    // Get user data from the request or from the request body
    let user_id;
    
    // First check if user_id is provided in the request body (from client)
    if (req.body.user_id) {
      user_id = parseInt(req.body.user_id);
      console.log('Using user_id from request body:', user_id);
    } 
    // If not, try to get it from the authenticated user in the request
    else if (req.user && req.user.id) {
      user_id = parseInt(req.user.id);
      console.log('Using user_id from authenticated user:', user_id);
    } 
    // If still no user_id, return an error
    else {
      console.error('User ID missing from both request body and authentication');
      return res.status(401).json({
        message: 'User authentication failed. Please log in again.'
      });
    }
    
    // Check if the user exists in the users table
    const User = require('../models/User');
    
    // Verify the user exists
    const user = await User.findByPk(user_id);
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        error: 'The specified user does not exist'
      });
    }
    
    // Check if the user has role 2 (property owner)
    if (user.role !== 2) {
      return res.status(403).json({
        message: 'User is not a property owner',
        error: 'Only users with property owner role can create properties'
      });
    }
    
    // Check if the user exists in the propertyowner table
    const PropertyOwner = require('../models/PropertyOwner');
    let propertyOwner = await PropertyOwner.findByPk(user_id);
    
    // If the user doesn't exist in the propertyowner table, create an entry
    if (!propertyOwner) {
      try {
        propertyOwner = await PropertyOwner.create({
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          password: user.password, // This should be hashed already
          picture: user.picture,
          phone: user.phone,
          role: user.role
        });
        console.log(`Created property owner entry for user ${user_id}`);
      } catch (error) {
        console.error('Error creating property owner entry:', error);
        return res.status(500).json({
          message: 'Failed to create property owner entry',
          error: error.message
        });
      }
    }
    
    console.log(`Verified user ${user_id} exists and has property owner role`);
    
    const {
      property_name,
      description,
      extra_info,
      max_guests,
      price,
      perks,
      photos,
      location
    } = req.body;
    
    console.log('Received property data:', {
      ...req.body,
      user_id // Include the resolved user_id
    });
    
    // First, create the location if provided
    let locationId = null;
    if (location) {
      try {
        const Location = require('../models/Location');
        
        // Generate a unique house_no by combining user_id and timestamp
        const uniqueHouseNo = `${user_id}_${Date.now()}`;
        
        // Create a new location entry for the property
        const newLocation = await Location.create({
          sub_city: location.sub_city,
          woreda: location.woreda,
          kebele: location.kebele,
          house_no: uniqueHouseNo,  // Use the generated unique ID
          area_name: location.area_name
        });
        
        console.log('Location created successfully:', newLocation.toJSON());
        locationId = uniqueHouseNo;  // Use the house_no as the locationId
      } catch (locationError) {
        console.error('Error creating location:', locationError);
        return res.status(500).json({
          message: 'Failed to create location',
          error: locationError.message
        });
      }
    } else {
      return res.status(400).json({
        message: 'Location data is required',
        error: 'No location data provided'
      });
    }
    
    // Create the property with explicit values for all required fields
    const propertyData = {
      user_id: parseInt(user_id), // Ensure it's an integer
      property_name,
      description,
      extra_info,
      max_guests: parseInt(max_guests),
      price: parseFloat(price),
      location_id: locationId
    };
    
    console.log('Creating property with data:', propertyData);
    
    // Create the place with the correct field names
    try {
      const place = await Place.create(propertyData);
      console.log('Place created successfully:', place.toJSON());
      
      // Handle perks if provided
      if (perks && perks.length > 0) {
        const Perk = require('../models/Perk');
        await Perk.addPerks(place.property_id, perks);
        console.log('Perks added successfully');
      }
      
      // Handle photos if provided
      if (photos && photos.length > 0) {
        console.log('Processing photos:', photos.length);
        const Photo = require('../models/photo');
        await Photo.addPhotos(place.property_id, photos);
        console.log('Photos added successfully');
      }
      
      res.status(200).json({
        place: place.toJSON(),
        message: 'Property added successfully'
      });
    } catch (createError) {
      console.error('Error creating property:', createError);
      
      // Check if it's a foreign key constraint error
      if (createError.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({
          message: 'Failed to create property: Invalid user ID or location ID',
          error: 'Foreign key constraint violation'
        });
      }
      
      throw createError; // Re-throw for the outer catch block
    }
    
    // Response is now handled in the inner try-catch block
  } catch (err) {
    console.error('Error adding place:', err);
    res.status(500).json({
      message: 'Internal server error',
      error: err.message || 'Unknown error'
    });
  }
};

// Returns user specific places
exports.userPlaces = async (req, res) => {
  try {
    const userData = req.user;
    const id = userData.id;
    
    console.log('Fetching places for user ID:', id);
    
    // Use Sequelize syntax instead of MongoDB syntax
    const places = await Place.findAll({
      where: { user_id: id },
      include: [
        {
          model: require('../models/Location'),
          as: 'location',
          required: false
        },
        {
          model: require('../models/Perk'),
          as: 'perks',
          required: false
        },
        {
          model: require('../models/photo'),
          as: 'photos',
          required: false
        }
      ]
    });
    
    console.log(`Found ${places.length} places for user ID ${id}`);
    res.status(200).json(places);
  } catch (err) {
    console.error('Error fetching user places:', err);
    res.status(500).json({
      message: 'Internal server error',
      error: err.message || 'Unknown error'
    });
  }
};

// Updates a place
exports.updatePlace = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData.id;
    const {
      id,
      property_name,
      description,
      extra_info,
      max_guests,
      price,
      perks,
      photos,
      location_id
    } = req.body;

    console.log('Update data received:', req.body);

    // Find the property by ID
    const place = await Place.findByPk(id);
    
    if (!place) {
      return res.status(404).json({
        message: 'Property not found'
      });
    }
    
    // Check if the user is the owner
    if (userId === place.user_id) {
      // Update the place with the correct field names
      await place.update({
        property_name,
        description,
        extra_info,
        max_guests,
        price,
        location_id: location_id || place.location_id
      });
      
      // Update perks if provided
      if (perks && perks.length > 0) {
        const Perk = require('../models/Perk');
        // First remove existing perks
        // Then add new perks
        await Perk.addPerks(place.property_id, perks);
      }
      
      // Update photos if provided
      if (photos && photos.length > 0) {
        const Photo = require('../models/photo');
        await Photo.addPhotos(place.property_id, photos);
        console.log('Photos updated successfully');
      }
      
      res.status(200).json({
        message: 'Property updated successfully',
        place
      });
    } else {
      res.status(403).json({
        message: 'You are not authorized to update this property'
      });
    }
  } catch (err) {
    console.error('Error updating place:', err);
    res.status(500).json({
      message: 'Internal server error',
      error: err.message || 'Unknown error'
    });
  }
};

// Returns all the places in DB
exports.getPlaces = async (req, res) => {
  try {
    console.log('Fetching all places');
    
    // Use Sequelize syntax instead of MongoDB syntax
    const places = await Place.findAll({
      include: [
        {
          model: require('../models/Location'),
          as: 'location',
          required: false
        },
        {
          model: require('../models/Perk'),
          as: 'perks',
          required: false
        },
        {
          model: require('../models/photo'),
          as: 'photos',
          required: false
        }
      ]
    });
    
    console.log(`Found ${places.length} places in total`);
    res.status(200).json(places);
  } catch (err) {
    console.error('Error fetching all places:', err);
    res.status(500).json({
      message: 'Internal server error',
      error: err.message || 'Unknown error'
    });
  }
};

// Returns single place, based on passed place id
exports.singlePlace = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching place with ID:', id);
    
    // Use Sequelize syntax instead of MongoDB syntax
    const place = await Place.findByPk(id, {
      include: [
        {
          model: require('../models/Location'),
          as: 'location',
          required: false
        },
        {
          model: require('../models/Perk'),
          as: 'perks',
          required: false
        },
        {
          model: require('../models/photo'),
          as: 'photos',
          required: false
        }
      ]
    });
    
    if (!place) {
      console.log(`Place with ID ${id} not found`);
      return res.status(404).json({
        message: 'Place not found',
      });
    }
    
    console.log(`Found place with ID ${id}`);
    res.status(200).json(place);
  } catch (err) {
    console.error('Error fetching single place:', err);
    res.status(500).json({
      message: 'Internal server error',
      error: err.message || 'Unknown error'
    });
  }
};

// Returns single place by property_id for edit page
exports.singlePlaceById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching place for edit with property_id:', id);
    
    // Use Sequelize syntax with property_id
    const place = await Place.findOne({
      where: { property_id: id },
      include: [
        {
          model: require('../models/Location'),
          as: 'location',
          required: false
        },
        {
          model: require('../models/Perk'),
          as: 'perks',
          required: false
        },
        {
          model: require('../models/photo'),
          as: 'photos',
          required: false
        }
      ]
    });
    
    if (!place) {
      console.log(`Place with property_id ${id} not found`);
      return res.status(404).json({
        message: 'Place not found',
      });
    }
    
    console.log(`Found place with property_id ${id}`);
    res.status(200).json(place);
  } catch (err) {
    console.error('Error fetching single place by id:', err);
    res.status(500).json({
      message: 'Internal server error',
      error: err.message || 'Unknown error'
    });
  }
};

// Search Places in the DB
exports.searchPlaces = async (req, res) => {
  try {
    const searchword = req.params.key;
    console.log('Searching places with keyword:', searchword);
    
    const { Op } = require('sequelize');
    
    if (searchword === '') {
      // Return all places if no search term
      const allPlaces = await Place.findAll({
        include: [
          {
            model: require('../models/Location'),
            as: 'location',
            required: false
          },
          {
            model: require('../models/Perk'),
            as: 'perks',
            required: false
          },
          {
            model: require('../models/photo'),
            as: 'photos',
            required: false
          }
        ]
      });
      return res.status(200).json(allPlaces);
    }
    
    // Search in property_name, description, and location fields
    const searchMatches = await Place.findAll({
      where: {
        [Op.or]: [
          { property_name: { [Op.iLike]: `%${searchword}%` } },
          { description: { [Op.iLike]: `%${searchword}%` } }
        ]
      },
      include: [
        {
          model: require('../models/Location'),
          as: 'location',
          where: {
            [Op.or]: [
              { sub_city: { [Op.iLike]: `%${searchword}%` } },
              { area_name: { [Op.iLike]: `%${searchword}%` } }
            ]
          },
          required: false
        },
        {
          model: require('../models/Perk'),
          as: 'perks',
          required: false
        },
        {
          model: require('../models/photo'),
          as: 'photos',
          required: false
        }
      ]
    });
    
    console.log(`Found ${searchMatches.length} matches for search term '${searchword}'`);
    res.status(200).json(searchMatches);
  } catch (err) {
    console.error('Error searching places:', err);
    res.status(500).json({
      message: 'Internal server error',
      error: err.message || 'Unknown error'
    });
  }
}