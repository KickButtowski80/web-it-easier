/**
 * Sitemap Generator for web-it-easier.vercel.app
 * 
 * WHY THIS APPROACH?
 * 1. Environment Separation:
 *    - Frontend (browser) and Node.js have different requirements
 *    - This script runs in Node.js, separate from the frontend Firebase config
 * 
 * 2. Why Not Import from firebase.js?
 *    - firebase.js is configured for browser environment (uses import.meta.env)
 *    - This script needs Node.js environment variables (process.env)
 *    - Keeps frontend and backend concerns separate
 * 
 * 3. Benefits:
 *    - No browser-specific code in Node.js
 *    - Clear separation of concerns
 *    - Better error handling for server-side execution
 *    - Can be scheduled independently of the frontend
 * 
 * USAGE:
 *   node scripts/generate-sitemap.mjs
 */

// Sitemap generator script for web-it-easier.vercel.app
import { writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current file path for proper relative imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables in Node.js
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

dotenv.config({ path: join(process.cwd(), '.env') });

// Initialize Firebase with environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper function to get posts directly
async function getPosts() {
  try {
    const postsCol = collection(db, 'posts');
    const postSnapshot = await getDocs(postsCol);
    return postSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate().toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
    }));
  } catch (error) {
    console.error('❌ Error fetching posts:', error.message);
    throw error;
  }
}

export const updateSitemap = async () => {
  console.log('🚀 Starting sitemap generation...');
  
  try {
    console.log('📡 Fetching posts from Firebase...');
    const posts = await getPosts();
    console.log(`✅ Found ${posts.length} posts`);
    
    const sitemapEntries = [];
    
    // Base URLs
    sitemapEntries.push(`
    <url>
      <loc>https://web-it-easier.vercel.app/</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>1.0</priority>
    </url>
  `);

    // Add all blog posts
    posts.forEach(post => {
      console.log(`Processing post: ${post.title}`);
      sitemapEntries.push(`
    <url>
      <loc>https://web-it-easier.vercel.app/blog/${post.title.toLowerCase().replace(/\s+/g, '-')}</loc>
      <lastmod>${post.date}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>
  `);
    });

    // Generate final sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.join('\n')}
</urlset>`;

    // Save to file
    const filePath = join(process.cwd(), 'public', 'sitemap.xml');
    writeFileSync(filePath, sitemap);
    
    console.log(`✅ Sitemap written to: ${filePath}`);
    console.log(`📊 Total URLs: ${sitemapEntries.length}`);
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error.message);
    console.error('🔍 Stack trace:', error.stack);
    throw error;
  }
};

// Allow direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  updateSitemap();
}