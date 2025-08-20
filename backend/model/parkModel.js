const mongoose = require("mongoose");

const parkSchema = new mongoose.Schema({
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
});

const model = mongoose.model("Park", parkSchema);
module.exports = model;
