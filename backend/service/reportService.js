const Report = require("../model/citizensRepotModel.js");
const Redis = require("../config/redis.js");

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

const uploadReport = async (photo, description, category) => {
  try {
    const report = {
      photo,
      description,
      category,
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
  uploadReport,
  deleteReport,
  getAllReports,
};
