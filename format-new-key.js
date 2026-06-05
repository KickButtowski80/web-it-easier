// Format new private key for Vercel
import { readFileSync, writeFileSync } from 'fs';
import { createHash } from 'crypto';

// Replace this with your new private key from the JSON file
const newPrivateKey = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC1MKP0VUbJqArq\nab7p2I/1DHdKG5EWaFIiDE01af4bskgCeaMfrVZpmBlzuZjoKRUruq5XJhTyIwL8\nN1lSzoDSnC/8pzYh+/Z8l0D69uGVdf2lsw3K4sXesDYDwVkkRFiVDZuIDrTVTjIB\nRqq+zLzZ4PTapehuzZreGJS+uqkkSImS/dmRmZd57OTPrBVnlv5BHNVOWJwIPdtM\ncVlFUeMHrSVldZRT/tbfpowHfiWCr6Wnu8IA4XDeBjmcMkfZwjrQcePUWpci3yb0\nVTV8QoCukpYJGqLIsMm7djVhL5050AkWlhOeczhFC7L4KhknkfYuw901xv0Ls8fp\nnH5hfKBXAgMBAAECggEAHSamOjk+GlOe7ff1b0oYXySSTKoCvcgq7q9r/JwA9hPI\n4h0P0ZjhvjtqXOQPZcq2TULLqdnGpO5dHJcLF/eBYmEel1ePrggLsB/lpHrz8Ef7\ndx1HqsyxaRKQnioNXXhhiBmYXFuBXJAoG2xzLB9kgulee48Vxj3uHK13wPfnHp8H\nfMAwOH8uDiDLXo91KM0usC8Za5jxj53u3R2TLWuZR0byK5CJ+mVG1UkHLon3/5xX\nUrO+fVxWVhLMucwB0yHXkHz464eNJlHcqnf5+nnIQz4JHK+XeTdT/fSlfJefpWtE\nhqeVFdP/yN6F3UFsHC43/7rpeDm8Ue+BXYTb5Wo5gQKBgQDpZw38beTCMe6RcNhx\nJBl8qGXCadPO7gaaKJlTlD+KxHb7+OsMdhu/yxYmAtOelEWHNj4jDDvnJBMUEreF\nx0O/Hg+WsC0XN2E19y871yyPBcSzCUUbj5HM0ydfUgX2lnYbiMOGxMCE6ksOW4eo\nY8937OtqzHLREvUE0EzBjZuk1QKBgQDGu3vJHeTYENvo8i5z5KW5mYu4gi3afaz/\nOITiEv7CPotlL9/b5hAfXsPDERGzX1ppcNVit2T2cE7ByJZyEaDMDZBM71Wwh64J\n8JrLvwWP1n2P/tiI851Ovuuxg2J1X+GmavRzRj+T9vUd6oogzHGXKz5j9kO+6tyY\nDR4sdPG2ewKBgHKCXek/nSDtUGdIntf7ZwmysKIOO51lSBXv3zGTJQ2Wz+1VNTRa\n6chSAd7KOjqt8eKhaSDWyrjfCQErIaDfn0wvmmRKsQSX5fiM+j54leLhaJyR6rbX\n3CdKXSG14zkUnoNpuMvw0ackL4iuvUKPHWVv9hvijF4o187xxwaazAa1AoGAF59F\ncXx6LSyj1yaiWug8wrj7oKzoomX54ERply3G1nP0wcxVAaBxHil3f4JR5k5ZQttE\nof1GpPxogCRFrb1mrZqXIm34c4lNKKVO4RUNpjFKr4kNWAoNEsUi4vDJDUaeXdes\nwt8Aw6fBLxMn5AopHlznh55IIzNrkS9N/N7RtG0CgYBpSadLgKEPXK3HHOTVs8+M\np9/zogABVj23mjRQNBFKEDvTgwIpi1+LV5NJV+D3rs0ed3e33BHBhSRXk9w3YYgu\nFMpgLxs+Fpbkz4ALqzHw+TKyjSSDve5lFD3gbXoQdAsEfgKX4wiM/KbfAgBl5iDO\nC1EWJM3Tp/UX77xIiepG7g==\n-----END PRIVATE KEY-----`;

// Remove quotes and fix newlines
const cleanKey = newPrivateKey
  .replace(/^"(.*)"$/, '$1') // Remove surrounding quotes
  .replace(/\\n/g, '\n');     // Convert literal \n to actual newlines

// Verify the key format
console.log('Key format check:');
console.log('✅ Starts with BEGIN:', cleanKey.startsWith('-----BEGIN PRIVATE KEY-----'));
console.log('✅ Ends with END:', cleanKey.endsWith('-----END PRIVATE KEY-----'));
console.log('✅ Has newlines:', cleanKey.includes('\n'));
console.log('✅ Length:', cleanKey.length);

// Create Base64 version for Vercel
const base64Key = Buffer.from(cleanKey).toString('base64');

console.log('\n=== FOR VERCEL ENVIRONMENT VARIABLES ===');
console.log('\n1. GOOGLE_CLIENT_EMAIL:');
console.log('indexing-it-group-blogpost-ser@it-group-461723.iam.gserviceaccount.com');

console.log('\n2. GOOGLE_PRIVATE_KEY_BASE64:');
console.log(base64Key);

console.log('\n=== INSTRUCTIONS ===');
console.log('1. Copy the Base64 key above');
console.log('2. Go to Vercel dashboard → Project → Settings → Environment Variables');
console.log('3. Update GOOGLE_PRIVATE_KEY_BASE64 with the new Base64 value');
console.log('4. Redeploy your application');
console.log('5. Test the API again');

// Save Base64 to file for easy copying
writeFileSync('vercel-key-base64.txt', base64Key);
console.log('\n📁 Base64 key saved to: vercel-key-base64.txt');
