import React, { useRef } from "react";
import Map, { Marker, Source, Layer } from "react-map-gl";

const MAPBOX_TOKEN = "pk.eyJ1Ijoibm9sYW5ncmFwaHkiLCJhIjoiY21jYTdpbjNvMDBobDJtb2dwdWpveGE4YSJ9.bIOmIILeMml2GL-Qirzb-Q"; // Replace with your Mapbox token

// Example heatmap data (GeoJSON)
const heatmapData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [1.2764667798682217, 103.84599241787274], // Example coordinates
      },
      properties: { mag: 5 },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [1.2764667798682217, 103.84599241787274],
      },
      properties: { mag: 3 },
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
  const mapRef = useRef();
  return (
    <div style={{ position: "relative", width: "100%", height: "400px", borderRadius: "16px", boxShadow: "0 2px 8px #ccc" }}>
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
      >
        {/* Heatmap Layer */}
        <Source id="heatmap" type="geojson" data={heatmapData}>
          <Layer {...heatmapLayer} />
        </Source>
      </Map>
      {/* Fixed Center Marker Overlay */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -100%)",
        pointerEvents: "none",
        zIndex: 10
      }}>
        <svg height="32" viewBox="0 0 24 24" style={{ display: 'block' }}>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#e74c3c"/>
        </svg>
      </div>
      {/* Singapore Label with Marker */}
      <div style={{
        position: "absolute",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        background: "rgba(255,255,255,0.85)",
        padding: "6px 16px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px #ccc",
        zIndex: 20
      }}>
        <svg height="24" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#e74c3c"/>
        </svg>
        <span style={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}>Singapore</span>
      </div>
    </div>
  );
}
