// Run this with: node test-api.mjs
import http from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

console.log('Sending request to:', `http://${options.hostname}:${options.port}${options.path}`);
console.log('Request body:', postData);

const req = http.request(options, (res) => {
  console.log('\n--- RESPONSE ---');
  console.log(`STATUS: ${res.statusCode}`);
  console.log('HEADERS:', JSON.stringify(res.headers, null, 2));
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      console.log('\nBODY:');
      console.log(JSON.stringify(JSON.parse(data), null, 2));
    } catch (e) {
      console.log('BODY (raw):', data);
    }
  });
});

req.on('error', (e) => {
  console.error('\n--- ERROR ---');
  console.error(`Problem with request: ${e.message}`);
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
