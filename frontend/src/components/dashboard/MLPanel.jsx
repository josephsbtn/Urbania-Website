import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MLPanel = () => {
  const [electricForecast, setElectricForecast] = useState(null);
  const [waterForecast, setWaterForecast] = useState(null);
  const [solarData, setSolarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const fetchMLData = async () => {
      try {
        setLoading(true);
        
        // Fetch electricity forecast
        const electricRes = await axios.get('http://127.0.0.1:5000/forecast/electricity');
        setElectricForecast(electricRes.data);

        // Fetch water forecast
        const waterRes = await axios.get('http://127.0.0.1:5000/forecast/water');
        setWaterForecast(waterRes.data);

        // Fetch solar data for Singapore center
        const solarRes = await axios.post('http://127.0.0.1:5000/solar', {
          lat: 1.3521,
          lon: 103.8198
        });
        setSolarData(solarRes.data);

        setLastUpdate(new Date());
      } catch (error) {
        console.error('Error fetching ML data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMLData();
  }, []);

  if (loading) {
    return (
      <div className="absolute bottom-4 left-4 w-96 z-20 bg-cyber-surface/90 backdrop-blur-md border-2 border-cyber-accent/50 p-4">
        <p className="text-cyber-accent animate-pulse">Loading ML Data...</p>
      </div>
    );
  }

  return (
    <div className="absolute bottom-4 left-4 w-96 z-20 space-y-2">
      {/* ML Status */}
      <div className="bg-cyber-surface/90 backdrop-blur-md border border-cyber-accent/50 px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <span className="text-cyber-accent text-xs font-mono">ML PREDICTIONS</span>
          </div>
          <span className="text-cyber-text-secondary text-[10px]">
            {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Electricity Forecast */}
      {electricForecast?.electricity_forecast && (
        <div className="bg-cyber-surface/90 backdrop-blur-md border-2 border-cyber-primary/50 p-4">
          <h3 className="text-cyber-primary font-bold text-sm mb-2 flex items-center">
            <span className="mr-2">⚡</span> Electricity Forecast
          </h3>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-cyber-text-secondary">30 min:</span>
              <span className="text-cyber-accent font-bold">{electricForecast.electricity_forecast.menit30} kWh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyber-text-secondary">1 hour:</span>
              <span className="text-cyber-accent font-bold">{electricForecast.electricity_forecast.jam1} kWh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyber-text-secondary">3 hours:</span>
              <span className="text-cyber-accent font-bold">{electricForecast.electricity_forecast.jam3} kWh</span>
            </div>
          </div>
        </div>
      )}

      {/* Water Forecast */}
      {waterForecast?.water_forecast && (
        <div className="bg-cyber-surface/90 backdrop-blur-md border-2 border-cyber-secondary/50 p-4">
          <h3 className="text-cyber-secondary font-bold text-sm mb-2 flex items-center">
            <span className="mr-2">💧</span> Water Forecast
          </h3>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-cyber-text-secondary">Year 1:</span>
              <span className="text-cyber-secondary font-bold">{waterForecast.water_forecast.year1} m³</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyber-text-secondary">Year 3:</span>
              <span className="text-cyber-secondary font-bold">{waterForecast.water_forecast.year3} m³</span>
            </div>
          </div>
        </div>
      )}

      {/* Solar Estimation */}
      {solarData && (
        <div className="bg-cyber-surface/90 backdrop-blur-md border-2 border-cyber-accent/50 p-4">
          <h3 className="text-cyber-accent font-bold text-sm mb-2 flex items-center">
            <span className="mr-2">☀️</span> Solar Potential
          </h3>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-cyber-text-secondary">Annual Gen:</span>
              <span className="text-cyber-accent font-bold">
                {solarData.estimated_generation_kWh_per_year?.toFixed(0)} kWh/year
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyber-text-secondary">Roof Area:</span>
              <span className="text-cyber-accent font-bold">{solarData.roof_area_m2?.toFixed(0)} m²</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyber-text-secondary">Location:</span>
              <span className="text-cyber-text-secondary text-[10px]">
                {solarData.lat?.toFixed(4)}, {solarData.lon?.toFixed(4)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MLPanel;
