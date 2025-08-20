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

const uploadReport = async (photo, description) => {
  try {
    const imageBuffer = fs.readFileSync(photo);
    const base64Image = imageBuffer.toString("base64");
    const getLabel = (
      await axios.post(
        "http://127.0.0.1:5000/label",
        {
          image: base64Image,
          description: description,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    ).data;

    const report = {
      photo: photo,
      description: description,
      category: getLabel,
    };
    const result = await Report.create(report);
    return result;
  } catch (error) {
    console.error(error);
    return error;
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
    const chached = JSON.stringify(await Redis.get("report"));
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
