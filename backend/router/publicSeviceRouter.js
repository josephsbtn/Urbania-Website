const express = require("express");
const router = express.Router();
const {
  getAllHostipals,
  getAllPolice,
} = require("../service/publicService.js");

router.get("/hospitals", async (req, res) => {
  try {
    const result = await getAllHostipals();
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/polices", async (req, res) => {
  try {
    const result = await getAllPolice();
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
