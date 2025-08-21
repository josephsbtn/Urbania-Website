import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/public-service/happiness`);
    return await response.json();
  } catch (error) {
    console.error("Backend health check failed:", error);
    return { status: "ERROR", message: "Backend unavailable" };
  }
};

const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`🔗 API Request: ${options.method || "GET"} ${url}`);

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    console.log(`✅ API Response: ${endpoint}`, data);
    return data;
  } catch (error) {
    console.error(`❌ API Request Error: ${endpoint}`, error);
    throw error;
  }
};

// Mock data for development
export const mockAPI = {
  // Get hospitals mock data
  getHospitals: async () => {
    try {
      const result = await axios.get(`${API_BASE_URL}/public-service/hospitals`);
      return result.data;
    } catch (error) {
      console.warn("Hospital API failed, using fallback mock data");
      return {
        result: [
          {
            name: "Singapore General Hospital",
            geometry: { coordinates: [103.8462, 1.2801] }
          }
        ]
      };
    }
  },

  // Get police stations mock data
  getPoliceStations: async () => {
    try {
      const result = await axios.get(`${API_BASE_URL}/public-service/polices`);
      return result.data;
    } catch (error) {
      console.warn("Police API failed, using fallback mock data");
      return {
        result: [
          {
            name: "Central Police Division", 
            geometry: { coordinates: [103.8520, 1.2840] }
          }
        ]
      };
    }
  },

  // Air Quality Index data
  getAQI: async () => {
    const data = (await axios.get(`${API_BASE_URL}/public-service/weather`))
      .data;
    console.log("AQI : ", { value: data.aqi.aqi, status: data.aqi.status });
    return {
      value: data.aqi.aqi,
      status: data.aqi.status,
    };
  },

  // UV Index data
  getUVIndex: async () => {
    const uv = (await axios.get(`${API_BASE_URL}/public-service/weather`)).data;
    console.log("UV : ", {
      value: uv.weather.uvIndex,
      status: uv.weather.label,
    });
    return {
      value: uv.weather.uvIndex,
      status: uv.weather.label,
      timestamp: new Date().toISOString(),
    };
  },

  getHappinessIndex: async () => {
    const happiness = (
      await axios.get(`${API_BASE_URL}/public-service/happiness`)
    ).data;

    console.log("Happiness : ", {
      value: happiness.result.happinessIndex,
    });
    if (happiness.result.happinessIndex <= 30)
      return {
        value: happiness.result.happinessIndex,
        status: "Bad",
        timestamp: new Date().toISOString(),
      };
    if (happiness.result.happinessIndex <= 60)
      return {
        value: happiness.happinessIndex,
        status: "Moderate",
        timestamp: new Date().toISOString(),
      };
    return {
      value: happiness.result.happinessIndex,
      status: "Good",
      timestamp: new Date().toISOString(),
    };
  },

  // Analytics data for charts
  getAnalyticsData: async () => {
    const [healthFacility, Police, Park, Fire] = await Promise.all([
      (
        await axios.get(`${API_BASE_URL}/public-service/hospitals`)
      ).data.result.length,
      (
        await axios.get(`${API_BASE_URL}/public-service/polices`)
      ).data.result.length,
      (
        await axios.get(`${API_BASE_URL}/public-service/parks`)
      ).data.result.length,
      (
        await axios.get(`${API_BASE_URL}/public-service/fire`)
      ).data.result.length,
    ]);
    const forecastingWater = await axios.get(
      `${API_BASE_URL}/predict/forecast`
    );
    console.log("Forecasting data loaded:", forecastingWater.data);
    return {
      reports: [
        { name: "", value: 12 },
        { name: "Feb", value: 19 },
        { name: "Mar", value: 25 },
        { name: "Apr", value: 31 },
        { name: "May", value: 28 },
        { name: "Jun", value: 35 },
      ],
      categories: [
        { name: "Health Facility", value: healthFacility },
        { name: "Police", value: Police },
        { name: "Park", value: Park },
        { name: "Fire Station", value: Fire },
      ],
    };
  },
};

// Public Service APIs
export const publicServiceAPI = {
  // Get all hospitals
  getHospitals: async () => {
    try {
      const result = await axios.get(
        `${API_BASE_URL}/public-service/hospitals`
      );
      return result.data;
    } catch (error) {
      console.warn("Using mock hospital data due to API error", error);
      // Return mock data with proper structure
      return {
        result: [
          {
            name: "Singapore General Hospital",
            geometry: {
              coordinates: [103.8462, 1.2801]
            }
          },
          {
            name: "National University Hospital",
            geometry: {
              coordinates: [103.7838, 1.2966]
            }
          }
        ]
      };
    }
  },

  // Get all police stations
  getPoliceStations: async () => {
    try {
      const result = await axios.get(
        `${API_BASE_URL}/public-service/polices`
      );
      return result.data;
    } catch (error) {
      console.warn("Using mock police data due to API error", error);
      // Return mock data with proper structure
      return {
        result: [
          {
            name: "Central Police Division",
            geometry: {
              coordinates: [103.8520, 1.2840]
            }
          },
          {
            name: "Tanglin Police Division",
            geometry: {
              coordinates: [103.8240, 1.3048]
            }
          }
        ]
      };
    }
  },

  // Get all parks
  getParks: async () => {
    try {
      const result = await axios.get(
        `${API_BASE_URL}/public-service/parks`
      );
      return result.data;
    } catch (error) {
      console.warn("Using mock parks data due to API error", error);
      // Return mock data with proper structure
      return {
        result: [
          {
            name: "Marina Bay Gardens",
            geometry: {
              coordinates: [103.8636, 1.2815]
            }
          },
          {
            name: "East Coast Park",
            geometry: {
              coordinates: [103.9065, 1.3006]
            }
          },
          {
            name: "Botanic Gardens",
            geometry: {
              coordinates: [103.8154, 1.3138]
            }
          }
        ]
      };
    }
  },

  // Get all fire stations
  getFireStations: async () => {
    try {
      const result = await axios.get(
        `${API_BASE_URL}/public-service/fire`
      );
      return result.data;
    } catch (error) {
      console.warn("Using mock fire stations data due to API error", error);
      // Return mock data with proper structure
      return {
        result: [
          {
            name: "Central Fire Station",
            geometry: {
              coordinates: [103.8500, 1.2900]
            }
          },
          {
            name: "Marina Fire Station",
            geometry: {
              coordinates: [103.8600, 1.2800]
            }
          }
        ]
      };
    }
  },
};

// Report APIs
export const reportAPI = {
  // Submit a new report with photo
  submitReport: async (formData) => {
    try {
      return await apiRequest("/report/", {
        method: "POST",
        body: formData,
        headers: {},
      });
    } catch (error) {
      console.error("Report submission failed:", error);
      return {
        success: true,
        message: "Report submitted successfully (mock)",
        id: Date.now(),
      };
    }
  },

  // Get all reports
  getReports: async () => {
    try {
      return await apiRequest("/report/");
    } catch (error) {
      console.warn("Using mock reports due to API error");
      return {
        reports: [
          {
            id: 1,
            description: "Pothole on Main Street",
            location: { lat: 1.2831, lng: 103.8545 },
            timestamp: new Date().toISOString(),
            status: "pending",
          },
        ],
      };
    }
  },
};

// Combined API service
const apiService = {
  healthCheck,
  publicServiceAPI,
  reportAPI,
  mockAPI,
};

export default apiService;
