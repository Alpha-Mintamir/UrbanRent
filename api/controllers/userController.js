const User = require('../models/User');
const cookieToken = require('../utils/cookieToken');
const bcrypt = require('bcryptjs')
const cloudinary = require('cloudinary').v2;


// Register/SignUp user
exports.register = async (req, res) => {
  try {
    const { name, email, password, picture, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email and password are required',
      });
    }

    // check if user is already registered
    let user = await User.findByEmail(email);

    if (user) {
      return res.status(400).json({
        message: 'User already registered!',
      });
    }

    // Create new user
    user = await User.register({
      name,
      email,
      password,
      picture,
      phone,
      role
    });

    // after creating new user in DB send the token
    cookieToken(user, res);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      message: 'Internal server Error',
      error: err.message,
    });
  }
};

// Login/SignIn user
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // check for presence of email, password and role
    if (!email || !password || !role) {
      return res.status(400).json({
        message: 'Email, password and role are required!',
      });
    }

    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(400).json({
        message: 'User does not exist!',
      });
    }

    // match the password
    const isPasswordCorrect = await User.isValidatedPassword(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: 'Email or password is incorrect!',
      });
    }

    // Check if the user has the requested role - strict check
    if (parseInt(user.role) !== parseInt(role)) {
      return res.status(403).json({
        message: 'Invalid role for this account. Please select the correct role.',
      });
    }

    // if everything is fine we will send the token
    cookieToken(user, res);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      message: 'Internal server Error',
      error: err.message,
    });
  }
};

// Google Login
exports.googleLogin = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({
        message: 'Name, email and role are required'
      });
    }

    // check if user already registered
    let user = await User.findByEmail(email);

    // If the user does not exist, create a new user in the DB  
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8);
      user = await User.register({
        name,
        email,
        password: randomPassword,
        role: parseInt(role)
      });
    } else {
      // Strict role check for existing users
      if (parseInt(user.role) !== parseInt(role)) {
        return res.status(403).json({
          message: 'Invalid role for this account. Please select the correct role.',
        });
      }
    }

    // send the token
    cookieToken(user, res);
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({
      message: 'Internal server Error',
      error: err.message,
    });
  }
}

// Upload picture
exports.uploadPicture = async (req, res) => {
  const { path } = req.file
  try {
    let result = await cloudinary.uploader.upload(path, {
      folder: 'Airbnb/Users',
    });
    res.status(200).json(result.secure_url)
  } catch (error) {
    console.error('Upload picture error:', error);
    res.status(500).json({
      error: error.message,
      message: 'Internal server error',
    });
  }
}

// update user
exports.updateUserDetails = async (req, res) => {
  try {
    const { name, password, email, picture } = req.body

    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // TODO: Implement user update in PostgreSQL model
    // This needs to be implemented in the User model
    
    // After updating user, send token
    cookieToken(user, res);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
}

// Logout
exports.logout = async (req, res) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: true,   // Only send over HTTPS
    sameSite: 'none' // Allow cross-origin requests
  });
  res.status(200).json({
    success: true,
    message: 'Logged out',
  });
};
