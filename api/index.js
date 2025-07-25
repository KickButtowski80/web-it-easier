// This file serves as the main entry point for API requests
// It will route requests to the appropriate handler based on the path

import notifyGoogleIndexing from './notify-google-indexing.js';

export default async function handler(req, res) {
  // Extract the path from the URL
  const path = req.url.split('/api/')[1]?.split('?')[0] || '';
  
  // Route to the appropriate handler based on the path
  if (path === 'notify-google-indexing' || path === '') {
    return notifyGoogleIndexing(req, res);
  }
  
  // If no matching route is found, return 404
  return res.status(404).json({ error: 'Not Found' });
}
