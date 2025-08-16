const mongoose = require("mongoose");

const policeSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
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
});
