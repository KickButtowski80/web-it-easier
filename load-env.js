// ES Module compatible environment variable loader
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env files
export function loadEnv() {
  // Try loading from different env files in priority order
  const envFiles = [
    '.env.local',
    '.env.test',
    '.env'
  ];
  
  let loaded = false;
  
  for (const file of envFiles) {
    const envPath = resolve(__dirname, file);
    if (fs.existsSync(envPath)) {
      console.log(`Loading environment from ${file}`);
      config({ path: envPath });
      loaded = true;
      break;
    }
  }
  
  if (!loaded) {
    console.warn('No environment file found. Using default environment variables.');
  }
  
  // Print environment variable status (safely)
  console.log('Environment variables loaded:');
  console.log('GOOGLE_CLIENT_EMAIL exists:', !!process.env.GOOGLE_CLIENT_EMAIL);
  console.log('GOOGLE_PRIVATE_KEY exists:', !!process.env.GOOGLE_PRIVATE_KEY);
  
  return process.env;
}
