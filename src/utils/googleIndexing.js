// src/utils/googleIndexing.js
import { google } from 'googleapis';

// Only initialize in production environment
const isProduction = import.meta.env.PROD === true;
const hasCredentials = 
  import.meta.env.VITE_GOOGLE_CLIENT_EMAIL && 
  import.meta.env.VITE_GOOGLE_PRIVATE_KEY;

// Only create the client if in production with credentials
let jwtClient = null;
if (isProduction && hasCredentials) {
  jwtClient = new google.auth.JWT(
    import.meta.env.VITE_GOOGLE_CLIENT_EMAIL,
    null,
    import.meta.env.VITE_GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/indexing'],
    null
  );
}

export const notifyGoogle = async (url, type = 'URL_UPDATED') => {
  // Skip if not in production or missing credentials
  if (!isProduction || !jwtClient) {
    console.log(`[DEV] Would notify Google about: ${url} (${type})`);
    return null;
  }
  
  try {
    await jwtClient.authorize();
    
    const indexing = google.indexing({
      version: 'v3',
      auth: jwtClient
    });
    
    const result = await indexing.urlNotifications.publish({
      requestBody: {
        url: url,
        type: type // URL_UPDATED or URL_DELETED
      }
    });
    
    console.log(`Successfully notified Google about: ${url}`);
    return result.data;
  } catch (error) {
    console.error('Google Indexing API error:', error);
    return null;
  }
};