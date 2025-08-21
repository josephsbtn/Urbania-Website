const Report = require("../model/citizensRepotModel.js");
const Redis = require("../config/redis.js");
const axios = require("axios");
const fs = require("fs");

const getAllReports = async () => {
  try {
    const chached = await Redis.get("report");
    if (chached) {
      return JSON.parse(chached);
    }
    const result = await Report.find({});
    await Redis.set("report", JSON.stringify(result));
    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const uploadReport = async (photo, description) => {
  try {
    const photoPath = photo;

    const imageBuffer = fs.readFileSync(photoPath);
    const base64Image = imageBuffer.toString("base64");

    const getLabel = (
      await axios.post(
        "http://127.0.0.1:5000/classify",
        {
          image_base64: base64Image,
          description: description,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    ).data;

    console.log(getLabel.predicted_class); // corle.log(getLabel);
    // simpan ke MongoDB
    const report = await Report.create({
      photo: photoPath,
      description,
      category: getLabel.predicted_class,
    });

    console.log(report);

    return data = {
      photo: report.photo,
      description: report.description,
      category: report.category,
    }
  } catch (error) {
    console.error(error);
    
  }
};

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
