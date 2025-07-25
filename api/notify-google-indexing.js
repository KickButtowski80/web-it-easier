import { google } from 'googleapis';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method Not Allowed',
      message: 'Only POST requests are supported'
    });
  }

  try {
    const { url, type = 'URL_UPDATED' } = req.body;

    if (!url) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'URL is required'
      });
    }

    // Debug: Log environment variables (without exposing full key)
    console.log('Environment check:', {
      hasClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
      privateKeyLength: process.env.GOOGLE_PRIVATE_KEY?.length || 0,
      privateKeyStart: process.env.GOOGLE_PRIVATE_KEY?.substring(0, 20) || 'none',
      privateKeyEnd: process.env.GOOGLE_PRIVATE_KEY?.substring(-20) || 'none'
    });

    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error('Missing required Google service account credentials');
    }

    // Process private key - handle multiple formats
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    
    // Replace escaped newlines if they exist
    if (privateKey.includes('\\n')) {
      privateKey = privateKey.replace(/\\n/g, '\n');
    }
    
    // Ensure proper PEM format
    if (!privateKey.includes('\n') && privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
      privateKey = privateKey
        .replace('-----BEGIN PRIVATE KEY-----', '-----BEGIN PRIVATE KEY-----\n')
        .replace('-----END PRIVATE KEY-----', '\n-----END PRIVATE KEY-----\n');
    }

    // Create JWT client
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/indexing']
    });

    // Get access token
    const tokens = await auth.authorize();
    if (!tokens.access_token) {
      throw new Error('Failed to obtain access token');
    }

    // Make the API request
    const indexing = google.indexing({ version: 'v3', auth });
    const response = await indexing.urlNotifications.publish({
      requestBody: {
        url,
        type: type.toUpperCase()
      }
    });

    return res.status(200).json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('Error in notify-google-indexing:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });

    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}