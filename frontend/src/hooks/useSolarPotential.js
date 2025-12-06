import { useState, useEffect } from 'react';
import { getSolarPotential } from '../services/api';

export const useSolarPotential = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getSolarPotential();
        console.log('Solar Potential Response:', response.data);
        
        // Handle empty or invalid response
        if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
          setData(null);
          setLoading(false);
          return;
        }
        
        // Convert to GeoJSON format
        const geoJsonData = {
          type: 'FeatureCollection',
          features: response.data.map(item => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [item.longitude || 0, item.latitude || 0],
            },
            properties: {
              potential: item.potential || 0,
            },
          })),
        };
        setData(geoJsonData);
      } catch (err) {
        console.error('Error fetching solar potential:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
