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
    
    console.log(`[Google Indexing] Calling API: ${apiUrl}`, {
      url,
      type,
      timestamp: new Date().toISOString()
    });

    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, type }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    // Log the response status and headers
    console.log(`[Google Indexing] Response status: ${response.status} ${response.statusText}`);
    const responseText = await response.text();
    let responseData;
    
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.error('[Google Indexing] Failed to parse response as JSON:', responseText);
      throw new Error(`Invalid JSON response: ${responseText.substring(0, 200)}...`);
    }

    if (!response.ok) {
      console.error('[Google Indexing] API Error:', {
        status: response.status,
        statusText: response.statusText,
        response: responseData
      });
      throw new Error(`HTTP error! status: ${response.status}, message: ${responseData.error || 'Unknown error'}`);
    }

    console.log('[Google Indexing] Success:', responseData);
    return { notified: true, data: responseData };

  } catch (error) {
    console.error('[Google Indexing] Error in notifyGoogle:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      url,
      type
    });
    
    // Return a more detailed error object
    return { 
      notified: false, 
      error: {
        message: error.message,
        name: error.name,
        status: error.status,
        response: error.response
      }
    };
  }
};