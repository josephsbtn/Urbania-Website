const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Urbania";
const dbconnect = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Database Connection Success", mongoURI);
  } catch (error) {
    console.error("Database Connection Failed");
  }
};

module.exports = {
  dbconnect,
};
