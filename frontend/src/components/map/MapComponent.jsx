import React, { useState, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAP_STYLE = 'https://api.maptiler.com/maps/dataviz-dark/style.json?key=bHugMNOqlxpfGbxfkpO4';

const MapComponent = ({ layers }) => {
  const [viewState, setViewState] = useState({
    longitude: 103.8198,
    latitude: 1.3521,
    zoom: 11
  });
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [police, setPolice] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hospitalsRes, policeRes] = await Promise.all([
          fetch('/data/hospitals.json').then(r => r.json()),
          fetch('/data/police.json').then(r => r.json())
        ]);
        setHospitals(hospitalsRes);
        setPolice(policeRes);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-cyber-background">
        <p className="text-cyber-accent text-2xl animate-flicker">Loading Map Data...</p>
      </div>
    );
  }

  return (
    <Map
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      style={{ width: '100%', height: '100%' }}
      mapStyle={MAP_STYLE}
      maxBounds={[[103.5, 1.17], [104.1, 1.55]]}
      minZoom={9}
      maxZoom={18}
    >

      {/* Hospital Markers */}
      {layers.hospitals?.visible && hospitals.map((hospital, idx) => (
        hospital.geometry?.coordinates && (
          <Marker
            key={`hospital-${idx}`}
            longitude={hospital.geometry.coordinates[0]}
            latitude={hospital.geometry.coordinates[1]}
            onClick={e => {
              e.originalEvent.stopPropagation();
              setSelectedMarker({ type: 'hospital', data: hospital });
            }}
          >
            <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-neon-secondary flex items-center justify-center cursor-pointer hover:scale-125 transition-transform">
              <span className="text-white text-lg">🏥</span>
            </div>
          </Marker>
        )
      ))}

      {/* Police Markers */}
      {layers.policeStations?.visible && police.map((station, idx) => (
        station.geometry?.coordinates && (
          <Marker
            key={`police-${idx}`}
            longitude={station.geometry.coordinates[0]}
            latitude={station.geometry.coordinates[1]}
            onClick={e => {
              e.originalEvent.stopPropagation();
              setSelectedMarker({ type: 'police', data: station });
            }}
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-neon-primary flex items-center justify-center cursor-pointer hover:scale-125 transition-transform">
              <span className="text-white text-lg">🚔</span>
            </div>
          </Marker>
        )
      ))}

      {/* Popup */}
      {selectedMarker && (
        <Popup
          longitude={selectedMarker.data.geometry?.coordinates[0] || 103.8198}
          latitude={selectedMarker.data.geometry?.coordinates[1] || 1.3521}
          onClose={() => setSelectedMarker(null)}
          closeButton={true}
          closeOnClick={false}
        >
          <div className="p-2">
            <h3 className="text-cyber-primary font-bold text-lg mb-2">
              {selectedMarker.data.name || 'Facility'}
            </h3>
            <p className="text-cyber-text-secondary text-sm">
              Type: <span className="text-cyber-accent">{selectedMarker.type}</span>
            </p>
            {selectedMarker.data.amenity && (
              <p className="text-cyber-text-primary text-sm">
                {selectedMarker.data.amenity}
              </p>
            )}
            {selectedMarker.data.STREET_NAME && (
              <p className="text-cyber-text-primary text-sm mt-2">
                {selectedMarker.data.STREET_NAME}
              </p>
            )}
          </div>
        </Popup>
      )}
    </Map>
  );
};

export default MapComponent;
