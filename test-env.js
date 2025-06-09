// Simple script to test environment variables
import { loadEnv } from './load-env.js';

console.log('Testing environment variables');

// Load environment variables
loadEnv();

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('GOOGLE_CLIENT_EMAIL exists:', !!process.env.GOOGLE_CLIENT_EMAIL);
console.log('GOOGLE_PRIVATE_KEY exists:', !!process.env.GOOGLE_PRIVATE_KEY);

// Print all environment variables (with sensitive data redacted)
const envVars = {...process.env};
if (envVars.GOOGLE_PRIVATE_KEY) envVars.GOOGLE_PRIVATE_KEY = '[REDACTED]';
console.log('All environment variables:', JSON.stringify(envVars, null, 2));
