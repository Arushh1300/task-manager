const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is missing. Add MONGO_URI to your .env file.');
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`MongoDB Database: ${conn.connection.name}`);

    return conn;
  } catch (error) {
    console.error('MongoDB connection failed');
    console.error('Message:', error.message);
    console.error('Name:', error.name);
    console.error('Code:', error.code);
    console.error('Full error:', error);

    throw error;
  }
};

module.exports = connectDB;
