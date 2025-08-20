const mongoose = require("mongoose");

const policeSchema = new mongoose.Schema(
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
    STREET_NAME: {
      type: String,
    },
    TYPE: {
      type: String,
    },
    TELEPHONE: {
      type: String,
    },
    UNITS: {
      type: String,
    },
    OPERATING_HOURS: {
      type: String,
    },
    POSTAL_CODE: {
      type: String,
    },
    radius: {
      type: Number,
    },
    coverage_population: {
      type: Number,
    },
  },
  { collection: "police" }
);
policeSchema.index({ geometry: "2dsphere" });
const model = mongoose.model("Police", policeSchema);

module.exports = model;
