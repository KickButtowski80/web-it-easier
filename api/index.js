// This file serves as the main entry point for API requests
// It will route requests to the appropriate handler based on the path

import notifyGoogleIndexing from './notify-google-indexing.js';

export default async function handler(req, res) {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Log request information for debugging
  console.log('API Request:', {
    method: req.method,
    url: req.url,
    hasBody: !!req.body,
    timestamp: new Date().toISOString()
  });

  // Extract the path from the URL
  const path = req.url.split('/api/')[1]?.split('?')[0] || '';
  
  // Route all requests to the Google Indexing handler
  // This includes both /api and /api/notify-google-indexing endpoints
  return notifyGoogleIndexing(req, res);
}
