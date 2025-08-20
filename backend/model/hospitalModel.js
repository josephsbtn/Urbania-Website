const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  amenity: {
    type: String,
  },
  radius_efektif_km: {
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
});

const model = mongoose.model("Hospitals", hospitalSchema);
module.exports = model;
