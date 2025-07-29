export function updateCanonicalUrl() {
    // Always use the production domain for canonical URLs
    const baseUrl = 'https://web-it-easier.vercel.app';
    const canonicalUrl = baseUrl + window.location.pathname.replace(/\/$/, ''); // Remove trailing slash if present
    
    // Get or create the canonical tag
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    
    if (!canonicalTag) {
        // Create the tag if it doesn't exist
        canonicalTag = document.createElement('link');
        canonicalTag.rel = 'canonical';
        document.head.appendChild(canonicalTag);
    }
    
    // Update the href
    canonicalTag.href = canonicalUrl;
    console.log('Updated canonical URL to:', canonicalUrl);
    
    // Return the canonical URL for debugging
    return canonicalUrl;
}