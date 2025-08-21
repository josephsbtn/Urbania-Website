import React, { useState, useEffect } from "react";
import { Smile, Sun, Wind, Droplets, Zap } from "lucide-react";
import { mockAPI } from "../services/api";
import axios from "axios";

export default function StatusCards() {
  const [aqi, setAqi] = useState({ value: 0, status: "Loading..." });
  const [uvIndex, setUvIndex] = useState({ value: 0, status: "Loading..." });
  const [happinessIndex, setHappinessIndex] = useState({
    value: 0,
    status: "Loading...",
  });
  const [forecast, setForecast] = useState({ water: "...", electric: "..." });
  const [loading, setLoading] = useState(true);
  const [loadingForecast, setLoadingForecast] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [aqiData, uvData, happinessData] = await Promise.all([
          mockAPI.getAQI(),
          mockAPI.getUVIndex(),
          mockAPI.getHappinessIndex(),
        ]);
        setAqi(aqiData);
        setUvIndex(uvData);
        setHappinessIndex(happinessData);
      } catch (error) {
        console.error("Error loading status data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchForecast = async () => {
      try {
        const res = await axios.get("http://localhost:8000/predict/forecast");
        setForecast({
          water: res.data.result.water,
          elec: res.data.result.elec,
        });
      } catch (error) {
        setForecast({
          water: { year1: "N/A", year3: "N/A" },
          elec: { menit30: "N/A", jam1: "N/A", jam3: "N/A" },
        });
      } finally {
        setLoadingForecast(false);
      }
    };

    loadData();
    fetchForecast();
  }, []);

  const getAQIColor = (value) => {
    if (value <= 50) return "text-green-600";
    if (value <= 100) return "text-yellow-600";
    if (value <= 150) return "text-orange-600";
    return "text-red-600";
  };

  const getUVColor = (value) => {
    if (value <= 3) return "text-green-600";
    if (value <= 6) return "text-yellow-600";
    if (value <= 9) return "text-orange-600";
    return "text-red-600";
  };

  const getHappinessColor = (value) => {
    if (value >= 80) return "text-green-600";
    if (value >= 60) return "text-yellow-600";
    return "text-orange-600";
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-white p-4 rounded-2xl shadow-md text-center">
          <Wind className="mx-auto text-blue-500 mb-2" />
          <h3 className="font-bold text-sm text-gray-600">Air Quality</h3>
          <p className={`text-2xl font-bold ${getAQIColor(aqi.value)}`}>
            {loading ? "..." : aqi.value}
          </p>
          <p className="text-gray-500 text-sm">{aqi.status}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-md text-center">
          <Smile className="mx-auto text-green-500 mb-2" />
          <h3 className="font-bold text-sm text-gray-600">Happiness Index</h3>
          <p
            className={`text-2xl font-bold ${getHappinessColor(
              happinessIndex.value
            )}`}>
            {loading ? "..." : happinessIndex.value.toFixed(2)}
          </p>
          <p className="text-gray-500 text-sm">{happinessIndex.status}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-md text-center">
          <Sun className="mx-auto text-yellow-500 mb-2" />
          <h3 className="font-bold text-sm text-gray-600">UV Index</h3>
          <p className={`text-2xl font-bold ${getUVColor(uvIndex.value)}`}>
            {loading ? "..." : uvIndex.value}
          </p>
          <p className="text-gray-500 text-sm">{uvIndex.status}</p>
        </div>
      </div>

      {/* Forecasting Card */}
       <div className="mt-4">
        <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <Droplets className="text-blue-400 w-8 h-8" />
              <div>
                <div className="text-gray-600 font-semibold">Forecast Water</div>
              </div>
            </div>
            <div className="flex flex-col text-sm text-blue-700 font-bold mt-2">
              <span>
                Year 1: {loadingForecast ? "..." : forecast.water?.year1} kiloliter
              </span>
              <span>
                Year 3: {loadingForecast ? "..." : forecast.water?.year3} kiloliter
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <Zap className="text-yellow-400 w-8 h-8" />
              <div>
                <div className="text-gray-600 font-semibold">Forecast Electric</div>
              </div>
            </div>
            <div className="flex flex-col text-sm text-yellow-700 font-bold mt-2">
              <span>
                30 min: {loadingForecast ? "..." : forecast.elec?.menit30} KwH
              </span>
              <span>
                1 hour: {loadingForecast ? "..." : forecast.elec?.jam1} KwH
              </span>
              <span>
                3 hours: {loadingForecast ? "..." : forecast.elec?.jam3} KwH
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}