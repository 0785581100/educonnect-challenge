const axios = require('axios');

// Test different Android emulator IP addresses
const testUrls = [
  'http://localhost:8000/api',
  'http://10.0.3.2:8000/api',
  'http://10.0.2.2:8000/api',
];

async function testConnection(url) {
  try {
    console.log(`\nTesting connection to: ${url}`);
    const response = await axios.get(`${url}/auth/login`, {
      timeout: 5000,
      validateStatus: () => true // Don't throw on any status code
    });
    
    if (response.status === 405) {
      console.log('✅ Connection successful! (405 Method Not Allowed is expected for GET on login endpoint)');
      return true;
    } else {
      console.log(`❌ Unexpected status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Connection failed: ${error.message}`);
    return false;
  }
}

async function testAllConnections() {
  console.log('Testing Android emulator connection configurations...');
  
  for (const url of testUrls) {
    await testConnection(url);
  }
  
  console.log('\nRecommended configuration:');
  console.log('- Use 10.0.3.2 for Android emulator (as specified by user)');
  console.log('- Use localhost for iOS simulator or physical device');
}

testAllConnections();
