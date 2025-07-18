import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Determine the appropriate API base URL based on the platform
import { Platform } from 'react-native';

// Choose the appropriate base URL based on platform
let API_BASE_URL = 'http://localhost:8000/api';

// For Android emulator
if (Platform.OS === 'android') {
  // Use 10.0.3.2 for Android emulator to access host's localhost
  API_BASE_URL = 'http://10.0.3.2:8000/api';
}

console.log('Platform:', Platform.OS);
console.log('API Base URL:', API_BASE_URL);

const apiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
apiService.interceptors.request.use(
  async (config) => {
    console.log('Making request to:', config.url);
    console.log('Full URL:', (config.baseURL || '') + (config.url || ''));
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiService.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error('Response error:', error.message, error.config?.url);
    
    if (error.code === 'NETWORK_ERROR') {
      console.error('Network error - please check if the backend is running on:', API_BASE_URL);
    }
    
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      // You might want to trigger navigation to login here
    }
    return Promise.reject(error);
  }
);

export default apiService; 