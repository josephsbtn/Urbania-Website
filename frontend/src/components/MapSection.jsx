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
      .park-marker:hover > div:nth-child(2) {
        transform: scale(1.1) !important;
      }
      .fire-marker:hover > div:nth-child(2) {
        transform: scale(1.1) !important;
      }
      .hospital-marker:hover .hospital-label {
        opacity: 1 !important;
      }
      .police-marker:hover .police-label {
        opacity: 1 !important;
      }
      .park-marker:hover .park-label {
        opacity: 1 !important;
      }
      .fire-marker:hover .fire-label {
        opacity: 1 !important;
      }
      .clicked-marker:hover .marker-tooltip {
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

  // State and refs
  const mapRef = useRef(null);
  const [marker, setMarker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [policeStations, setPoliceStations] = useState([]);
  const [parks, setParks] = useState([]);
  const [fireStations, setFireStations] = useState([]);

  // Fetch public services data
  useEffect(() => {
    setLoading(true);
    publicServiceAPI.getAll()
      .then((data) => {
        setHospitals(data.hospitals || []);
        setPoliceStations(data.policeStations || []);
        setParks(data.parks || []);
        setFireStations(data.fireStations || []);
      })
      .catch(() => {
        setHospitals([]);
        setPoliceStations([]);
        setParks([]);
        setFireStations([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Map click handler
  const handleMapClick = (e) => {
    if (e && e.lngLat) {
      setMarker({
        longitude: e.lngLat.lng,
        latitude: e.lngLat.lat,
      });
    }
  };

  return (
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
        cursor="crosshair"
      >
        {/* Heatmap Layer */}
        <Source id="heatmap" type="geojson" data={heatmapData}>
          <Layer {...heatmapLayer} />
        </Source>
        
        {/* Marker based on click location (stable during zoom) */}
        {marker && (
          <Marker
            longitude={marker.longitude}
            latitude={marker.latitude}
            anchor="bottom"
          >
            <div style={{ width: 0, height: 0, position: 'relative' }}>
              <div
                className="clicked-marker"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 40,
                  height: 40,
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  position: 'absolute',
                  bottom: '-3px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 20,
                  height: 6,
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: '50%',
                  filter: 'blur(2px)',
                }} />

                <div style={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                }}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #ff4757, #c44569)',
                    borderRadius: '50% 50% 50% 0',
                    transform: 'rotate(-45deg)',
                    border: '3px solid white',
                    boxShadow: '0 4px 12px rgba(255, 71, 87, 0.4)',
                    animation: 'bounce 0.6s ease-out',
                  }} />

                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) rotate(45deg)',
                    width: 16,
                    height: 16,
                    background: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <div style={{ width: 8, height: 8, background: '#ff4757', borderRadius: '50%' }} />
                  </div>
                </div>

                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '50% 50% 50% 0',
                  transform: 'rotate(-45deg)',
                  border: '2px solid #ff4757',
                  animation: 'pulse 2s infinite',
                  opacity: 0.6,
                }} />

                <div
                  style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 8px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0, 0, 0, 0.8)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: 12,
                    whiteSpace: 'nowrap',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    pointerEvents: 'none',
                    zIndex: 1000,
                  }}
                  className="marker-tooltip"
                >
                  {marker.latitude.toFixed(6)}, {marker.longitude.toFixed(6)}
                </div>
              </div>
            </div>
          </Marker>
        )}
        
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

        {/* Park Markers */}
        {parks.map((park, index) => (
          park.geometry && park.geometry.coordinates ? (
            <Marker
              key={`park-${index}`}
              longitude={park.geometry.coordinates[0]}
              latitude={park.geometry.coordinates[1]}
              anchor="center"
            >
              <div 
                className="park-marker"
                style={{
                position: 'relative',
                cursor: 'pointer',
              }}>
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
                
                <div style={{ 
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)', 
                  borderRadius: '50%', 
                  width: '32px', 
                  height: '32px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: '3px solid white',
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
                  transition: 'transform 0.2s ease',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
                  </svg>
                </div>
                
                <div style={{
                  position: 'absolute',
                  top: '38px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(34, 197, 94, 0.9)',
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
                className="park-label"
                >
                  {park.name || 'Park'}
                </div>
              </div>
            </Marker>
          ) : null
        ))}

        {/* Fire Station Markers */}
        {fireStations.map((fireStation, index) => (
          fireStation.geometry && fireStation.geometry.coordinates ? (
            <Marker
              key={`fire-${index}`}
              longitude={fireStation.geometry.coordinates[0]}
              latitude={fireStation.geometry.coordinates[1]}
              anchor="center"
            >
              <div 
                className="fire-marker"
                style={{
                position: 'relative',
                cursor: 'pointer',
              }}>
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
                
                <div style={{ 
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)', 
                  borderRadius: '50%', 
                  width: '32px', 
                  height: '32px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: '3px solid white',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
                  transition: 'transform 0.2s ease',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 14.22C9.11 14.32 9.15 14.42 9.15 14.55C9.15 14.68 9.07 14.82 8.94 14.82C8.81 14.82 8.73 14.68 8.68 14.55C8.4 13.41 8.4 12.24 8.68 11.1C8.1 11.87 7.8 12.75 7.8 13.64C7.8 15.57 8.79 17.25 10.3 18.24C10.5 18.37 10.71 18.5 10.94 18.6C11.27 18.74 11.64 18.81 12 18.81C13.85 18.81 15.55 17.8 16.5 16.28C17.66 14.37 17.66 11.95 17.66 11.2Z"/>
                  </svg>
                </div>
                
                <div style={{
                  position: 'absolute',
                  top: '38px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(239, 68, 68, 0.9)',
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
                className="fire-label"
                >
                  {fireStation.name || 'Fire Station'}
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
      
      {/* Pin placement indicator */}
      {marker && (
        <div style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          background: "rgba(255, 71, 87, 0.9)",
          color: "white",
          padding: "8px 12px",
          borderRadius: "8px",
          fontSize: "12px",
          zIndex: 30,
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
        }}>
          📍 Pin placed at {marker.latitude.toFixed(4)}, {marker.longitude.toFixed(4)}
        </div>
      )}
      
      {/* Instructions */}
      {!marker && !loading && (
        <div style={{
          position: "absolute",
          bottom: "16px",
          left: "16px",
          background: "rgba(0,0,0,0.7)",
          color: "white",
          padding: "8px 12px",
          borderRadius: "8px",
          fontSize: "12px",
          zIndex: 30
        }}>
          👆 Click anywhere on the map to place a pin
        </div>
      )}
    </div>
  );
}