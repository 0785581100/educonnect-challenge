const axios = require('axios');

// Test the specific IP address 10.0.3.2
const TEST_IP = '10.0.3.2';
const API_URL = `http://${TEST_IP}:8000/api`;

console.log(`Testing API connection to: ${API_URL}`);

async function testConnection() {
  try {
    console.log('\nTesting basic connectivity...');
    const response = await axios.get(`${API_URL}/courses`, {
      timeout: 5000,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log('✅ Connection successful!');
    console.log('Status:', response.status);
    console.log('Response data available:', response.data ? 'Yes' : 'No');
    
    return true;
  } catch (error) {
    console.log('❌ Connection failed');
    
    if (error.response) {
      // The request was made and the server responded with a status code
      console.log('Status:', error.response.status);
      console.log('Response:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.log('No response received. Error code:', error.code);
    } else {
      // Something happened in setting up the request
      console.log('Error:', error.message);
    }
    
    return false;
  }
}

async function testLogin() {
  try {
    console.log('\nTesting login endpoint...');
    
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@educonnect.com',
      password: 'password'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 5000
    });
    
    console.log('✅ Login successful!');
    console.log('Status:', loginResponse.status);
    console.log('User:', loginResponse.data.user ? loginResponse.data.user.name : 'Unknown');
    console.log('Token received:', loginResponse.data.token ? 'Yes' : 'No');
    
    return true;
  } catch (error) {
    console.log('❌ Login failed');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', error.response.data);
    } else if (error.request) {
      console.log('No response received. Error code:', error.code);
    } else {
      console.log('Error:', error.message);
    }
    
    return false;
  }
}

async function runTests() {
  console.log('=== API Connection Test for 10.0.3.2 ===');
  
  const connectionSuccess = await testConnection();
  
  if (connectionSuccess) {
    await testLogin();
    console.log('\n✅ SUCCESS: 10.0.3.2 works! You can use this IP in your app configuration.');
  } else {
    console.log('\n❌ Connection to 10.0.3.2 failed.');
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure the Laravel server is running with: php artisan serve --host=0.0.0.0');
    console.log('2. Check if your computer\'s firewall is blocking connections');
    console.log('3. Try using a different IP address like 10.0.2.2 or your computer\'s actual IP');
  }
}

runTests();
