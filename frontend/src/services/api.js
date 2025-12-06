import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const ML_URL = import.meta.env.VITE_ML_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const mlApi = axios.create({
  baseURL: ML_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Public Services
export const getHospitals = async () => {
  const response = await api.get('/public-service/hospitals');
  return response.data.result || [];
};

export const getPolice = async () => {
  const response = await api.get('/public-service/polices');
  return response.data.result || [];
};

export const getParks = async () => {
  const response = await api.get('/public-service/parks');
  return response.data.result || [];
};

export const getFireStations = async () => {
  const response = await api.get('/public-service/fire');
  return response.data.result || [];
};

export const getHappiness = async () => {
  const response = await api.get('/public-service/happiness');
  return response.data.result || 0;
};

export const getWeather = async () => {
  try {
    const response = await api.get('/public-service/weather');
    return response.data;
  } catch (error) {
    console.error('Weather API error:', error);
    // Return dummy data if API fails
    return {
      uvIndex: 5,
      label: 'moderate',
      aqi: { aqi: 45, status: 'Good' }
    };
  }
};

// Reports
export const getCitizenReports = async () => {
  const response = await api.get('/report/');
  return response.data.result || [];
};

// Predictions
export const getForecast = async () => {
  const response = await api.get('/predict/forecast');
  return response.data.result || null;
};

export const getSolarPotential = async (lon, lat) => {
  const response = await api.get(`/predict/solar/${lon}/${lat}`);
  return response.data.result || null;
};

// Analytics aggregation
export const getAnalytics = async () => {
  try {
    // Load hospitals and police from static files (fast and reliable)
    const [hospitalsRes, policeRes] = await Promise.all([
      fetch('/data/hospitals.json').then(r => r.json()),
      fetch('/data/police.json').then(r => r.json())
    ]);
    
    // Fetch real weather data from backend
    const weatherData = await getWeather();
    
    return {
      happiness: 0.75,
      facilities: {
        hospitals: hospitalsRes.length,
        police: policeRes.length,
        parks: 0,
      },
      weather: {
        temp: 28, // Singapore average
        uvIndex: weatherData.uvIndex || 'N/A',
        uvLabel: weatherData.label || 'N/A',
        description: `UV: ${weatherData.uvIndex || 'N/A'} (${weatherData.label || 'N/A'})`,
        aqi: weatherData.aqi?.aqi || weatherData.aqi || 45,
        status: weatherData.aqi?.status || 'Good'
      },
      forecast: null
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

export default api;
