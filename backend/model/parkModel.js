const mongoose = require("mongoose");

const parkSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    geometry: {
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
    coverage_population: {
      type: Number,
    },
  },
  { collection: "park" }
);
parkSchema.index({ geometry: "2dsphere" });
const model = mongoose.model("park", parkSchema);
module.exports = model;
