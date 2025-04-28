// models/index.js
const sequelize = require('../config/db');
const User = require('./User');
const Location = require('./Location');
const Property = require('./Place');
const Perk = require('./Perk');
const Photo = require('./photo');
const Review = require('./Review');

// Define model associations here
User.hasMany(Property, { foreignKey: 'user_id' });
Property.belongsTo(User, { foreignKey: 'user_id' });

// Add review associations
Property.hasMany(Review, { foreignKey: 'property_id', as: 'reviews' });
Review.belongsTo(Property, { foreignKey: 'property_id' });
User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'user_id' });

// Add association between Property and Location
Property.belongsTo(Location, { foreignKey: 'location_id', as: 'location' });
Location.hasMany(Property, { foreignKey: 'location_id' });

Property.hasMany(Perk, { foreignKey: 'property_id', as: 'perks' });
Perk.belongsTo(Property, { foreignKey: 'property_id' });

Property.hasMany(Photo, { foreignKey: 'property_id', as: 'photos' });
Photo.belongsTo(Property, { foreignKey: 'property_id' });

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
  Location,
  Property,
  Perk,
  Photo,
  Review
};
