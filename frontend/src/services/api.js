// API configuration and base URL
const API_BASE_URL = 'http://localhost:8000';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Public Service APIs
export const publicServiceAPI = {
  // Get all hospitals
  getHospitals: async () => {
    return await apiRequest('/public-service/hospitals');
  },

  // Get all police stations
  getPoliceStations: async () => {
    return await apiRequest('/public-service/polices');
  },
};

// Report APIs
export const reportAPI = {
  // Submit a new report with photo
  submitReport: async (formData) => {
    return await apiRequest('/report', {
      method: 'POST',
      body: formData, // FormData object with photo and description
      headers: {}, // Remove Content-Type to let browser set it for FormData
    });
  },
};

// Mock data for development (can be replaced with real APIs later)
export const mockAPI = {
  // Air Quality Index data
  getAQI: async () => {
    return {
      value: 62,
      status: 'Moderate',
      timestamp: new Date().toISOString(),
    };
  },

  // UV Index data
  getUVIndex: async () => {
    return {
      value: 7,
      status: 'High',
      timestamp: new Date().toISOString(),
    };
  },

  // Happiness Index data
  getHappinessIndex: async () => {
    return {
      value: 82,
      status: 'Good',
      timestamp: new Date().toISOString(),
    };
  },

  // Analytics data for charts
  getAnalyticsData: async () => {
    return {
      reports: [
        { name: 'Jan', value: 12 },
        { name: 'Feb', value: 19 },
        { name: 'Mar', value: 25 },
        { name: 'Apr', value: 31 },
        { name: 'May', value: 28 },
        { name: 'Jun', value: 35 },
      ],
      categories: [
        { name: 'Infrastructure', value: 40 },
        { name: 'Safety', value: 30 },
        { name: 'Environment', value: 20 },
        { name: 'Other', value: 10 },
      ],
    };
  },
};

const apiService = {
  publicServiceAPI,
  reportAPI,
  mockAPI,
};

export default apiService;
