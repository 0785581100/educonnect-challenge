const axios = require('axios');

// API base URL - using the same as in the app
// Use localhost for emulator/simulator, use IP address for physical device testing
const API_BASE_URL = 'http://localhost:8000/api';

console.log('Testing API connection to:', API_BASE_URL);

// Test endpoints
const endpoints = [
  { method: 'POST', url: '/auth/login', auth: false, name: 'Login', data: { email: 'admin@educonnect.com', password: 'password' } },
  { method: 'GET', url: '/courses', auth: false, name: 'Get Courses' },
  { method: 'GET', url: '/user', auth: true, name: 'Get User Profile' },
  { method: 'GET', url: '/my-courses', auth: true, name: 'Get My Courses' }
];

// You can add your test token here
const token = process.argv[2] || '';

async function testEndpoint(endpoint) {
  try {
    const config = {
      headers: {}
    };
    
    if (endpoint.auth && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`\nTesting ${endpoint.name} (${endpoint.method} ${endpoint.url}):`);
    console.log(`Auth required: ${endpoint.auth ? 'Yes' : 'No'}`);
    
    if (endpoint.auth && !token) {
      console.log('⚠️ Skipping authenticated endpoint - no token provided');
      return;
    }
    
    const axiosConfig = {
      method: endpoint.method.toLowerCase(),
      url: `${API_BASE_URL}${endpoint.url}`,
      headers: config.headers,
      timeout: 10000
    };
    
    // Add data for POST requests
    if (endpoint.data && (endpoint.method === 'POST' || endpoint.method === 'PUT')) {
      console.log('Request data:', JSON.stringify(endpoint.data));
      axiosConfig.data = endpoint.data;
    }
    
    const response = await axios(axiosConfig);
    
    console.log('✅ Success! Status:', response.status);
    console.log('Response data structure:', Object.keys(response.data).join(', '));
  } catch (error) {
    console.log('❌ Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', error.response.data);
    } else if (error.request) {
      console.log('No response received. Is the server running?');
    }
  }
}

async function runTests() {
  console.log('API Connection Test');
  console.log('==================');
  
  try {
    // First test basic connectivity
    console.log('\nTesting basic connectivity...');
    await axios.get(`${API_BASE_URL}/courses`);
    console.log('✅ Successfully connected to API server!');
    
    // Then test individual endpoints
    for (const endpoint of endpoints) {
      await testEndpoint(endpoint);
    }
    
  } catch (error) {
    console.log('❌ Failed to connect to API server:', error.message);
    console.log('Please check:');
    console.log('1. Is the Laravel backend server running?');
    console.log('2. Is the IP address correct? Current:', API_BASE_URL);
    console.log('3. Are there any network issues or firewalls blocking the connection?');
  }
}

runTests();

// Usage instructions
console.log('\nUsage:');
console.log('node test-api-connection.js [token]');
console.log('- Provide a valid auth token as an argument to test authenticated endpoints');
