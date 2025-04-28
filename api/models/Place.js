const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Location = require('./Location');

class Property extends Model {}

Property.init({
  property_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id'
    },
    onDelete: 'CASCADE'
  },
  property_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  extra_info: {
    type: DataTypes.TEXT
  },
  max_guests: {
    type: DataTypes.INTEGER
  },
  location_id: {
    type: DataTypes.STRING(255),
    references: {
      model: Location,
      key: 'house_no'
    }
  },
  is_broker_listing: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'Property',
  tableName: 'properties',
  timestamps: false
});

module.exports = Property;
