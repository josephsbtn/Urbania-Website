const mongoose = require("mongoose");

const populationSchema = new mongoose.Schema(
  {
    geometry: {
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
  },
  { collection: "population" }
);
populationSchema.index({ geometry: "2dsphere" });
const Population = mongoose.model("Population", populationSchema);
module.exports = Population;
