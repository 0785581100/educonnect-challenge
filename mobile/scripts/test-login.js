const axios = require('axios');

// Test the login API with the correct IP for Android emulator
async function testLogin() {
  try {
    console.log('Testing login API with 10.0.3.2...');
    
    const response = await axios.post('http://10.0.3.2:8000/api/auth/login', {
      email: 'alice@educonnect.com',
      password: 'password'
    });
    
    console.log('Login successful!');
    console.log('Response:', response.data);
    console.log('Token:', response.data.token);
    console.log('User:', response.data.user);
    
  } catch (error) {
    console.error('Login failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
  }
}

testLogin();
