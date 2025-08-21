import React, { useState, useEffect } from "react";
import { Smile, Sun, Wind } from "lucide-react";
import { mockAPI } from "../services/api";
import axios from "axios";

export default function SolarPanel() {
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [error, setError] = useState(null);
  const [solarData, setSolarData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getSolarPanelData = async () => {
    try {
      setIsLoading(true);

      await getLocation();

      const { lat, lon } = location;

      const response = await axios.get(
        `http://127.0.0.1:5000/predict/solar/${lon}/${lat}`
      );

      setSolarData(response.data.result);
      console.log("Solar API Response:", response.data);
    } catch (error) {
      console.error("Error fetching solar panel data:", error);
      setError(error.message || "Failed to fetch solar panel data");
    } finally {
      setIsLoading(false);
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setError(null);
      },
      (err) => {
        setError(err.message);
      }
    );
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
            You can generate <span className="font-bold">{solarData}</span> kWh
            of energy from your rooftop!
          </p>
        </div>
      ) : null}
    </div>
  );
}
