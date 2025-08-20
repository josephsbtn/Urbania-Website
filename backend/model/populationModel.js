const mongoose = require("mongoose");

const populationSchema = new mongoose.Schema({
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
  },
  population: {
    type: Number,
  },
  CoverageFire: {
    type: Boolean,
    default: false,
  },
  CoverageHealth: {
    type: Boolean,
    default: false,
  },
  CoveragePolice: {
    type: Boolean,
    default: false,
  },
  CoveragePark: {
    type: Boolean,
    default: false,
  },
});

const Population = mongoose.model("Population", populationSchema);
module.exports = Population;
