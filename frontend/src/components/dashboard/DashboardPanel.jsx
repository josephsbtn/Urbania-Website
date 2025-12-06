import React, { useState, useEffect } from 'react';
import { getAnalytics } from '../../services/api';

const DashboardPanel = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await getAnalytics();
        setAnalytics(data);
        setLastUpdate(new Date());
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-cyber-surface/80 backdrop-blur-md border border-cyber-primary/50">
        <p className="text-cyber-accent animate-pulse">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-cyber-surface/80 backdrop-blur-md border border-red-500/50">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="absolute top-20 right-4 w-80 z-20 space-y-2">
      {/* Real-time Status Indicator */}
      <div className="bg-cyber-surface/90 backdrop-blur-md border border-cyber-primary/50 px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-cyber-primary text-xs font-mono">REAL-TIME</span>
          </div>
          <span className="text-cyber-text-secondary text-[10px]">
            {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Happiness Index */}
      <div className="bg-cyber-surface/90 backdrop-blur-md border-2 border-cyber-primary/50 p-4 shadow-neon-primary">
        <h3 className="text-cyber-primary font-bold text-lg mb-2">😊 Happiness Index</h3>
        <div className="text-4xl font-bold text-cyber-accent">
          {analytics?.happiness && !isNaN(analytics.happiness) ? `${(analytics.happiness * 100).toFixed(1)}%` : '75.0%'}
        </div>
      </div>

      {/* Facilities Count */}
      <div className="bg-cyber-surface/90 backdrop-blur-md border-2 border-cyber-secondary/50 p-4 shadow-neon-secondary">
        <h3 className="text-cyber-secondary font-bold text-lg mb-3">🏢 City Facilities</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-cyber-text-secondary">🏥 Hospitals:</span>
            <span className="text-cyber-text-primary font-bold">{analytics?.facilities.hospitals || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cyber-text-secondary">🚔 Police Stations:</span>
            <span className="text-cyber-text-primary font-bold">{analytics?.facilities.police || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cyber-text-secondary">🌳 Parks:</span>
            <span className="text-cyber-text-primary font-bold">{analytics?.facilities.parks || 0}</span>
          </div>
        </div>
      </div>

      {/* Weather */}
      {analytics?.weather && (
        <div className="bg-cyber-surface/90 backdrop-blur-md border-2 border-cyber-accent/50 p-4">
          <h3 className="text-cyber-accent font-bold text-lg mb-2">🌤️ Weather</h3>
          <div className="text-cyber-text-primary text-sm space-y-1">
            <p>Temp: <span className="text-cyber-accent font-bold">{analytics.weather.temp}°C</span></p>
            {analytics.weather.uvIndex && analytics.weather.uvLabel && (
              <p className="text-cyber-text-secondary text-xs">
                UV: <span className="text-cyber-accent font-bold">{analytics.weather.uvIndex}</span> ({analytics.weather.uvLabel})
              </p>
            )}
            {analytics.weather.aqi && (
              <p>AQI: <span className="text-cyber-accent font-bold">
                {typeof analytics.weather.aqi === 'object' ? analytics.weather.aqi.aqi : analytics.weather.aqi}
              </span> <span className="text-cyber-text-secondary text-xs">({analytics.weather.status})</span></p>
            )}
          </div>
        </div>
      )}

      {/* Forecast */}
      {analytics?.forecast && (
        <div className="bg-cyber-surface/90 backdrop-blur-md border-2 border-cyber-primary/50 p-4">
          <h3 className="text-cyber-primary font-bold text-lg mb-2">📊 Forecast</h3>
          <div className="text-cyber-text-primary text-sm">
            <p>Next period prediction available</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPanel;
