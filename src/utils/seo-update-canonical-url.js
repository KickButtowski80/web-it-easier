/**
 * Updates the canonical URL for the current page
 * @param {string} [customUrl] - Optional custom URL to use instead of generating one
 * @returns {string} The updated canonical URL or null if there was an error
 */
export function updateCanonicalUrl(customUrl = null) {
    console.group('[Canonical] Updating canonical URL');
    try {
        if (typeof window === 'undefined' || !document || !document.head) {
            console.warn('Not in a browser environment');
            console.groupEnd();
            return null;
        }

        let canonicalUrl = customUrl;
        
        // If no custom URL provided, generate one based on current path
        if (!canonicalUrl) {
            const baseUrl = 'https://web-it-easier.vercel.app';
            const path = window.location.pathname.replace(/\/+$/, ''); // Remove trailing slashes if present
            canonicalUrl = baseUrl + (path || '/');
        }
        
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

/**
 * Restores the canonical URL to its original state
 * @param {string} [originalCanonical] - Original canonical HTML to restore
 * @param {string} [commentText] - Optional comment text to look for when restoring
 */
export function restoreCanonical(originalCanonical, commentText = 'Canonical URL') {
    console.group('[Canonical] Restoring canonical URL');
    try {
        if (typeof window === 'undefined' || !document || !document.head) {
            console.warn('Not in a browser environment');
            console.groupEnd();
            return;
        }

        // Remove any existing canonical tag
        const existingCanonical = document.querySelector('link[rel="canonical"]');
        if (existingCanonical) {
            existingCanonical.remove();
        }

        if (originalCanonical) {
            // Find comment if specified
            const comment = commentText 
                ? Array.from(document.head.childNodes).find(
                    node => node.nodeType === Node.COMMENT_NODE &&
                      node.textContent.trim() === commentText
                  )
                : null;

            if (comment) {
                // Create a temporary div to parse the HTML string
                const temp = document.createElement('div');
                temp.innerHTML = originalCanonical;
                const defaultCanonicalEl = temp.firstChild;

                // Insert after the comment
                document.head.insertBefore(defaultCanonicalEl, comment.nextSibling);
            } else {
                // Fallback to appending
                document.head.insertAdjacentHTML('beforeend', originalCanonical);
            }
        }
        console.groupEnd();
    } catch (error) {
        console.error('Error in restoreCanonical:', error);
        console.groupEnd();
    }
}