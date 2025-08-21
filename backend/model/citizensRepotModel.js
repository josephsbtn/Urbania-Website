const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  description: {
    type: String,
  },
  photo: {
    type: String,
  },
  category: {
    type: String,
  },
});

const model = mongoose.model("Citizen-Reports", reportSchema);

module.exports = model;
  