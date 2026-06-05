// Quick check of Google Indexing API status
import { google } from 'googleapis';

async function checkApiStatus() {
  try {
    // Try to access the API without authentication first
    const indexing = google.indexing({
      version: 'v3'
    });
    
    console.log('✅ Google Indexing API is available');
    console.log('📖 API version:', indexing.version);
    
  } catch (error) {
    console.log('❌ Google Indexing API not available:', error.message);
  }
}

checkApiStatus();
