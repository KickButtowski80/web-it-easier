// Add to your firebase.js or a new sitemap.js utility file
import { collection, getDocs } from 'firebase/firestore/lite';
import { writeFileSync } from 'fs';
import { join } from 'path';

export const updateSitemap = async () => {
  const posts = await getDocs(collection(db, 'posts'));
  const sitemapEntries = [];
  
  // Base URLs (like homepage, /blog, etc.)
  sitemapEntries.push(`
    <url>
      <loc>https://izak-portfolio.vercel.app/</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>1.0</priority>
    </url>
  `);

  // Add all blog posts
  posts.forEach(post => {
    sitemapEntries.push(`
      <url>
        <loc>https://izak-portfolio.vercel.app/blog/${titleToSlug(post.data().title)}</loc>
        <lastmod>${new Date(post.data().updatedAt?.toDate() || new Date()).toISOString().split('T')[0]}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
      </url>
    `);
  });

  // Generate full sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemapEntries.join('\n')}
</urlset>`;

  // Save to public/sitemap.xml
  writeFileSync(
    join(process.cwd(), 'public', 'sitemap.xml'), 
    sitemap
  );
};