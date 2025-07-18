const axios = require('axios');

// Test the my-courses API to check instructor names
async function testMyCourses() {
  try {
    console.log('Testing my-courses API...');
    
    // First, login to get a token
    const loginResponse = await axios.post('http://localhost:8000/api/auth/login', {
      email: 'alice@educonnect.com',
      password: 'password'
    });
    
    const token = loginResponse.data.token;
    console.log('Login successful, token received');
    
    // Now test the my-courses endpoint
    const myCoursesResponse = await axios.get('http://localhost:8000/api/my-courses', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('My courses response:');
    myCoursesResponse.data.forEach((course, index) => {
      console.log(`Course ${index + 1}:`);
      console.log(`  Title: ${course.title}`);
      console.log(`  Instructor: ${course.instructor_name}`);
      console.log(`  Progress: ${course.progress_percentage}%`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('Test failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
  }
}

testMyCourses(); 