// src/utils/googleIndexing.js

// Check if we're in production environment
const isProduction = import.meta.env.PROD === true;

export const notifyGoogle = async (url, type = 'URL_UPDATED') => {
  // Skip if not in production
  if (!isProduction) {
    console.log(`[DEV] Would notify Google about: ${url} (${type})`);
    return { notified: false, dev: true };
  }
  
  try {
    const baseUrl = window.location.origin;
    const apiUrl = `${baseUrl}/api/notify-google-indexing`;
    // Call our Vercel serverless function instead of the Google API directly
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, type }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Google Indexing API error:', data.error);
      return { notified: false, error: data.error };
    }
    
    console.log(`Successfully notified Google about: ${url}`);
    return { notified: true, data: data.data };
  } catch (error) {
    console.error('Network error when notifying Google:', error);
    return { notified: false, error: 'Network error' };
  }
};