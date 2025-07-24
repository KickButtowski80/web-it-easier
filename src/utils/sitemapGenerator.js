// src/utils/sitemapGenerator.js
import { collection, getDocs } from 'firebase/firestore/lite';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { db } from '../config/firebase';
import { titleToSlug } from './helpers';

export const updateSitemap = async () => {
  try {
    const posts = await getDocs(collection(db, 'posts'));
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
      sitemapEntries.push(`
        <url>
          <loc>https://web-it-easier.vercel.app/blog/${titleToSlug(post.data().title)}</loc>
          <lastmod>${new Date(post.data().updatedAt?.toDate() || new Date()).toISOString().split('T')[0]}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>
      `);
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemapEntries.join('\n')}
</urlset>`;

    writeFileSync(join(process.cwd(), 'public', 'sitemap.xml'), sitemap);
  } catch (error) {
    console.error('Error updating sitemap:', error);
  }
};