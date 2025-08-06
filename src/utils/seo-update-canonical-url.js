/**
 * Updates the canonical URL for the current page
 * @returns {string} The updated canonical URL or null if there was an error
 */
export function updateCanonicalUrl() {
    console.group('[Canonical] Updating canonical URL');
    try {
        if (typeof window === 'undefined' || !document || !document.head) {
            console.warn('Not in a browser environment');
            console.groupEnd();
            return null;
        }

        // Always use the production domain for canonical URLs
        const baseUrl = 'https://web-it-easier.vercel.app';
        const path = window.location.pathname.replace(/\/+$/, ''); // Remove trailing slashes if present
        const canonicalUrl = baseUrl + (path || '/');
        
        console.log('Base URL:', baseUrl);
        console.log('Current path:', window.location.pathname);
        console.log('Generated canonical URL:', canonicalUrl);
        
        if (!canonicalUrl) {
            console.error('Failed to generate canonical URL');
            console.groupEnd();
            return null;
        }
        
        // Get or create the canonical tag
        let canonicalTag = document.querySelector('link[rel="canonical"]');
        
        if (!canonicalTag) {
            console.log('No existing canonical tag found, creating a new one');
            // Create the tag if it doesn't exist
            canonicalTag = document.createElement('link');
            canonicalTag.rel = 'canonical';
            document.head.appendChild(canonicalTag);
            console.log('Created new canonical tag');
        } else if (canonicalTag.href === canonicalUrl) {
            // No need to update if the URL hasn't changed
            console.log(`URL already set to: ${canonicalUrl}`);
            console.groupEnd();
            return canonicalUrl;
        }
        
        // Update the href
        const previousUrl = canonicalTag.href || 'none';
        canonicalTag.href = canonicalUrl;
        
        if (import.meta.env.DEV) {
            console.log(`Updated canonical URL from "${previousUrl}" to:`, canonicalUrl);
            console.log('Document head:', document.head.innerHTML);
        }
        
        console.groupEnd();
        return canonicalUrl;
    } catch (error) {
        console.error('Error in updateCanonicalUrl:', error);
        console.groupEnd();
        return null;
    }
}