import React, { useRef, useEffect, useState } from "react";
import Map, { Marker, Source, Layer, Popup } from "react-map-gl";
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

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
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
  
  // Popup states
  const [showPopup, setShowPopup] = useState(null);
  const [popupInfo, setPopupInfo] = useState(null);
  const [reportForm, setReportForm] = useState({
    description: '',
    photo: null,
    location: null
  });
  const [notification, setNotification] = useState(null);

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
        
        // Show report creation popup
        setPopupInfo({
          type: 'newReport',
          longitude: lng,
          latitude: lat,
          title: 'Create New Report',
          description: `Report issue at this location`
        });
        setShowPopup('newReport');
        setReportForm({
          description: '',
          photo: null,
          location: { lng, lat }
        });
        
        console.log("Marker placed at:", lng, lat);
      } else {
        console.log("Click outside Singapore bounds or invalid coordinates:", lng, lat);
      }
    } catch (error) {
      console.error("Error handling map click:", error);
    }
  };

  // Handle hospital marker click
  const handleHospitalClick = (hospital) => {
    setPopupInfo({
      type: 'hospital',
      longitude: hospital.geometry.coordinates[0],
      latitude: hospital.geometry.coordinates[1],
      title: hospital.name || 'Hospital',
      description: 'Healthcare facility providing medical services',
      details: {
        type: 'Hospital',
        services: ['Emergency Care', 'Outpatient', 'Specialist Care'],
        contact: '24/7 Emergency Services'
      }
    });
    setShowPopup('hospital');
  };

  // Handle police station marker click
  const handlePoliceClick = (police) => {
    setPopupInfo({
      type: 'police',
      longitude: police.geometry.coordinates[0],
      latitude: police.geometry.coordinates[1],
      title: police.name || 'Police Station',
      description: 'Law enforcement facility for public safety',
      details: {
        type: 'Police Station',
        services: ['Emergency Response', 'Crime Reporting', 'Public Safety'],
        contact: '999 for emergencies'
      }
    });
    setShowPopup('police');
  };

  // Handle report form submission
  const handleReportSubmit = async () => {
    if (!reportForm.description.trim()) {
      setNotification({ type: 'error', message: 'Please enter a description for your report' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('description', reportForm.description);
      formData.append('longitude', reportForm.location.lng);
      formData.append('latitude', reportForm.location.lat);
      if (reportForm.photo) {
        formData.append('photo', reportForm.photo);
      }

      // Simulate API call (replace with actual API)
      console.log('Submitting report:', reportForm);
      
      // Close popup and reset form
      setShowPopup(null);
      setPopupInfo(null);
      setReportForm({ description: '', photo: null, location: null });
      
      // Show success notification
      setNotification({ type: 'success', message: 'Report submitted successfully!' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error submitting report:', error);
      setNotification({ type: 'error', message: 'Failed to submit report. Please try again.' });
      setTimeout(() => setNotification(null), 3000);
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleHospitalClick(hospital);
                }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  handlePoliceClick(police);
                }}
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

        {/* Popups */}
        {showPopup && popupInfo && (
          <Popup
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            closeButton={true}
            closeOnClick={false}
            onClose={() => {
              setShowPopup(null);
              setPopupInfo(null);
            }}
            anchor="bottom"
            maxWidth="320px"
          >
            <div className="p-4 min-w-[280px]">
              {/* Hospital Popup */}
              {popupInfo.type === 'hospital' && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3V8zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{popupInfo.title}</h3>
                      <p className="text-sm text-gray-600">{popupInfo.details.type}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{popupInfo.description}</p>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-600">
                      <strong>Services:</strong>
                      <ul className="mt-1 space-y-1">
                        {popupInfo.details.services.map((service, idx) => (
                          <li key={idx} className="flex items-center gap-1">
                            <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                            {service}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-600">
                        <strong>Contact:</strong> {popupInfo.details.contact}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Police Popup */}
              {popupInfo.type === 'police' && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{popupInfo.title}</h3>
                      <p className="text-sm text-gray-600">{popupInfo.details.type}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{popupInfo.description}</p>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-600">
                      <strong>Services:</strong>
                      <ul className="mt-1 space-y-1">
                        {popupInfo.details.services.map((service, idx) => (
                          <li key={idx} className="flex items-center gap-1">
                            <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                            {service}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-600">
                        <strong>Contact:</strong> {popupInfo.details.contact}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* New Report Popup */}
              {popupInfo.type === 'newReport' && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{popupInfo.title}</h3>
                      <p className="text-sm text-gray-600">Submit an issue report</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        value={reportForm.description}
                        onChange={(e) => setReportForm({...reportForm, description: e.target.value})}
                        placeholder="Describe the issue..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        rows="3"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Photo (Optional)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setReportForm({...reportForm, photo: e.target.files[0]})}
                        className="w-full text-xs text-gray-600 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-medium file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                      />
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={handleReportSubmit}
                        className="flex-1 bg-red-500 text-white text-sm font-medium py-2 px-3 rounded-md hover:bg-red-600 transition-colors"
                      >
                        Submit Report
                      </button>
                      <button
                        onClick={() => {
                          setShowPopup(null);
                          setPopupInfo(null);
                        }}
                        className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Popup>
        )}
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

      {/* Notification */}
      {notification && (
        <div style={{
          position: "absolute",
          top: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          background: notification.type === 'success' ? '#10b981' : '#ef4444',
          color: 'white',
          padding: "12px 16px",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "500",
          zIndex: 40,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          animation: "slideDown 0.3s ease-out"
        }}>
          {notification.message}
        </div>
      )}
    </div>
    </>
  );
}
