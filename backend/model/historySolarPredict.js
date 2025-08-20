const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    date: {
      type: String,
    },
    estimated: {
      type: Number,
    },
    roofArea: {
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
  },
  {
    timestamps: true,
  }
);

const model = mongoose.model("HistorySolarPredict", historySchema);
module.exports = model;
