const Report = require("../model/citizensRepotModel.js");
const Redis = require("../config/redis.js");
const axios = require("axios");
const fs = require("fs");

const getAllReports = async () => {
  try {
    const chached = await Redis.get("report");
    if (chached) {
      return chached;
    }
    const result = await Report.find({});
    await Redis.set("report", result);
    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // simpan ke folder uploads

app.post("/report", upload.single("photo"), async (req, res) => {
  try {
    const { description } = req.body;
    const photoPath = req.file.path;

    // convert ke base64
    const imageBuffer = fs.readFileSync(photoPath);
    const base64Image = imageBuffer.toString("base64");

    // kirim ke ML service
    const getLabel = (
      await axios.post("http://127.0.0.1:5000/label", {
        image: base64Image,
        description,
      })
    ).data;

    // simpan ke MongoDB
    const report = await Report.create({
      photo: photoPath,
      description,
      category: getLabel,
    });

    res.json({ success: true, report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const deleteReport = async (id) => {
  try {
    const result = await Report.findByIdAndDelete(id);
    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const getReport = async (id) => {
  try {
    const chached = await Redis.get("report");
    if (chached) {
      const result = chached.filter((item) => item.id !== id);
      return result;
    }
    const result = await Report.findById(id);
    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
};

module.exports = {
  getReport,
  uploadReport,
  deleteReport,
  getAllReports,
};
