// adminController.js
const User = require('../models/User');
const Place = require('../models/Place');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const { Op } = require('sequelize');
const sequelize = require('../config/db');

// Get dashboard analytics data
exports.getDashboardAnalytics = async (req, res) => {
  try {
    // Get counts
    const userCount = await User.count();
    const propertyCount = await Place.count();
    const bookingCount = await Booking.count();
    const reviewCount = await Review.count();
    
    // Get user distribution by role
    const userRoleDistribution = await User.findAll({
      attributes: ['role', [sequelize.fn('COUNT', sequelize.col('user_id')), 'count']],
      group: ['role'],
      raw: true
    });
    
    // Get property distribution by status (assuming there's a status field)
    const propertyStatusDistribution = await Place.findAll({
      attributes: ['is_broker_listing', [sequelize.fn('COUNT', sequelize.col('property_id')), 'count']],
      group: ['is_broker_listing'],
      raw: true
    });
    
    // Get recent bookings
    const recentBookings = await Booking.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email']
        },
        {
          model: Place,
          as: 'place',
          attributes: ['property_name']
        }
      ]
    });
    
    // Get monthly booking stats for the current year
    const currentYear = new Date().getFullYear();
    const monthlyBookings = await Booking.findAll({
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('createdAt')), 'month'],
        [sequelize.fn('COUNT', sequelize.col('booking_id')), 'count']
      ],
      where: sequelize.where(
        sequelize.fn('YEAR', sequelize.col('createdAt')),
        currentYear
      ),
      group: [sequelize.fn('MONTH', sequelize.col('createdAt'))],
      raw: true
    });
    
    // Get top locations
    const topLocations = await Place.findAll({
      attributes: [
        [sequelize.col('location.sub_city'), 'subCity'],
        [sequelize.fn('COUNT', sequelize.col('property_id')), 'count']
      ],
      include: [
        {
          model: require('../models/Location'),
          as: 'location',
          attributes: []
        }
      ],
      group: [sequelize.col('location.sub_city')],
      order: [[sequelize.fn('COUNT', sequelize.col('property_id')), 'DESC']],
      limit: 5,
      raw: true
    });
    
    // Return analytics data
    res.status(200).json({
      success: true,
      data: {
        counts: {
          users: userCount,
          properties: propertyCount,
          bookings: bookingCount,
          reviews: reviewCount
        },
        userRoleDistribution,
        propertyStatusDistribution,
        recentBookings,
        monthlyBookings,
        topLocations
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard analytics',
      error: error.message
    });
  }
};

// Generate reports
exports.generateReport = async (req, res) => {
  try {
    const { reportType, startDate, endDate } = req.body;
    
    // Validate dates
    const start = startDate ? new Date(startDate) : new Date(new Date().setMonth(new Date().getMonth() - 1));
    const end = endDate ? new Date(endDate) : new Date();
    
    let reportData;
    let reportTitle;
    
    switch (reportType) {
      case 'users':
        reportData = await User.findAll({
          attributes: ['user_id', 'name', 'email', 'role', 'phone'],
          where: {
            createdAt: {
              [Op.between]: [start, end]
            }
          },
          order: [['createdAt', 'DESC']]
        });
        reportTitle = 'User Registration Report';
        break;
        
      case 'properties':
        reportData = await Place.findAll({
          attributes: ['property_id', 'property_name', 'price', 'max_guests', 'is_broker_listing', 'createdAt'],
          include: [
            {
              model: require('../models/Location'),
              as: 'location',
              attributes: ['sub_city', 'area_name']
            }
          ],
          where: {
            createdAt: {
              [Op.between]: [start, end]
            }
          },
          order: [['createdAt', 'DESC']]
        });
        reportTitle = 'Property Listing Report';
        break;
        
      case 'bookings':
        reportData = await Booking.findAll({
          attributes: ['booking_id', 'check_in', 'check_out', 'price', 'status', 'createdAt'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['name', 'email']
            },
            {
              model: Place,
              as: 'place',
              attributes: ['property_name']
            }
          ],
          where: {
            createdAt: {
              [Op.between]: [start, end]
            }
          },
          order: [['createdAt', 'DESC']]
        });
        reportTitle = 'Booking Report';
        break;
        
      case 'revenue':
        reportData = await Booking.findAll({
          attributes: [
            [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
            [sequelize.fn('SUM', sequelize.col('price')), 'revenue']
          ],
          where: {
            status: 'confirmed',
            createdAt: {
              [Op.between]: [start, end]
            }
          },
          group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
          order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
          raw: true
        });
        reportTitle = 'Revenue Report';
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid report type'
        });
    }
    
    res.status(200).json({
      success: true,
      reportTitle,
      dateRange: {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
      },
      data: reportData
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating report',
      error: error.message
    });
  }
};

// Admin login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check for presence of email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required!'
      });
    }
    
    // Find user by email
    const user = await User.findByEmail(email);
    
    // Check if user exists and is an admin
    if (!user || user.role !== 4) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or not an admin'
      });
    }
    
    // Validate password
    const isPasswordCorrect = await user.isValidatedPassword(password);
    
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Generate token
    const token = user.getJwtToken();
    
    // Send token in cookie
    res.cookie('token', token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
    
    // Send response
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Check if user is admin
exports.isAdmin = async (req, res, next) => {
  try {
    // Check if user is logged in and is an admin
    if (!req.user || req.user.role !== 4) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Admin only'
      });
    }
    
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
