const mongoose = require('mongoose');

const connectToDatabase = async () => {
  console.log('Database connection initiated');
  const url = 'mongodb+srv://niranjanpawar2:BVA2ferpSz52lM3z@namstenodelatest.8n8quio.mongodb.net/devTinder'; // <-- Add DB name
  try {
    await mongoose.connect(url);
    console.log('✅ Database connection established');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
};

module.exports = {
  connectToDatabase
};
