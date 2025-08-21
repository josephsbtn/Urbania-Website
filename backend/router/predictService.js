const express = require("express");
const router = express.Router();
const { forecasting, predictSolarPanel } = require("../service/MLservice.js");

router.get("/forecast", async (req, res) => {
  try {
    const result = await forecasting();
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/solar/:lon/:lat", async (req, res) => {
  try {
    const { lon, lat } = req.params;
    const result = await predictSolarPanel(lon, lat);
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
