const express = require("express");
const upload = require("../config/multer.js");
const { uploadReport, getAllReports } = require("../service/reportService");
const router = express.Router();

router.post("/", upload.single("photo"), (req, res) => {
  try {
    const { description } = req.body;
    const photo = req.file.filename;
    const upload = uploadReport(photo, description);
    res.status(201).json({ upload });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await getAllReports();
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
