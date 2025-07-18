import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Set your backend base URL here
// Determine the appropriate API base URL based on the platform
import { Platform } from 'react-native';

// Choose the appropriate base URL based on platform
let baseUrl = 'http://localhost:8000/api';

// For Android emulator
if (Platform.OS === 'android') {
  // 10.0.3.2 is an alternative IP for Android emulator to access host's localhost
  baseUrl = 'http://10.0.3.2:8000/api';
}

// Alternative options if the above doesn't work:
// - Android emulator: 'http://10.0.2.2:8000/api'
// - Your computer's actual IP: 'http://192.168.10.7:8000/api'

export const API_BASE_URL = baseUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Attach token to each request if available
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    if (config.headers && typeof config.headers.set === 'function') {
      // Axios v1+ AxiosHeaders instance
      config.headers.set('Authorization', `Bearer ${token}`);
    } else if (config.headers) {
      // Fallback for plain object
      (config.headers as any)['Authorization'] = `Bearer ${token}`;
    } else {
      config.headers = { Authorization: `Bearer ${token}` } as any;
    }
  }
  return config;
});

export default api; 