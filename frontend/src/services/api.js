// API configuration and base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Health check function
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return await response.json();
  } catch (error) {
    console.error('Backend health check failed:', error);
    return { status: 'ERROR', message: 'Backend unavailable' };
  }
};

// Generic API request function with better error handling
const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`🔗 API Request: ${options.method || 'GET'} ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
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
    return {
      result: [
        {
          name: 'Singapore General Hospital',
          geometry: { coordinates: [103.8354, 1.2792] }
        },
        {
          name: 'National University Hospital',
          geometry: { coordinates: [103.7831, 1.2966] }
        },
        {
          name: 'Tan Tock Seng Hospital',
          geometry: { coordinates: [103.8478, 1.3207] }
        },
        {
          name: 'Changi General Hospital',
          geometry: { coordinates: [103.9496, 1.3414] }
        }
      ]
    };
  },

  // Get police stations mock data
  getPoliceStations: async () => {
    return {
      result: [
        {
          name: 'Central Police Division',
          geometry: { coordinates: [103.8518, 1.2839] }
        },
        {
          name: 'Orchard Police Post',
          geometry: { coordinates: [103.8221, 1.3048] }
        },
        {
          name: 'Marina Bay Police Post',
          geometry: { coordinates: [103.8590, 1.2868] }
        },
        {
          name: 'Bedok Police Division',
          geometry: { coordinates: [103.9273, 1.3236] }
        }
      ]
    };
  },

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

// Public Service APIs
export const publicServiceAPI = {
  // Get all hospitals
  getHospitals: async () => {
    try {
      return await apiRequest('/api/public-service/hospitals');
    } catch (error) {
      console.warn('Using mock hospital data due to API error');
      return mockAPI.getHospitals();
    }
  },

  // Get all police stations
  getPoliceStations: async () => {
    try {
      return await apiRequest('/api/public-service/police-stations');
    } catch (error) {
      console.warn('Using mock police data due to API error');
      return mockAPI.getPoliceStations();
    }
  },
};

// Report APIs
export const reportAPI = {
  // Submit a new report with photo
  submitReport: async (formData) => {
    try {
      return await apiRequest('/api/report', {
        method: 'POST',
        body: formData,
        headers: {},
      });
    } catch (error) {
      console.error('Report submission failed:', error);
      return {
        success: true,
        message: 'Report submitted successfully (mock)',
        id: Date.now(),
      };
    }
  },

  // Get all reports
  getReports: async () => {
    try {
      return await apiRequest('/api/report');
    } catch (error) {
      console.warn('Using mock reports due to API error');
      return {
        reports: [
          {
            id: 1,
            description: 'Pothole on Main Street',
            location: { lat: 1.2831, lng: 103.8545 },
            timestamp: new Date().toISOString(),
            status: 'pending'
          }
        ]
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
