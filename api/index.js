// This file serves as the main entry point for API requests
import notifyGoogleIndexing from './notify-google-indexing.js';

// Helper to parse request body
async function parseBody(req) {
  return new Promise((resolve) => {
    if (req.body) return resolve();
    
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        req.body = body ? JSON.parse(body) : {};
      } catch (e) {
        req.body = {};
      }
      resolve();
    });
  });
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Parse request body if needed
    if (req.method === 'POST' && !req.body) {
      await parseBody(req);
    }

    // Log request info
    console.log('API Request:', {
      method: req.method,
      url: req.url,
      path: req.url.split('?')[0],
      query: req.query,
      body: req.body ? JSON.stringify(req.body).substring(0, 200) : 'No body',
      timestamp: new Date().toISOString()
    });

    // Route to the appropriate handler
    return notifyGoogleIndexing(req, res);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
}
