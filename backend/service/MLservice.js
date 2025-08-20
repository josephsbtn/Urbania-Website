const axios = require("axios");

const predictSolarPanel = async (lon, lat) => {
  try {
    const result = (
      await axios.post(
        "http://127.0.0.1:5000/solar",
        { lon, lat },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    ).data;
    return {
      estimated: result.estimated_generation_kWh_per_year,
      geometry: {
        type: "Point",
        coordinates: [lon, lat],
      },
      roofArea: result.roof_area_m2,
    };
  } catch (error) {
    console.error(error);
    return error;
  }
};

const forecasting = async (lon, lat) => {
  try {
    const [water, elec] = await Promise.all([
      (await axios.get(`http://127.0.0.1:5000/forecast/water`)).data,
      (await axios.get(`http://127.0.0.1:5000/forecast/electricity`)).data,
    ]);

    return {
      water: water.data,
      elec: elec.data,
    };
  } catch (error) {
    console.error(error);
    return error;
  }
};

module.exports = { predictSolarPanel };
