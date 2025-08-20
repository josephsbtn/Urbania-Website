import React, { useState, useEffect } from "react";
import { Smile, Sun, Wind } from "lucide-react";
import { mockAPI } from "../services/api";

export default function StatusCards() {
  const [aqi, setAqi] = useState({ value: 0, status: 'Loading...' });
  const [uvIndex, setUvIndex] = useState({ value: 0, status: 'Loading...' });
  const [happinessIndex, setHappinessIndex] = useState({ value: 0, status: 'Loading...' });
  const [loading, setLoading] = useState(true);

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
        console.error('Error loading status data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getAQIColor = (value) => {
    if (value <= 50) return 'text-green-600';
    if (value <= 100) return 'text-yellow-600';
    if (value <= 150) return 'text-orange-600';
    return 'text-red-600';
  };

  const getUVColor = (value) => {
    if (value <= 2) return 'text-green-600';
    if (value <= 5) return 'text-yellow-600';
    if (value <= 7) return 'text-orange-600';
    return 'text-red-600';
  };

  const getHappinessColor = (value) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <div className="grid grid-cols-3 gap-4 mt-4">
      <div className="bg-white p-4 rounded-2xl shadow-md text-center">
        <Wind className="mx-auto text-blue-500 mb-2" />
        <h3 className="font-bold text-sm text-gray-600">Air Quality</h3>
        <p className={`text-2xl font-bold ${getAQIColor(aqi.value)}`}>
          {loading ? '...' : aqi.value}
        </p>
        <p className="text-gray-500 text-sm">{aqi.status}</p>
      </div>
      
      <div className="bg-white p-4 rounded-2xl shadow-md text-center">
        <Smile className="mx-auto text-green-500 mb-2" />
        <h3 className="font-bold text-sm text-gray-600">Happiness Index</h3>
        <p className={`text-2xl font-bold ${getHappinessColor(happinessIndex.value)}`}>
          {loading ? '...' : happinessIndex.value}
        </p>
        <p className="text-gray-500 text-sm">{happinessIndex.status}</p>
      </div>
      
      <div className="bg-white p-4 rounded-2xl shadow-md text-center">
        <Sun className="mx-auto text-yellow-500 mb-2" />
        <h3 className="font-bold text-sm text-gray-600">UV Index</h3>
        <p className={`text-2xl font-bold ${getUVColor(uvIndex.value)}`}>
          {loading ? '...' : uvIndex.value}
        </p>
        <p className="text-gray-500 text-sm">{uvIndex.status}</p>
      </div>
    </div>
  );
}
