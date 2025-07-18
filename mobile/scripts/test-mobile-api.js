const axios = require('axios');

// Simulate the mobile app's API service configuration
const API_BASE_URL = 'http://localhost:8000/api';

console.log('Testing mobile API connection...');
console.log('API Base URL:', API_BASE_URL);

const apiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Test login
async function testMobileLogin() {
  try {
    console.log('\nAttempting login with mobile API service...');
    
    const response = await apiService.post('/auth/login', {
      email: 'alice@educonnect.com',
      password: 'password'
    });
    
    console.log('✅ Mobile login successful!');
    console.log('Response:', response.data);
    console.log('Token:', response.data.token);
    console.log('User:', response.data.user);
    
    // Test storing token (simulate AsyncStorage)
    const token = response.data.token;
    const user = response.data.user;
    
    console.log('\n✅ Token and user data would be stored successfully');
    console.log('Token length:', token.length);
    console.log('User data:', JSON.stringify(user));
    
    return { token, user };
    
  } catch (error) {
    console.error('❌ Mobile login failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    console.error('Config:', error.config);
    return null;
  }
}

testMobileLogin(); 