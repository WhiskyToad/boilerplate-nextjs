// Quick API test script
const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('Testing API endpoints...');
    
    const response = await fetch('http://localhost:3001/api/demos');
    console.log('API Status:', response.status);
    console.log('API Headers:', Object.fromEntries(response.headers));
    
    if (response.ok) {
      const data = await response.text();
      console.log('API Response:', data.substring(0, 200));
    } else {
      console.log('API Error:', response.statusText);
    }
  } catch (error) {
    console.error('Request failed:', error.message);
  }
}

testAPI();