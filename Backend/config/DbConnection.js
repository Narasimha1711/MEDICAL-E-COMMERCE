// config/DbConnection.js
const mongoose = require('mongoose');
require('dotenv').config();

const connection = async (uri = process.env.MONGODB_CONNECTION) => {
  try {
    await mongoose.connect(uri);
    if (process.env.NODE_ENV !== 'test') {
      console.log('Database Connection Established');
    }
  } catch (err) {
    console.error('Database Connection Error:', err);
    throw err;
  }
};

const closeConnection = async () => {
  try {
    if (mongoose.connection.readyState !== 0) { // Only close if connection is open
      await mongoose.connection.close();
      if (process.env.NODE_ENV !== 'test') {
        console.log('Database Connection Closed');
      }
    }
  } catch (err) {
    console.error('Error closing database connection:', err);
    throw err;
  }
};

module.exports = { connection, closeConnection };