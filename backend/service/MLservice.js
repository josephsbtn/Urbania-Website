const axios = require("axios");
const HistorySolarPredict = require("../model/historySolarPredict.js");

const predictSolarPanel = async (lon, lat) => {
  try {
    const result = (
      await axios.post(
        "http://127.0.0.1:5000/solar",
        { lon: lon, lat: lat },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    ).data;

    console.log(result);

    const currentDate = new Date();

    const formattedResult = {
      estimated: result.estimated_generation_kWh_per_year,
      geometry: {
        type: "Point",
        coordinates: [result.lon, result.lat],
      },
      roofArea: result.roof_area_m2,
    };
    await HistorySolarPredict.create({ date: currentDate, ...formattedResult });
    return formattedResult;
  } catch (error) {
    console.error(error.message);
    return error;
  }
};

const forecasting = async () => {
  try {
    const [water, elec] = await Promise.all([
      (await axios.get(`http://127.0.0.1:5000/forecast/water`)).data,
      (await axios.get(`http://127.0.0.1:5000/forecast/electricity`)).data,
    ]);

    console.log("Water Forecasting:", water);
    console.log("Electricity Forecasting:", elec);

    return {
      water: {
        year1: water.water_forecast.year1,
        year3: water.water_forecast.year3,
      },
      elec: {
        menit30: elec.electricity_forecast.menit30,
        jam1: elec.electricity_forecast.jam1,
        jam3: elec.electricity_forecast.jam3,
      },
    };
  } catch (error) {
    console.error(error);
    return error;
  }
};

module.exports = { predictSolarPanel, forecasting };
