// Run this with: node test-api.mjs
import http from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const postData = JSON.stringify({
  url: 'https://web-it-easier.vercel.app/blog/the-business-impact-of-website-speed',
  type: 'URL_UPDATED'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/notify-google-indexing', // Updated path to match the API route
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Content-Length': Buffer.byteLength(postData, 'utf8')
  },
  timeout: 10000 // 10 second timeout
};

console.log('Sending request to:', `http://${options.hostname}:${options.port}${options.path}`);
console.log('Request body:', postData);

const req = http.request(options, (res) => {
  console.log('\n--- RESPONSE ---');
  console.log(`STATUS: ${res.statusCode} ${http.STATUS_CODES[res.statusCode]}`);
  console.log('HEADERS:', JSON.stringify(res.headers, null, 2));
  
  let data = Buffer.alloc(0);
  
  res.on('data', (chunk) => {
    data = Buffer.concat([data, Buffer.from(chunk)]);
  });
  
  res.on('end', () => {
    try {
      const responseText = data.toString('utf8');
      console.log('\nBODY:');
      
      // Try to parse as JSON, fall back to raw text
      try {
        const json = JSON.parse(responseText);
        console.log(JSON.stringify(json, null, 2));
        
        // Additional info for common status codes
        if (res.statusCode === 403) {
          console.log('\nTROUBLESHOOTING:');
          console.log('- Check if the request method is allowed (should be POST)');
          console.log('- Verify CORS headers are properly set on the server');
          console.log('- Ensure the request includes the correct Content-Type header');
        } else if (res.statusCode === 404) {
          console.log('\nTROUBLESHOOTING:');
          console.log('- Verify the API endpoint path is correct');
          console.log('- Check if the server is running and accessible');
        }
      } catch (e) {
        console.log('Response (raw):', responseText);
      }
    } catch (e) {
      console.log('Error processing response:', e);
      console.log('Raw response data (hex):', data.toString('hex'));
    }
  });
});

// Set a timeout for the request
req.setTimeout(10000, () => {
  console.error('\n--- ERROR: Request Timeout ---');
  console.error('The request took too long to complete.');
  req.destroy();
});

req.on('error', (e) => {
  console.error('\n--- ERROR ---');
  console.error('Error details:', {
    message: e.message,
    code: e.code,
    stack: e.stack
  });
  
  if (e.code === 'ECONNREFUSED') {
    console.error('\nIs your local development server running? Start it with:');
    console.error('  npm run dev');
    console.error('or');
    console.error('  vercel dev');
  }
});

// Write data to request body
req.write(postData);
req.end();
