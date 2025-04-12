// user.js
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const DEFAULT_PICTURE_URL =
  'https://res.cloudinary.com/rahul4019/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1695133265/pngwing.com_zi4cre.png';

const User = {
  // Register new user
  async register({ name, email, password, picture }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    picture = picture || DEFAULT_PICTURE_URL;

    const result = await pool.query(
      `INSERT INTO users (name, email, password, picture)
       VALUES ($1, $2, $3, $4)
       RETURNING user_id, name, email, picture`,
      [name, email, hashedPassword, picture]
    );

    return result.rows[0];
  },

  // Find user by email
  async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  },
  
  // Find user by ID
  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM users WHERE user_id = $1',
      [id]
    );
    return result.rows[0];
  },

  // Update user details
  async updateUser({ user_id, name, password, picture }) {
    let query = 'UPDATE users SET ';
    const values = [];
    const updateFields = [];
    let paramIndex = 1;

    if (name) {
      updateFields.push(`name = $${paramIndex}`);
      values.push(name);
      paramIndex++;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push(`password = $${paramIndex}`);
      values.push(hashedPassword);
      paramIndex++;
    }

    if (picture) {
      updateFields.push(`picture = $${paramIndex}`);
      values.push(picture);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      return null; // Nothing to update
    }

    query += updateFields.join(', ');
    query += ` WHERE user_id = $${paramIndex} RETURNING user_id, name, email, picture`;
    values.push(user_id);

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Compare passwords
  async isValidatedPassword(userSentPassword, hashedPassword) {
    return await bcrypt.compare(userSentPassword, hashedPassword);
  },

  // Generate JWT
  getJwtToken(user_id) {
    return jwt.sign({ id: user_id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY || '1h',
    });
  },
};

module.exports = User;
