const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    amenity: {
      type: String,
    },
    radius: {
      type: Number,
    },
    kapasitas_beds: {
      type: Number,
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
    coverage_population: {
      type: Number,
    },
  },
  { collection: "health-facility" }
);

hospitalSchema.index({ geometry: "2dsphere" });

const model = mongoose.model("Health-Facility", hospitalSchema);
module.exports = model;
