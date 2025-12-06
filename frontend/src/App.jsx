import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import RightPanel from './components/layout/RightPanel';
import MapComponent from './components/map/MapComponent';
import DashboardPanel from './components/dashboard/DashboardPanel';
import MLPanel from './components/dashboard/MLPanel';
import CitizenReportsPanel from './components/dashboard/CitizenReportsPanel';

function App() {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [layers] = useState({
    citizenReports: { name: 'Citizen Reports', visible: true },
    hospitals: { name: 'Hospitals', visible: true },
    policeStations: { name: 'Police Stations', visible: true },
    parks: { name: 'Parks', visible: false },
    fireStations: { name: 'Fire Stations', visible: false },
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleFeatureSelect = (feature) => {
    setSelectedFeature(feature);
  };

  const handlePanelClose = () => {
    setSelectedFeature(null);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-cyber-background">
      {/* Scanline overlay */}
      <div className="scanline" />
      
      {/* Top Status Bar */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-cyber-surface/80 backdrop-blur-md border-b-2 border-cyber-primary/50 z-30 flex items-center justify-between px-6">
        <div className="flex items-center space-x-8">
          {/* Logo Urbania & TechnoFest */}
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold">
              <span className="text-cyber-primary">URBANIA</span>
              <span className="text-cyber-text-secondary text-xl mx-2">|</span>
              <span className="text-cyber-accent">TECHNOFEST</span>
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-cyber-primary font-bold text-sm">SYSTEM ONLINE</span>
          </div>
          <div className="text-cyber-text-secondary text-xs">
            LOCATION: SINGAPORE | LAT: 1.3521° | LON: 103.8198°
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-cyber-accent text-xs font-mono">
            {currentTime.toLocaleTimeString('en-US', { hour12: false })}
          </div>
          <div className="text-cyber-text-secondary text-xs">
            {currentTime.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
          </div>
        </div>
      </div>

      <MapComponent layers={layers} onFeatureSelect={handleFeatureSelect} />
      
      <DashboardPanel />
      <MLPanel />

      <AnimatePresence>
        {selectedFeature && (
          <RightPanel selectedFeature={selectedFeature} onClose={handlePanelClose} />
        )}
      </AnimatePresence>
    </main>
  );
}

export default App;
