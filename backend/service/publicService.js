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
    const chached = await Redis.get("park");
    if (chached) {
      return chached;
    }
    const result = await FireStation.find({});
    await Redis.set("park", result);
    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const calcCoveragePerFacility = async (category) => {
  let facilities;
  if (category === "Health") {
    facilities = await Hospital.find({});
  }
  if (condition === "Police") {
    facilities = await Police.find({});
  }
  if (condition === "Park") {
    facilities = await Park.find({});
  }
  if (condition === "Fire") {
    facilities = await FireStation.find({});
  }

  for (const f of facilities) {
    const covered = await Population.aggregate([
      {
        $geoNear: {
          near: f.loc,
          distanceField: "dist",
          maxDistance: f.radius * 1000,
          spherical: true,
        },
      },
      { $group: { _id: null, total: { $sum: "$population" } } },
    ]);

    results.push({
      facility_id: f._id,
      name: f.name,
      category: f.category,
      radius_km: f.radius_km,
      covered_population: covered[0]?.total.round() || 0,
    });
  }

  if (category === "Health") {
    await Hospital.findByIdAndUpdate(r.facility_id, {
      covered_population: r.covered_population,
    });
  }
  if (condition === "Police") {
    await Police.findByIdAndUpdate(r.facility_id, {
      covered_population: r.covered_population,
    });
  }
  if (condition === "Park") {
    await Park.findByIdAndUpdate(r.facility_id, {
      covered_population: r.covered_population,
    });
  }
  if (condition === "Fire") {
    await FireStation.findByIdAndUpdate(r.facility_id, {
      covered_population: r.covered_population,
    });
  }
};

const calcCoverageUnion = async (category) => {
  let facilities;
  if (category === "Health") {
    facilities = await Hospital.find({});
  }
  if (condition === "Police") {
    facilities = await Police.find({});
  }
  if (condition === "Park") {
    facilities = await Park.find({});
  }
  if (condition === "Fire") {
    facilities = await FireStation.find({});
  }

  await Population.updateMany({}, { $set: { [`covered_${category}`]: false } });

  for (const f of facilities) {
    await Population.updateMany(
      {
        loc: {
          $geoWithin: {
            $centerSphere: [f.loc.coordinates, f.radius_km / 6371],
          },
        },
      },
      { $set: { [`covered_${category}`]: true } }
    );
  }

  const agg = await Population.aggregate([
    { $match: { [`covered_${category}`]: true } },
    { $group: { _id: null, total: { $sum: "$population" } } },
  ]);

  return agg[0]?.total || 0;
};
const calcHappinessIndex = async () => {
  const totalPopAgg = await Population.aggregate([
    { $group: { _id: null, total: { $sum: "$population" } } },
  ]);
  const totalPop = totalPopAgg[0].total;
  const health = await calcCoverageUnion("health");
  const police = await calcCoverageUnion("police");
  const park = await calcCoverageUnion("park");

  const healthCoverage = (health / totalPop) * 100;
  const policeCoverage = (police / totalPop) * 100;
  const parkCoverage = (park / totalPop) * 100;

  const scoreHealth = healthCoverage / 100;
  const scorePolice = policeCoverage / 100;
  const scorePark = parkCoverage / 100;

  const HI = scoreHealth * 0.4 + scorePolice * 0.3 + scorePark * 0.3;

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
  calcCoveragePerFacility,
  calcCoverageUnion,
  calcHappinessIndex,
};
