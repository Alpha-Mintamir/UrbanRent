const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Location extends Model {}

Location.init({
  house_no: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sub_city: {
    type: DataTypes.STRING(255)
  },
  woreda: {
    type: DataTypes.STRING(255)
  },
  kebele: {
    type: DataTypes.STRING(255)
  },
  area_name: {
    type: DataTypes.STRING(255)
  }
}, {
  sequelize,
  modelName: 'Location',
  tableName: 'locations',
  timestamps: false
});

module.exports = Location;
