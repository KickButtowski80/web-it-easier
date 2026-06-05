// Simple JWT test without Google APIs
import { google } from 'googleapis';

async function simpleTest() {
  console.log('=== Simple JWT Test ===');
  
  // Load environment variables
  if (process.env.NODE_ENV !== 'production') {
    const { loadEnv } = await import('./load-env.js');
    loadEnv();
  }
  
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKeyBase64 = process.env.GOOGLE_PRIVATE_KEY_BASE64;
  
  if (!clientEmail || !privateKeyBase64) {
    console.log('❌ Missing environment variables');
    return;
  }
  
  // Decode the private key
  const privateKey = Buffer.from(privateKeyBase64, 'base64').toString('utf-8');
  
  console.log('Key decoded, length:', privateKey.length);
  console.log('Key starts correctly:', privateKey.startsWith('-----BEGIN PRIVATE KEY-----'));
  console.log('Key ends correctly:', privateKey.endsWith('-----END PRIVATE KEY-----'));
  
  try {
    // Try to create JWT client with explicit object
    console.log('Creating JWT client...');
    const jwtClient = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/indexing']
    });
    
    console.log('JWT client created successfully');
    console.log('Client properties:', {
      email: jwtClient.email,
      key: !!jwtClient.key,
      keyLength: jwtClient.key?.length || 0
    });
    
    // Try to authorize
    console.log('Attempting authorization...');
    await jwtClient.authorize();
    console.log('✅ Authorization successful!');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('Stack:', error.stack);
  }
}

simpleTest();
