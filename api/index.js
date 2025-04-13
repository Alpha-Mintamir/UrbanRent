require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectWithDB = require("./config/db"); // Still using this to connect DB
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;

// Connect with PostgreSQL Database
require("./config/db");  // This will automatically connect to DB

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
    secure: true, // Only send over HTTPS
    sameSite: "none", // Allow cross-origin requests
    httpOnly: true, // Makes the cookie accessible only on the server-side
  })
);

// Middleware to handle JSON requests
app.use(express.json());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Use express router
app.use("/", require("./routes"));

app.listen(process.env.PORT || 8000, (err) => {
  if (err) {
    console.log("Error in connecting to server: ", err);
  }
  console.log(`Server is running on port no. ${process.env.PORT}`);
});

module.exports = app;
