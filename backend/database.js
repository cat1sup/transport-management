const { Sequelize } = require('sequelize');
require('dotenv').config();

// Using environment variables for database configuration
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  pool: {
    max: 10, // Maximum number of connection in pool
    min: 0,  // Minimum number of connection in pool
    acquire: 30000, // The maximum time, in milliseconds, that a connection can be idle before being released
    idle: 10000 // The maximum time, in milliseconds, that pool will try to get connection before throwing error
  }
});

async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testDatabaseConnection();

module.exports = sequelize;
