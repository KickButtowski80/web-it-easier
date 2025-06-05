import { google } from 'googleapis';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });
console.log('Loaded environment from:', envPath);

// Configuration for Google Indexing API
// Note: Without Firestore rate limiting, we rely on Google's own API limits
// The Google Indexing API has a limit of 200 calls per day

export default async function handler(req, res) {
  // DEBUG: Log environment variables and request information
  console.log('DEBUG: API handler called');
  console.log('DEBUG: Environment variables present:');
  console.log('- GOOGLE_CLIENT_EMAIL exists:', !!process.env.GOOGLE_CLIENT_EMAIL);
  console.log('- GOOGLE_PRIVATE_KEY exists:', !!process.env.GOOGLE_PRIVATE_KEY);
  
  if (process.env.GOOGLE_CLIENT_EMAIL) {
    console.log('- GOOGLE_CLIENT_EMAIL value:', process.env.GOOGLE_CLIENT_EMAIL);
  }
  
  if (process.env.GOOGLE_PRIVATE_KEY) {
    console.log('- GOOGLE_PRIVATE_KEY length:', process.env.GOOGLE_PRIVATE_KEY.length);
    console.log('- GOOGLE_PRIVATE_KEY starts with:', process.env.GOOGLE_PRIVATE_KEY.substring(0, 20));
  } else {
    console.log('- GOOGLE_PRIVATE_KEY is undefined or empty');
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Get URL and type from request body
  const { url, type = 'URL_UPDATED' } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required.' });
  }

  try {
    // Note: We've removed the Firestore-based rate limiting.
    // The Google Indexing API itself has a limit of 200 calls per day,
    // and will return an error if that limit is exceeded.

    // --- Google Indexing API Call Logic ---
    // Create JWT client for Google API authentication
    // Handle private key
    let privateKey = '';
    if (process.env.GOOGLE_PRIVATE_KEY) {
      // Ensure escaped newlines from the .env file (\\n) are converted to actual newlines (\n).
      // This is critical for JWT signing.
      privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
      
      // Debug the processed key format (first and last few characters)
      console.log('Processed private key format check:');
      console.log('- First 20 chars:', privateKey.substring(0, 20));
      console.log('- Last 20 chars:', privateKey.substring(privateKey.length - 20));
      console.log('- Contains actual newlines:', privateKey.includes('\n'));
    } else {
      console.error('GOOGLE_PRIVATE_KEY is not set in environment variables.');
    }

    // Ensure both client email and the private key are present and valid
    if (!process.env.GOOGLE_CLIENT_EMAIL || !privateKey) {
      console.error('Missing GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY, or private key is empty after processing. Check environment variables.');
      return res.status(500).json({ error: 'Authentication credentials not configured, incomplete, or private key is missing.' });
    }
  
    const jwtClient = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      privateKey,
      ['https://www.googleapis.com/auth/indexing'],
      null
    );

    await jwtClient.authorize();

    const indexRequest = {
      url: url,
      type: type, // Default to URL_UPDATED if not specified
    };

    const response = await google.indexing('v3').urlNotifications.publish({
      auth: jwtClient,
      resource: indexRequest,
    });

    console.log(`Indexing API response for ${url}:`, response.data);
    return res.status(200).json({ success: true, data: response.data });

  } catch (error) {
    console.error('Error in notifyGoogleIndexing:', error);

    // Handle specific errors
    if (error.code === 400 || (error.message && error.message.includes('Invalid URL'))) {
      return res.status(400).json({ error: 'Invalid URL provided.' });
    }
    if (error.code === 403) {
      console.error('Google API 403 error details:', {
        message: error.message,
        errors: error.errors || [],
        response: error.response?.data || 'No response data'
      });
      return res.status(403).json({ 
        error: 'Authentication failed or insufficient permissions.', 
        details: error.message,
        hint: 'Verify that your service account has proper permissions and the domain is verified in Search Console.'
      });
    }
    // Handle Google API quota exceeded errors
    if (error.code === 429 || (error.message && error.message.includes('quota'))) {
      return res.status(429).json({ error: 'Google Indexing API quota exceeded. Try again tomorrow.' });
    }

    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}