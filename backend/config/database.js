const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const mongoURI = process.env.MONGO_URI;
const dbconnect = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Database Connection Success");
  } catch (error) {
    console.error("Database Connection Failed");
  }
};

module.exports = {
  dbconnect,
};
