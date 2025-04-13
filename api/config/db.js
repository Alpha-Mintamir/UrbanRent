// config/db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

// Test the connection
sequelize.authenticate()
  .then(() => console.log('PostgreSQL DB connected successfully via Sequelize'))
  .catch((err) => {
    console.error('DB connection failed');
    console.error(err);
    process.exit(1);
  });

module.exports = sequelize;
