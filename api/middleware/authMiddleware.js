// Authentication middleware
const jwt = require('jsonwebtoken');

exports.isLoggedIn = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
    
    if (!token) {
      console.log('No token found in request');
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Debug token
    console.log('Auth token:', token);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Debug decoded token
    console.log('Decoded token:', decoded);
    
    // Add user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role, // Make sure role is included
      name: decoded.name
    };
    
    // Debug user object
    console.log('User in middleware:', req.user);
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
