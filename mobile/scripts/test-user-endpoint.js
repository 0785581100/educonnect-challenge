const axios = require('axios');

// Test the /user endpoint to see what data it returns
async function testUserEndpoint() {
  try {
    console.log('Testing /user endpoint...');
    
    // First, login to get a token
    const loginResponse = await axios.post('http://localhost:8000/api/auth/login', {
      email: 'alice@educonnect.com',
      password: 'password'
    });
    
    const token = loginResponse.data.token;
    console.log('Login successful, token received');
    
    // Now test the /user endpoint
    const userResponse = await axios.get('http://localhost:8000/api/user', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('User data from /user endpoint:');
    console.log('Full response:', JSON.stringify(userResponse.data, null, 2));
    
    // Check specific fields
    const user = userResponse.data;
    console.log('\nField analysis:');
    console.log('ID:', user.id);
    console.log('Name:', user.name);
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('Created at:', user.created_at);
    console.log('Updated at:', user.updated_at);
    
  } catch (error) {
    console.error('Test failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
  }
}

testUserEndpoint(); 