import React, { useRef, useEffect, useState } from "react";
import Map, { Marker, Source, Layer } from "react-map-gl";
import { publicServiceAPI } from "../services/api";

const MAPBOX_TOKEN =
  "pk.eyJ1Ijoibm9sYW5ncmFwaHkiLCJhIjoiY21jYTdpbjNvMDBobDJtb2dwdWpveGE4YSJ9.bIOmIILeMml2GL-Qirzb-Q"; // Replace with your Mapbox token

// Example heatmap data (GeoJSON)
const heatmapData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [103.84599241787274, 1.2764667798682217], // [longitude, latitude]
      },
      properties: { mag: 5 },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [103.8450, 1.2760],
      },
      properties: { mag: 3 },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [103.8555, 1.2835],
      },
      properties: { mag: 4 },
    },
    // Add more features as needed
  ],
};

const heatmapLayer = {
  id: "heatmap",
  type: "heatmap",
  source: "heatmap",
  paint: {
    "heatmap-weight": ["interpolate", ["linear"], ["get", "mag"], 0, 0, 6, 1],
    "heatmap-intensity": 1,
    "heatmap-radius": 30,
    "heatmap-opacity": 0.6,
  },
};

export default function MapSection() {
  // Add CSS styles for hover effects
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .hospital-marker:hover > div:nth-child(2) {
        transform: scale(1.1) !important;
      }
      
      .police-marker:hover > div:nth-child(2) {
        transform: scale(1.1) !important;
      }
      
      .hospital-marker:hover .hospital-label {
        opacity: 1 !important;
      }
      
      .police-marker:hover .police-label {
        opacity: 1 !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const mapRef = useRef();
  const [marker, setMarker] = useState({
    longitude: 103.8545,
    latitude: 1.2831,
  });
  const [hospitals, setHospitals] = useState([]);
  const [policeStations, setPoliceStations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load public service data
  useEffect(() => {
    const loadPublicServiceData = async () => {
      try {
        setLoading(true);
        
        // Load hospitals and police stations
        const [hospitalsData, policeData] = await Promise.all([
          publicServiceAPI.getHospitals(),
          publicServiceAPI.getPoliceStations(),
        ]);

        setHospitals(hospitalsData.result || []);
        setPoliceStations(policeData.result || []);
      } catch (error) {
        console.error('Error loading public service data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPublicServiceData();
  }, []);

  const handleMapClick = (event) => {
    console.log("Map clicked!", event);
    
    try {
      let lng, lat;

      // Handle different event structures
      if (event.lngLat) {
        lng = event.lngLat.lng;
        lat = event.lngLat.lat;
      }

      console.log("Coordinates:", lng, lat);

      // Validate coordinates and check if they're within Singapore bounds
      if (
        typeof lng === "number" &&
        typeof lat === "number" &&
        !isNaN(lng) &&
        !isNaN(lat) &&
        lng >= 103.6 &&
        lng <= 104.1 &&
        lat >= 1.15 &&
        lat <= 1.48
      ) {
        setMarker({ longitude: lng, latitude: lat });
        console.log("Marker placed at:", lng, lat);
      } else {
        console.log("Click outside Singapore bounds or invalid coordinates:", lng, lat);
      }
    } catch (error) {
      console.error("Error handling map click:", error);
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes bounce {
            0% { transform: translateY(-20px) scale(0.8); opacity: 0; }
            50% { transform: translateY(-10px) scale(1.1); }
            100% { transform: translateY(0) scale(1); opacity: 1; }
          }
          
          @keyframes pulse {
            0% { transform: rotate(-45deg) scale(1); opacity: 0.6; }
            50% { transform: rotate(-45deg) scale(1.2); opacity: 0.3; }
            100% { transform: rotate(-45deg) scale(1.4); opacity: 0; }
          }
        `}
      </style>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "400px",
          borderRadius: "16px",
          boxShadow: "0 2px 8px #ccc",
          overflow: "hidden",
        }}
      >
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: 103.8545,
          latitude: 1.2831,
          zoom: 15,
        }}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
        onClick={handleMapClick}
      >
        {/* Heatmap Layer */}
        <Source id="heatmap" type="geojson" data={heatmapData}>
          <Layer {...heatmapLayer} />
        </Source>
        {/* Marker based on click location */}
        <Marker
          longitude={marker.longitude}
          latitude={marker.latitude}
          anchor="bottom"
        >
          <div style={{
            position: 'relative',
            cursor: 'pointer',
            transform: 'translate(-50%, -100%)',
          }}>
            {/* Pin Shadow */}
            <div style={{
              position: 'absolute',
              bottom: '-5px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '20px',
              height: '6px',
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '50%',
              filter: 'blur(2px)',
            }} />
            
            {/* Main Pin */}
            <div style={{
              position: 'relative',
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #ff4757, #c44569)',
              borderRadius: '50% 50% 50% 0',
              transform: 'rotate(-45deg)',
              border: '3px solid white',
              boxShadow: '0 4px 12px rgba(255, 71, 87, 0.4)',
              animation: 'bounce 0.6s ease-out',
            }}>
              {/* Inner circle */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotate(45deg)',
                width: '16px',
                height: '16px',
                background: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: '#ff4757',
                  borderRadius: '50%',
                }} />
              </div>
            </div>
            
            {/* Pulse effect */}
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '40px',
              height: '40px',
              borderRadius: '50% 50% 50% 0',
              transform: 'rotate(-45deg)',
              border: '2px solid #ff4757',
              animation: 'pulse 2s infinite',
              opacity: '0.6',
            }} />
          </div>
        </Marker>
        
        {/* Hospital Markers */}
        {hospitals.map((hospital, index) => (
          hospital.geometry && hospital.geometry.coordinates ? (
            <Marker
              key={`hospital-${index}`}
              longitude={hospital.geometry.coordinates[0]}
              latitude={hospital.geometry.coordinates[1]}
              anchor="center"
            >
              <div 
                className="hospital-marker"
                style={{
                position: 'relative',
                cursor: 'pointer',
              }}>
                {/* Hospital marker shadow */}
                <div style={{
                  position: 'absolute',
                  bottom: '-3px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '16px',
                  height: '4px',
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: '50%',
                  filter: 'blur(1px)',
                }} />
                
                {/* Hospital marker */}
                <div style={{ 
                  background: 'linear-gradient(135deg, #10b981, #059669)', 
                  borderRadius: '50%', 
                  width: '32px', 
                  height: '32px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: '3px solid white',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                  transition: 'transform 0.2s ease',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3V8zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/>
                  </svg>
                </div>
                
                {/* Hospital label */}
                <div style={{
                  position: 'absolute',
                  top: '38px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(16, 185, 129, 0.9)',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  opacity: '0',
                  transition: 'opacity 0.2s ease',
                  pointerEvents: 'none',
                }}
                className="hospital-label"
                >
                  {hospital.name || 'Hospital'}
                </div>
              </div>
            </Marker>
          ) : null
        ))}
        
        {/* Police Station Markers */}
        {policeStations.map((police, index) => (
          police.geometry && police.geometry.coordinates ? (
            <Marker
              key={`police-${index}`}
              longitude={police.geometry.coordinates[0]}
              latitude={police.geometry.coordinates[1]}
              anchor="center"
            >
              <div 
                className="police-marker"
                style={{
                position: 'relative',
                cursor: 'pointer',
              }}>
                {/* Police marker shadow */}
                <div style={{
                  position: 'absolute',
                  bottom: '-3px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '16px',
                  height: '4px',
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: '50%',
                  filter: 'blur(1px)',
                }} />
                
                {/* Police marker */}
                <div style={{ 
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
                  borderRadius: '50%', 
                  width: '32px', 
                  height: '32px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: '3px solid white',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                  transition: 'transform 0.2s ease',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                  </svg>
                </div>
                
                {/* Police label */}
                <div style={{
                  position: 'absolute',
                  top: '38px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(59, 130, 246, 0.9)',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  opacity: '0',
                  transition: 'opacity 0.2s ease',
                  pointerEvents: 'none',
                }}
                className="police-label"
                >
                  {police.name || 'Police Station'}
                </div>
              </div>
            </Marker>
          ) : null
        ))}
      </Map>
      
      {/* Loading indicator */}
      {loading && (
        <div style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          background: "rgba(255,255,255,0.9)",
          padding: "8px 12px",
          borderRadius: "8px",
          fontSize: "14px",
          zIndex: 30
        }}>
          Loading...
        </div>
      )}
    </div>
    </>
  );
}
