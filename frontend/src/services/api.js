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
    const hospitaL = (
      await axios.get(`${API_BASE_URL}/public-service/hospitals`)
    ).data;
    return hospitaL;
  },

  // Get police stations mock data
  getPoliceStations: async () => {
    const police = (await axios.get(`${API_BASE_URL}/public-service/polices`))
      .data;
    return police;
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
      return result.data.result;
    } catch (error) {
      console.warn("Using mock hospital data due to API error");
      return mockAPI.getHospitals();
    }
  },

  // Get all police stations
  getPoliceStations: async () => {
    try {
      return await apiRequest("/public-service/polices");
    } catch (error) {
      console.warn("Using mock police data due to API error");
      return mockAPI.getPoliceStations();
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
      return await apiRequest("/api/report");
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
