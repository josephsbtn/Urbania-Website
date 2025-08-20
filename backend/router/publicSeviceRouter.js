const express = require("express");
const router = express.Router();
const {
  getAllHostipals,
  getAllPolice,
  getAllPark,
} = require("../service/publicService.js");

router.get("/hospitals", async (req, res) => {
  try {
    const result = await getAllHostipals();
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/polices", async (req, res) => {
  try {
    const result = await getAllPolice();
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/parks", async (req, res) => {
  try {
    const result = await getAllPark();
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
