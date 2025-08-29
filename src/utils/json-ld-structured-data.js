/**
 * Injects Table of Contents JSON-LD structured data into the document head
 * @param {Array} tocItems - Array of TOC items with id and text properties
 * @param {string} [baseUrl] - Base URL for generating absolute URLs (defaults to current page URL)
 */
export function injectTocJsonLd(tocItems = [], baseUrl) {
  if (typeof document === 'undefined' || !Array.isArray(tocItems) || tocItems.length === 0) return;

  try {
    // Remove existing TOC JSON-LD if any
    const existing = document.getElementById('toc-jsonld');
    if (existing) existing.remove();

    const base = baseUrl || (typeof window !== 'undefined' ? 
      `${window.location.origin}${window.location.pathname}` : '');

    const itemListElement = tocItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Thing',
        '@id': base ? `${base}#${item.id}` : `#${item.id}`,
        name: item.text
      }
    }));

    const data = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement
    };

    const script = document.createElement('script');
    script.id = 'toc-jsonld';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
  } catch (error) {
    console.error('Error injecting TOC structured data:', error);
  }
}

/**
 * Injects BlogPosting JSON-LD structured data into the document head
 * @param {Object} blogPost - The blog post data
 * @param {string} blogPost.title - The title of the blog post
 * @param {string} blogPost.excerpt - The excerpt/summary of the blog post
 * @param {string|Date} blogPost.publishedAt - The publication date
 * @param {string|Date} [blogPost.updatedAt] - The last modified date (defaults to publishedAt if not provided)
 * @param {string} [canonicalUrl] - The canonical URL (defaults to current page URL if not provided)
 * @param {Object} [additionalSchema] - Additional schema.org BlogPosting properties to include
 */
export function injectBlogPostStructuredData({
  title,
  excerpt,
  publishedAt,
  updatedAt = publishedAt,
  ...blogPost
}, canonicalUrl, additionalSchema = {}) {
  // Only run in browser environment
  if (typeof document === 'undefined') return;

  try {
    // Remove existing JSON-LD script if it exists
    const existing = document.getElementById('article-jsonld');
    if (existing) existing.remove();

    // Get base URL
    const baseUrl = window.location.origin;
    const canonicalUrl = url || `${baseUrl}${window.location.pathname}`;

    // Format dates to ISO string
    const formatDate = (date) => new Date(date || Date.now()).toISOString();

    // Create BlogPosting structured data object
    const blogPostData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title || 'Blog Post',
      description: excerpt || '',
      datePublished: formatDate(publishedAt),
      dateModified: formatDate(updatedAt || publishedAt),
      url: canonicalUrl,
      ...blogPost,
      ...additionalSchema
    };

    // Create and append script element
    const script = document.createElement('script');
    script.id = 'article-jsonld';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(blogPostData);
    document.head.appendChild(script);
  } catch (error) {
    console.error('Error injecting structured data:', error);
  }
}

/**
 * Removes JSON-LD structured data scripts from the document head
 * @param {string} [type='all'] - Type of JSON-LD to remove: 'article', 'toc', or 'all'
 * type all means remove all JSON-LD scripts 
 */ 
export function removeStructuredData(type = 'all') {
  if (typeof document === 'undefined') return;
  
  const ids = [];
  if (type === 'all' || type === 'article') ids.push('article-jsonld');
  if (type === 'all' || type === 'toc') ids.push('toc-jsonld');
  
  ids.forEach(id => {
    const element = document.getElementById(id);
    if (element) element.remove();
  });
}
