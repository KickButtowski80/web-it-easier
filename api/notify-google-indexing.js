// The Google Indexing API has a limit of 200 calls per day
import { google } from 'googleapis';


// This is needed for ES modules
export default async function handler(req, res) {
  // Only load .env files in development/local environments
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const { loadEnv } = await import('../load-env.js');
    loadEnv();
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('Google Indexing API handler called');
    console.log('--- Environment Variable Debugging ---');
    console.log('process.env exists:', !!process);
    console.log('process.env.GOOGLE_CLIENT_EMAIL exists:', !!process.env.GOOGLE_CLIENT_EMAIL);
    console.log('process.env.GOOGLE_PRIVATE_KEY exists:', !!process.env.GOOGLE_PRIVATE_KEY);
  }

  // Check for development mode flag in query or environment
  const isDev = process.env.NODE_ENV !== 'production' || req.query?.dev === 'true';
  if (process.env.NODE_ENV === 'development') {
    console.log('process.env keys:', process?.env ? Object.keys(process.env) : 'N/A');
    console.log('GOOGLE_CLIENT_EMAIL:', process?.env?.GOOGLE_CLIENT_EMAIL || 'NOT FOUND');
    console.log('GOOGLE_PRIVATE_KEY exists:', !!process?.env?.GOOGLE_PRIVATE_KEY);
    console.log('GOOGLE_PRIVATE_KEY length:', process?.env?.GOOGLE_PRIVATE_KEY?.length || 0);
    console.log('NODE_ENV:', process?.env?.NODE_ENV);
  }
  console.log('VERCEL_ENV:', process?.env?.VERCEL_ENV);

  // Try to log all env vars, but handle potential errors
  try {
    console.log('--- All Environment Variables (DEBUG) ---');
    const envVarsCopy = { ...process.env };
    // Redact sensitive values
    if (envVarsCopy.GOOGLE_PRIVATE_KEY) envVarsCopy.GOOGLE_PRIVATE_KEY = '[REDACTED]';
    console.log(JSON.stringify(envVarsCopy, null, 2));
  } catch (err) {
    console.error('Error stringifying env vars:', err.message);
  }
  console.log('--------------------------------------');

  // Check environment variables and use fallbacks for development
  //Debugging: The error stack trace points directly to the if line.
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  if (!clientEmail) {
    throw new Error('GOOGLE_CLIENT_EMAIL environment variable is required');
  }

  // Use the private key from environment, prioritizing the Base64 version for production.
  let privateKey;
  if (process.env.GOOGLE_PRIVATE_KEY_BASE64) {
    console.log('Found GOOGLE_PRIVATE_KEY_BASE64, decoding...');
    // Decode the Base64 key to get the original multi-line string.
    privateKey = Buffer.from(process.env.GOOGLE_PRIVATE_KEY_BASE64, 'base64').toString('utf-8');
  } else if (process.env.GOOGLE_PRIVATE_KEY) {
    // Fallback to the raw key for local development.
    console.log('Found GOOGLE_PRIVATE_KEY, using as is.');
    privateKey = process.env.GOOGLE_PRIVATE_KEY;
  }

  // If neither key is found, the function cannot proceed.
  if (!privateKey) {
    throw new Error('Required environment variable GOOGLE_PRIVATE_KEY_BASE64 or GOOGLE_PRIVATE_KEY is missing.');
  }

  // Log what we're using
  console.log('Using client email:', clientEmail);
  console.log('Private key available:', !!privateKey);

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
    // Check if we're in development mode
    const isDevelopment = process.env.NODE_ENV === 'development' ||
      process.env.VERCEL_ENV === 'development' ||
      process.env.VERCEL_ENV === 'preview' ||
      req.query?.dev === 'true';

    console.log('Environment:', {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      isDevelopment: isDevelopment
    });

    // In development mode, skip actual API call to avoid using quota
    if (isDevelopment) {
      console.log('DEVELOPMENT MODE: Skipping actual Google API call');

      // Return mock successful response
      return res.status(200).json({
        success: true,
        message: 'Development mode - Google Indexing API call simulated',
        url: url,
        type: type,
        timestamp: new Date().toISOString()
      });
    }

    // Get the private key and ensure it's properly formatted
    // This is the most critical part - we need to ensure the key is in the correct format

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
      email: clientEmail,
      keyPresent: !!privateKey,
      keyLength: privateKey?.length || 0
    });

    const jwtClient = new google.auth.JWT(
      clientEmail,
      null,
      privateKey,
      ['https://www.googleapis.com/auth/indexing'],
      null
    );

    // Authorize the client
    console.log('Authorizing JWT client...');
    try {
      await jwtClient.authorize();
      console.log('JWT client authorized successfully');
    } catch (authError) {
      console.error('JWT authorization failed:', authError);
      return res.status(403).json({
        error: 'Authentication failed',
        details: 'Check service account permissions',
        message: authError.message
      });
    }

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