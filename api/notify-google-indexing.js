// @ts-check
import { google } from 'googleapis';

// Configuration for Google Indexing API
// The Google Indexing API has a limit of 200 calls per day

// This is needed for ES modules
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  console.log('Google Indexing API handler called');
  
  // Check environment variables
  if (!process.env.GOOGLE_CLIENT_EMAIL) {
    console.error('GOOGLE_CLIENT_EMAIL is missing');
    return res.status(500).json({ error: 'Server configuration error: Missing client email' });
  }
  
  if (!process.env.GOOGLE_PRIVATE_KEY) {
    console.error('GOOGLE_PRIVATE_KEY is missing');
    return res.status(500).json({ error: 'Server configuration error: Missing private key' });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate request body
  if (!req.body || !req.body.url) {
    return res.status(400).json({ error: 'Missing required fields', details: 'URL is required' });
  }

  // Extract URL and notification type from request
  const { url, type = 'URL_UPDATED' } = req.body;

  // Validate URL format
  if (!url.startsWith('http')) {
    return res.status(400).json({ error: 'Invalid URL format', details: 'URL must start with http:// or https://' });
  }

  try {
    // Get the private key and ensure it's properly formatted
    // This is the most critical part - we need to ensure the key is in the correct format
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    
    // Log key information (safely)
    console.log('Private key info:', {
      length: privateKey?.length || 0,
      hasNewlines: privateKey?.includes('\n') || false,
      hasLiteralBackslashN: privateKey?.includes('\\n') || false
    });
    
    // If the key contains literal '\n', replace them with actual newlines
    if (privateKey?.includes('\\n')) {
      privateKey = privateKey.replace(/\\n/g, '\n');
      console.log('Converted literal \\n to actual newlines');
    }
    
    // Create JWT client with minimal logging of sensitive data
    console.log('Creating JWT client with:', {
      email: process.env.GOOGLE_CLIENT_EMAIL,
      keyPresent: !!privateKey,
      keyLength: privateKey?.length || 0
    });
    
    const jwtClient = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      privateKey,
      ['https://www.googleapis.com/auth/indexing'],
      null
    );

    // Authorize the client
    console.log('Authorizing JWT client...');
    await jwtClient.authorize();
    console.log('JWT client authorized successfully');

    // Create indexing client
    const indexing = google.indexing({
      version: 'v3',
      auth: jwtClient
    });

    // Call the Google Indexing API
    console.log(`Sending ${type} notification for URL: ${url}`);
    const result = await indexing.urlNotifications.publish({
      requestBody: {
        url: url,
        type: type // URL_UPDATED or URL_DELETED
      }
    });

    // Log the result (without exposing full response)
    console.log('Google Indexing API success:', {
      statusCode: result.status,
      statusText: result.statusText,
      dataReceived: !!result.data
    });

    // Return success response
    return res.status(200).json({
      success: true,
      message: `URL ${type === 'URL_DELETED' ? 'deletion' : 'update'} notification sent to Google`,
      url: url,
      notificationType: type,
      googleResponse: result.data
    });

  } catch (error) {
    // Enhanced error logging
    const errorDetails = {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack?.split('\n')[0] || 'No stack trace',
      // Add more debug info
      env: {
        hasClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
        hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
        privateKeyLength: process.env.GOOGLE_PRIVATE_KEY?.length || 0,
        nodeEnv: process.env.NODE_ENV
      },
      timestamp: new Date().toISOString()
    };
    
    console.error('Google Indexing API Error:', JSON.stringify(errorDetails, null, 2));
    
    // Return detailed error in development, generic in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (error.code === 403) {
      return res.status(403).json({
        error: 'Authentication failed',
        details: isDevelopment ? error.message : 'Check service account permissions',
        ...(isDevelopment && { debug: errorDetails })
      });
    } 
    
    if (error.code === 400) {
      return res.status(400).json({
        error: 'Bad request',
        details: isDevelopment ? error.message : 'Invalid request',
        ...(isDevelopment && { debug: errorDetails })
      });
    }
    
    if (error.code === 429) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        details: 'Google Indexing API quota exceeded',
        ...(isDevelopment && { debug: errorDetails })
      });
    }
    
    // For all other errors
    return res.status(500).json({
      error: 'Internal Server Error',
      details: isDevelopment ? error.message : 'An error occurred',
      ...(isDevelopment && { 
        debug: errorDetails,
        stack: error.stack 
      })
    });
  }
}