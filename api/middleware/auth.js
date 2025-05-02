const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to check if user is logged in
exports.isLoggedIn = async (req, res, next) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Please login to access this resource'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    // Find user by ID
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found'
      });
    }
    
    // Attach user to request object with role information from both sources
    req.user = {
      ...user.toJSON(),
      // Use the role from the token if available, otherwise use the role from the database
      role: decoded.role !== undefined ? decoded.role : user.role
    };
    
    console.log('User in request:', req.user);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// Middleware to check user role
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user.role}) is not allowed to access this resource`
      });
    }
    next();
  };
};

// Middleware to handle errors
exports.errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Default error
  let error = {
    statusCode: err.statusCode || 500,
    message: err.message || 'Internal Server Error'
  };
  
  // Handle specific error types
  if (err.name === 'SequelizeValidationError') {
    error.message = Object.values(err.errors).map(val => val.message).join(', ');
    error.statusCode = 400;
  }
  
  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.statusCode = 401;
  }
  
  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    error.statusCode = 401;
  }
  
  res.status(error.statusCode).json({
    success: false,
    message: error.message
  });
};
