require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db"); // Import the database connection
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;

// Import models to ensure they're initialized
require("./models/index");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// For handling cookies
app.use(cookieParser());

// Initialize cookie-session middleware
app.use(
  cookieSession({
    name: "session",
    maxAge: process.env.COOKIE_TIME * 24 * 60 * 60 * 1000,
    keys: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
    sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax", // Allow cross-origin requests in production
    httpOnly: true, // Makes the cookie accessible only on the server-side
  })
);

// Middleware to handle JSON requests
app.use(express.json());

// CORS middleware with more permissive settings for serverless
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.CLIENT_URL, /\.vercel\.app$/] // Allow Vercel domains in production
      : process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Add a health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Test the database connection
    const connected = await db.testConnection();
    if (connected) {
      return res.status(200).json({ status: 'healthy', database: 'connected' });
    } else {
      return res.status(500).json({ status: 'unhealthy', database: 'disconnected' });
    }
  } catch (error) {
    return res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

// Use express router
app.use("/", require("./routes"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? 'Server error' : err.message
  });
});

// Only start the server if not in a serverless environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(process.env.PORT || 8000, (err) => {
    if (err) {
      console.log("Error in connecting to server: ", err);
    }
    console.log(`Server is running on port no. ${process.env.PORT || 8000}`);
  });
}

module.exports = app;
