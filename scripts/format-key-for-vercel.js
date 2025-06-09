/**
 * This script reads your private key from .env.local and formats it for Vercel
 * by converting actual newlines to literal '\n' characters.
 * 
 * Usage:
 * node scripts/format-key-for-vercel.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Read the .env.local file
try {
  const envPath = path.join(rootDir, '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Find the GOOGLE_PRIVATE_KEY line and extract the key
  const privateKeyMatch = envContent.match(/GOOGLE_PRIVATE_KEY="([^]*?)"/);
  
  if (!privateKeyMatch) {
    console.error('Could not find GOOGLE_PRIVATE_KEY in .env.local');
    process.exit(1);
  }
  
  // Extract the multi-line key
  const multiLineKey = privateKeyMatch[1];
  
  // Convert actual newlines to literal '\n'
  const singleLineKey = multiLineKey.replace(/\n/g, '\\n');
  
  console.log('\n=== FORMATTED KEY FOR VERCEL ===');
  console.log('Copy everything between the lines below:');
  console.log('-----------------------------------');
  console.log(singleLineKey);
  console.log('-----------------------------------');
  console.log('\nInstructions:');
  console.log('1. Copy the entire string above');
  console.log('2. In Vercel, set GOOGLE_PRIVATE_KEY to this value');
  console.log('3. Make sure to include the double quotes if setting via dashboard');
  console.log('4. Redeploy your application');
  
} catch (error) {
  console.error('Error reading or processing .env.local:', error.message);
  process.exit(1);
}
