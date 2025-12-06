const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// Support both MONGO_URI and MONGODB_URI environment variables
const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/urbania";

const dbconnect = async () => {
  try {
    await mongoose.connect(mongoURI, {
      // Production-ready options for MongoDB Atlas
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log("Database Connection Success", mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//*****:*****@')); // Hide credentials in logs
  } catch (error) {
    console.error("Database Connection Failed:", error.message);
    // Don't exit process in production, allow retry
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose connection closed through app termination');
  process.exit(0);
});

module.exports = {
  dbconnect,
};
