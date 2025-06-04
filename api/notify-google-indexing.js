import { google } from 'googleapis';

// Configuration for Google Indexing API
// Note: Without Firestore rate limiting, we rely on Google's own API limits
// The Google Indexing API has a limit of 200 calls per day

export default async function handler(req, res) {
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
    // Log the indexing request
    console.log(`Processing indexing request for URL: ${url}`);
    
    // Note: We've removed the Firestore-based rate limiting.
    // The Google Indexing API itself has a limit of 200 calls per day,
    // and will return an error if that limit is exceeded.

    // --- Google Indexing API Call Logic ---
    const jwtClient = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace escaped newlines
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
      return res.status(403).json({ error: 'Authentication failed or insufficient permissions.' });
    }
    // Handle Google API quota exceeded errors
    if (error.code === 429 || (error.message && error.message.includes('quota'))) {
      return res.status(429).json({ error: 'Google Indexing API quota exceeded. Try again tomorrow.' });
    }

    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}