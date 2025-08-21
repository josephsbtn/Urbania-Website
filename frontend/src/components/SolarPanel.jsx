import React, { useState, useEffect } from "react";
import { Smile, Sun, Wind } from "lucide-react";
import { mockAPI } from "../services/api";
import axios from "axios";

export default function SolarPanel() {
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [error, setError] = useState(null);
  const [solarData, setSolarData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

const getSolarPanelData = async () => {
  try {
    setIsLoading(true);

    const { lat, lon } = await getLocation(); // sekarang dapat koordinat langsung

    console.log("Latitude:", lat);
    console.log("Longitude:", lon);

    const response = await axios.get(
      `http://127.0.0.1:8000/predict/solar/${lon}/${lat}`
    );
    console.log("Solar API Response:", response.data);

    setSolarData(response.data.result);
    setError(null);
  } catch (error) {
    console.error("Error fetching solar panel data:", error);
    setError(error.message || "Failed to fetch solar panel data");
  } finally {
    setIsLoading(false);
  }
};


const getLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          resolve(coords);
        },
        (err) => {
          reject(err);
        }
      );
    }
  });
};


  return (
    <div className="flex flex-col items-start justify-start">
      <h1 className="font-bold text-xl">
        Thinking of Installing Solar Panels?
      </h1>
      <p className="text-gray-600 mb-4">
        Click <span className="font-bold">Start</span> to discover how much kWh
        you can generate from your rooftop!
      </p>
      <button
        onClick={getSolarPanelData}
        className="p-2 rounded-xl border flex justify-around items-center hover:bg-yellow-400 hover:text-black transition-colors duration-300">
        <Sun className="w-6 h-6" />
        <h1 className="font-semibold px-2">Start</h1>
      </button>
      {isLoading ? (
        <p>Loading...</p>
      ) : solarData ? (
        <div className="mt-4">
          <p className="text-gray-600">
            You can generate <span className="font-bold">{solarData.estimated} KwH</span> kWh
            of energy from your rooftop!
          </p>
        </div>
      ) : null}
    </div>
  );
}
