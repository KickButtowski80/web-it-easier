// The Google Indexing API has a limit of 200 calls per day
import { google } from 'googleapis';
import { loadEnv } from '../load-env.js';

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
  
  // Load environment variables
  loadEnv();
  
  console.log('Google Indexing API handler called');
  console.log('--- Environment Variable Debugging ---');
  console.log('process.env exists:', !!process);
  console.log('process.env.GOOGLE_CLIENT_EMAIL exists:', !!process.env.GOOGLE_CLIENT_EMAIL);
  console.log('process.env.GOOGLE_PRIVATE_KEY exists:', !!process.env.GOOGLE_PRIVATE_KEY);
  
  // Check for development mode flag in query or environment
  const isDev = process.env.NODE_ENV !== 'production' || req.query?.dev === 'true';
  console.log('process.env keys:', process?.env ? Object.keys(process.env) : 'N/A');
  console.log('GOOGLE_CLIENT_EMAIL:', process?.env?.GOOGLE_CLIENT_EMAIL || 'NOT FOUND');
  console.log('GOOGLE_PRIVATE_KEY exists:', !!process?.env?.GOOGLE_PRIVATE_KEY);
  console.log('GOOGLE_PRIVATE_KEY length:', process?.env?.GOOGLE_PRIVATE_KEY?.length || 0);
  console.log('NODE_ENV:', process?.env?.NODE_ENV);
  console.log('VERCEL_ENV:', process?.env?.VERCEL_ENV);
  
  // Try to log all env vars, but handle potential errors
  try {
    console.log('--- All Environment Variables (DEBUG) ---');
    const envVarsCopy = {...process.env};
    // Redact sensitive values
    if (envVarsCopy.GOOGLE_PRIVATE_KEY) envVarsCopy.GOOGLE_PRIVATE_KEY = '[REDACTED]';
    console.log(JSON.stringify(envVarsCopy, null, 2));
  } catch (err) {
    console.error('Error stringifying env vars:', err.message);
  }
  console.log('--------------------------------------');
  
  // Check environment variables and use fallbacks for development
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL || 'indexing-it-group-blogpost-ser@it-group-461723.iam.gserviceaccount.com';
  
  // Use the private key from environment or fallback
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;
  if (!privateKey) {
    console.warn('Using fallback private key for development');
    privateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCuJgK6aluUqdk9\nKd5PnaW5Jou4YpvbQdNfcZjnZ6uggX7rkH5EXY0+jTQ4sR+PH09mJHcCHaHEHlK7\nSq/hPpk7cr/IhktzAFFxCCSwuIOot656t+7/l93SEkSp8L5Y3eBGPSE9Wy3924iv\ndcAQMTXyNEkKQYGWB9kUuoxF7tvAAKOLGSB2NB9yjA0qQdM/gDZVSp+poJtwGQ51\nldR6+pg/APm5PiK8zynxcP4l+LR96a5w/SFwBGdGpwT8CAA2tCVrvES+bfo00kgU\nKxhVWQTeg/+4U3dY5MCsXZqi1Ck8y0LVEAaqxvxoOFYuAC4/4Ke3eUY+7P1baGvA\ns6L1w/+lAgMBAAECggEAJ1e3gJFUIL0Rcq+xhWeOX8qNQKnoX4uauuKBQnAJlkCD\nIak6WWwQI4xHerJLOKyAZclBqJT0rYeTNbRNETQw7n0BRkZOp8uv2nsWPOVmexiK\nHrfMkuomhxWw9PqKKi3wA7Y+OuwNMx9kXQ1bR10yvIXi5WIAqloaCQSO+aKZeyHZ\n68Sxm3WAo9M3O/qFaiR9W3wiZgGWZAwLPKXRqBn+f6oPvEuD4Q06MhoeNlcDk2XC\nhTi18UoqUwxaxs72aRzVzfqrkvGsIg3v1tnBd5RzXNT22J1YjGMJx2W3scxU9zQI\nVVzxWHSwBB90/rxtXBT8bLu8oPP7ZUsuOk/TpYZaAQKBgQDpsYRCoxFyRXNrjsLp\nAxYt9wjtrPFKSRWMOnCiSot9lIiM/7gqiJ9O7dlquSmxwtjtVG+VsmLYz2RTyDja\nWx3HxPQPywDqXd+Hq+dmsBkVuuXmcOLWBywpoJr7CPUsZqDa4CgjLbzWYceSqbYj\n/fGP/tTwVFC/vhWA23NZFPzGAQKBgQC+xXdcvlz91vYcD2y371NnVTNpMy4/ubm0\nCrjZF5s/5f8bafXwuXppnMXGc0RfNxot20xwjj10feE05Ky5DjSi9sgcXs8puD9j\nvN6yz6bov+xPQkaAzxShFZBmv9Yc7n5Xsll/QbcQPyMCofcsXg0VQx+r9JXG0Jok\nM3FIO9JhpQKBgB9NAZQTV2Dg4IbFhmHDYhMiBXYgNelnRJWVtkRmi6x0Wp3YGojH\n596giQB8cJM4r+mJ57A7RnYXwS5foQ3OKnz5al87J5I8pJX9dm8Qoyt/7w8gi6Fz\nMH0a3+dD2eLqlBz87SNZGvP0ANEqHhVQDCznSwotoOstwJ+TxS1nXDwBAoGAJ1OB\npabAeLuFhIdRfCFj6htQO9GHKS/aLlk/fdE1+dgp3LbdMkCqEXd19dDxOUecp/Nb\nMKDB3m/MqyCw0n0xMJ765Y5N2mXW+3KF3gqcd8KIrlYVPpxxvjs5x1SoiNJJTT7A\n4FDlsf2x8+r7jzPcMpPhxYroDVIXVHseUSuz1NkCgYEAl+u1SIUtr0t092KzCNOg\nnujLPSdszxQTH0NloOO+irmgYDFvOYmSQjXs+nr4NquJ2e7kYxRF1OZs+mSvgfjv\nszXAHOfqhbVnNG02ASVvhSTGwQXdlJIbmeL7O6Y+PGOermyUNe5JScXyS4bEIgYr\nhhlHHaHyDZxL8NCWCAnGSFQ=\n-----END PRIVATE KEY-----\n";
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