const Hospital = require("../model/hospitalModel.js");
const Police = require("../model/PoliceModels.js");
const Redis = require("../config/redis.js");

const getAllHostipals = async () => {
  try {
    const chached = await Redis.get("hospitals");
    if (chached) {
      return chached;
    }
    const result = await Hospital.find({});
    await Redis.set("hospitals", result);
    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const getAllPolice = async () => {
  try {
    const chached = await Redis.get("police");
    if (chached) {
      return chached;
    }
    const result = await Police.find({});
    await Redis.set("police", result);
    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
};

module.exports = {
  getAllHostipals,
  getAllPolice,
};
