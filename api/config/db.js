// config/db.js
const { Sequelize } = require('sequelize');

// Create a connection pool that can be reused between serverless function invocations
let sequelize;

if (!sequelize) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 2, // Reduce connection pool size for serverless
      min: 0,
      idle: 10000,
      acquire: 30000
    },
    logging: false
  });
}

// Don't automatically authenticate on import in serverless environment
// This will be done when needed instead
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL DB connected successfully via Sequelize');
    return true;
  } catch (err) {
    console.error('DB connection failed');
    console.error(err);
    return false;
  }
};

module.exports = sequelize;
module.exports.testConnection = testConnection;
