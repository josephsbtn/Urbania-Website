import { useState, useEffect } from 'react';
import { getCitizenReports } from '../services/api';

export const useCitizenReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getCitizenReports();
        console.log('Citizen Reports Response:', response.data);
        
        // Handle various response formats
        if (Array.isArray(response.data)) {
          setReports(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setReports(response.data.data);
        } else {
          setReports([]);
        }
      } catch (err) {
        console.error('Error fetching citizen reports:', err);
        setError(err);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { reports, loading, error };
};
