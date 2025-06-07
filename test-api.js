// Run this with: node test-api.js
const http = require('http');

const postData = JSON.stringify({
  url: 'https://izak-portfolio.vercel.app/blog/fffff',
  type: 'URL_UPDATED'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log('HEADERS:', JSON.stringify(res.headers, null, 2));
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      console.log('BODY:', JSON.stringify(JSON.parse(data), null, 2));
    } catch (e) {
      console.log('BODY (raw):', data);
    }
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();
