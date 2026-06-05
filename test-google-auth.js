// Test script to verify Google Indexing API credentials
import { google } from 'googleapis';

async function testGoogleAuth() {
  console.log('=== Testing Google Indexing API Authentication ===\n');
  
  // Load environment variables (only in development)
  if (process.env.NODE_ENV !== 'production') {
    const { loadEnv } = await import('./load-env.js');
    loadEnv();
  }
  
  // Check environment variables
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKeyBase64 = process.env.GOOGLE_PRIVATE_KEY_BASE64;
  
  console.log('Environment Variables Check:');
  console.log('✅ GOOGLE_CLIENT_EMAIL exists:', !!clientEmail);
  console.log('✅ GOOGLE_PRIVATE_KEY_BASE64 exists:', !!privateKeyBase64);
  console.log('📧 Client Email:', clientEmail || 'NOT FOUND');
  console.log('🔑 Private Key Length:', privateKeyBase64?.length || 0);
  
  if (!clientEmail || !privateKeyBase64) {
    console.log('\n❌ Missing environment variables!');
    return false;
  }
  
  try {
    // Decode the private key
    const privateKey = Buffer.from(privateKeyBase64, 'base64').toString('utf-8');
    console.log('🔓 Private key decoded successfully');
    console.log('🔑 Private key format check:', {
      length: privateKey.length,
      hasNewlines: privateKey.includes('\n'),
      hasLiteralBackslashN: privateKey.includes('\\n'),
      startsCorrectly: privateKey.startsWith('-----BEGIN PRIVATE KEY-----'),
      endsCorrectly: privateKey.endsWith('-----END PRIVATE KEY-----')
    });
    
    // Fix literal \n if needed
    let finalPrivateKey = privateKey;
    if (privateKey.includes('\\n')) {
      finalPrivateKey = privateKey.replace(/\\n/g, '\n');
      console.log('🔧 Fixed literal \\n to actual newlines');
    }
    
    // Create JWT client and test authorization
    console.log('\n🔐 Testing JWT authorization...');
    console.log('JWT client params:', {
      email: clientEmail,
      keyLength: finalPrivateKey.length,
      keyPreview: finalPrivateKey.substring(0, 50) + '...' + finalPrivateKey.substring(finalPrivateKey.length - 50)
    });
    
    const jwtClient = new google.auth.JWT(
      clientEmail,
      null,
      finalPrivateKey,
      ['https://www.googleapis.com/auth/indexing'],
      null
    );
    
    console.log('JWT client created, attempting authorization...');
    
    await jwtClient.authorize();
    console.log('✅ JWT authorization successful!');
    
    // Test actual API call (minimal)
    console.log('\n🌐 Testing Google Indexing API access...');
    const indexing = google.indexing({
      version: 'v3',
      auth: jwtClient
    });
    
    // Try to get URL notifications (this tests API access)
    try {
      const result = await indexing.urlNotifications.list({
        'pageSize': 1
      });
      console.log('✅ Google Indexing API access confirmed!');
      console.log('📊 API Response status:', result.status);
      return true;
      
    } catch (apiError) {
      console.log('❌ API call failed:', apiError.message);
      console.log('🔍 Error code:', apiError.code);
      
      if (apiError.code === 403) {
        console.log('🚫 403 Error - Possible causes:');
        console.log('   - Indexing API not enabled in Google Cloud Console');
        console.log('   - Service account lacks Indexing API permissions');
        console.log('   - API quota exceeded');
      }
      return false;
    }
    
  } catch (error) {
    console.log('\n❌ Authentication failed:', error.message);
    console.log('🔍 Error details:', {
      name: error.name,
      code: error.code,
      stack: error.stack?.split('\n')[0]
    });
    
    if (error.message.includes('invalid_grant')) {
      console.log('🔑 Private key is invalid or expired');
    }
    
    return false;
  }
}

// Run the test
testGoogleAuth().then(success => {
  console.log('\n=== Test Result ===');
  console.log(success ? '✅ All tests passed!' : '❌ Tests failed - check above for details');
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('❌ Test script failed:', error);
  process.exit(1);
});
