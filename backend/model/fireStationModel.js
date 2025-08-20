const mongoose = require("mongoose");

const fireStationSchema = new mongoose.Schema(
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
  { collection: "firestation" }
);
fireStationSchema.index({ geometry: "2dsphere" });
const model = mongoose.model("firestation", fireStationSchema);
module.exports = model;
