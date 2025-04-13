// models/index.js
const sequelize = require('../config/db');
const User = require('./User');
const Location = require('./Location');

// Define model associations here
// For example:
// User.hasMany(Location);
// Location.belongsTo(User);

// Sync all models with the database
const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing models:', error);
  }
};

// Run the sync function
syncModels();

module.exports = {
  sequelize,
  User,
  Location
};
