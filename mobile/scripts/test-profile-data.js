const axios = require('axios');

// Test the profile data fetching
async function testProfileData() {
  try {
    console.log('Testing profile data fetching...');
    
    // First, login to get a token
    const loginResponse = await axios.post('http://localhost:8000/api/auth/login', {
      email: 'isaaczackumbula@gmail.com',
      password: 'password'
    });
    
    const token = loginResponse.data.token;
    console.log('Login successful, token received');
    
    // Test the /user endpoint
    const userResponse = await axios.get('http://localhost:8000/api/user', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('User data:');
    console.log('Name:', userResponse.data.name);
    console.log('Email:', userResponse.data.email);
    console.log('Role:', userResponse.data.role);
    console.log('Created at:', userResponse.data.created_at);
    
    // Test the /my-courses endpoint for stats
    const coursesResponse = await axios.get('http://localhost:8000/api/my-courses', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('\nEnrolled courses:', coursesResponse.data.length);
    
    // Calculate stats like the profile page does
    const avgProgress = coursesResponse.data.length > 0 ? 
      Math.round(coursesResponse.data.reduce((acc, course) => {
        const progress = typeof course.progress_percentage === 'string' ? 
          parseFloat(course.progress_percentage) : 
          (course.progress_percentage || 0);
        return acc + progress;
      }, 0) / coursesResponse.data.length) : 0;
    
    console.log('Average progress:', avgProgress + '%');
    
  } catch (error) {
    console.error('Test failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
  }
}

testProfileData(); 