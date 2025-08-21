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

    const currentDate = new Date.now();

    const formattedResult = result.map((item) => ({
      estimated: item.estimated_generation_kWh_per_year,
      geometry: {
        type: "Point",
        coordinates: [item.lon, item.lat],
      },
      roofArea: item.roof_area_m2,
    }));

    await HistorySolarPredict.create({ date: currentDate, ...formattedResult });
    return formattedResult;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const forecasting = async () => {
  try {
    const [water, elec] = await Promise.all([
      (await axios.get(`http://127.0.0.1:5000/forecast/water`)).data,
      (await axios.get(`http://127.0.0.1:5000/forecast/electricity`)).data,
    ]);

    return {
      water: {
        year1: water.water_forecasting.year1,
        year3: water.water_forecasting.year3,
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
