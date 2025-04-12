// config/db.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Your Neon DB URL
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect()
  .then(() => console.log('PostgreSQL DB connected successfully'))
  .catch((err) => {
    console.error('DB connection failed');
    console.error(err);
    process.exit(1);
  });

module.exports = pool;
