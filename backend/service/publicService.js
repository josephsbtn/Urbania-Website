const Hospital = require("../model/hospitalModel.js");
const Police = require("../model/PoliceModels.js");
const Population = require("../model/populationModel.js");
const Park = require("../model/parkModel.js");
const FireStation = require("../model/fireStationModel.js");

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

const getAllPark = async () => {
  try {
    const chached = await Redis.get("park");
    if (chached) {
      return chached;
    }
    const result = await Park.find({});
    await Redis.set("park", result);
    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const getAllFireStation = async () => {
  try {
    const chached = await Redis.get("fire");
    if (chached) {
      return JSON.parse(chached);
    }

    const result = await FireStation.find();
    await Redis.set("fire", JSON.stringify(result));
    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const calcCoveragePerFacility = async (category) => {
  try {
    let facilities;
    if (category === "Health") {
      facilities = await Hospital.find({});
    }
    if (category === "Police") {
      facilities = await Police.find({});
    }
    if (category === "Park") {
      facilities = await Park.find({});
    }
    if (category === "Fire") {
      facilities = await FireStation.find({});
    }
    for (const f of facilities) {
      const covered = await Population.aggregate([
        {
          $geoNear: {
            near: f.geometry,
            distanceField: "dist",
            maxDistance: f.radius * 1000,
            spherical: true,
          },
        },
        { $group: { _id: null, total: { $sum: "$population" } } },
      ]);

      if (category === "Health") {
        await Hospital.findByIdAndUpdate(f._id, {
          covered_population: covered[0] || 0,
        });
      }
      if (category === "Police") {
        console.log(f._id, covered[0]?.total.round());
        await Police.findByIdAndUpdate(f._id, {
          covered_population: covered[0]?.total.round() || 0,
        });
      }
      if (category === "Park") {
        await Park.findByIdAndUpdate(f._id, {
          covered_population: covered[0]?.total.round() || 0,
        });
      }
      if (category === "Fire") {
        await FireStation.findByIdAndUpdate(f._id, {
          covered_population: covered[0]?.total.round() || 0,
        });
      }
    }
  } catch (error) {
    console.error(error);
    return error;
  }
};

const calcCoverageUnion = async (category) => {
  try {
    let facilities = [];

    // Bagian ini sudah benar untuk mengambil data fasilitas
    if (category === "Health") {
      facilities = await Hospital.find({});
    }
    if (category === "Police") {
      facilities = await Police.find({});
    }
    if (category === "Park") {
      facilities = await Park.find({});
    }
    if (category === "Fire") {
      facilities = await FireStation.find({});
    }

    const fieldName = `Coverage${category}`;

    await Population.updateMany({}, { $set: { [fieldName]: false } });

    for (const f of facilities) {
      await Population.updateMany(
        {
          geometry: {
            $geoWithin: {
              $centerSphere: [f.geometry.coordinates, f.radius / 6371],
            },
          },
        },
        { $set: { [fieldName]: true } }
      );
    }

    const agg = await Population.aggregate([
      { $match: { [fieldName]: true } },
      { $group: { _id: null, total: { $sum: "$population" } } },
    ]);

    console.log(`Hasil agregasi untuk ${category}:`, agg);

    return agg[0]?.total || 0;
  } catch (error) {
    console.error(
      `Error di calcCoverageUnion untuk kategori ${category}:`,
      error
    );
    return 0;
  }
};
const calcHappinessIndex = async () => {
  const totalPopAgg = await Population.aggregate([
    { $group: { _id: null, total: { $sum: "$population" } } },
  ]);
  const totalPop = totalPopAgg[0]?.total;
  const [health, police, park, fire] = await Promise.all([
    calcCoverageUnion("Health"),
    calcCoverageUnion("Police"),
    calcCoverageUnion("Park"),
    calcCoverageUnion("Fire"),
  ]);

  const healthCoverage = (health / totalPop) * 100;
  const policeCoverage = (police / totalPop) * 100;
  const parkCoverage = (park / totalPop) * 100;

  const scoreHealth = healthCoverage / 100;
  const scorePolice = policeCoverage / 100;
  const scorePark = parkCoverage / 100;
  const scoreDamkar = damkarCoverage / 100;

  const HI =
    scoreHealth * 0.3 + scorePolice * 0.3 + scorePark * 0.2 + scoreDamkar * 0.2;

  console.log({
    healthCoverage,
    policeCoverage,
    parkCoverage,
    happinessIndex: HI * 100,
  });

  return {
    healthCoverage,
    policeCoverage,
    parkCoverage,
    happinessIndex: HI * 100,
  };
};

module.exports = {
  getAllHostipals,
  getAllPolice,
  getAllPark,
  getAllFireStation,
  calcCoveragePerFacility,
  calcCoverageUnion,
  calcHappinessIndex,
};
