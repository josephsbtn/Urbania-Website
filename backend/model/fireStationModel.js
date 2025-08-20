const mongoose = require("mongoose");

const fireStationSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
  },
  radius: {
    type: Number,
  },
});

const model = mongoose.model("FireStation", fireStationSchema);
module.exports = model;
