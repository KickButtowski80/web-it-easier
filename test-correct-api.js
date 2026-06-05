// Test correct Google Indexing API
import { google } from 'googleapis';

async function testCorrectAPI() {
  console.log('=== Correct Google Indexing API Test ===');
  
  // Load environment variables
  if (process.env.NODE_ENV !== 'production') {
    const { loadEnv } = await import('./load-env.js');
    loadEnv();
  }
  
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKeyBase64 = process.env.GOOGLE_PRIVATE_KEY_BASE64;
  
  // Decode the private key
  const privateKey = Buffer.from(privateKeyBase64, 'base64').toString('utf-8');
  
  try {
    // Create JWT client
    const jwtClient = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/indexing']
    });
    
    // Authorize
    await jwtClient.authorize();
    console.log('✅ JWT authorization successful!');
    
    // Test API call
    console.log('Testing Google Indexing API...');
    const indexing = google.indexing({
      version: 'v3',
      auth: jwtClient
    });
    
    // Test a publish notification (this is the main API call)
    const testUrl = 'https://web-it-easier.vercel.app/';
    const result = await indexing.urlNotifications.publish({
      requestBody: {
        url: testUrl,
        type: 'URL_UPDATED'
      }
    });
    
    console.log('✅ Google Indexing API working!');
    console.log('API Response:', {
      status: result.status,
      data: result.data
    });
    
    return true;
    
  } catch (error) {
    console.log('❌ API Error:', error.message);
    console.log('Error code:', error.code);
    
    if (error.code === 403) {
      console.log('🔍 403 Error - Possible causes:');
      console.log('   - Indexing API not enabled in Google Cloud Console');
      console.log('   - Service account lacks Indexing API permissions');
      console.log('   - API quota exceeded');
      console.log('   - URL not verified in Search Console');
    }
    
    return false;
  }
}

testCorrectAPI().then(success => {
  console.log('\n=== Final Result ===');
  console.log(success ? '✅ All tests passed!' : '❌ Tests failed');
}).catch(error => {
  console.error('❌ Test failed:', error);
});
