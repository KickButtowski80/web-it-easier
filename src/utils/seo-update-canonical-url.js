/**
 * Updates the canonical URL for the current page
 * @param {string} [customUrl] - Optional custom URL to use instead of generating one
 * @returns {string} The updated canonical URL or null if there was an error
 */
export function updateCanonicalUrl(customUrl = null) {
    try {
        if (typeof window === 'undefined' || !document || !document.head) {
            return null;
        }

        let canonicalUrl = customUrl;
        
        // If no custom URL provided, generate one based on current path
        if (!canonicalUrl) {
            const baseUrl = 'https://web-it-easier.vercel.app';
            const path = window.location.pathname.replace(/\/+$/, ''); // Remove trailing slashes if present
            canonicalUrl = baseUrl + (path || '/');
        }
        
        if (!canonicalUrl) {
            return null;
        }
        
        // Get or create the canonical tag
        let canonicalTag = document.querySelector('link[rel="canonical"]');
        
        if (!canonicalTag) {
            // Create the tag if it doesn't exist
            canonicalTag = document.createElement('link');
            canonicalTag.rel = 'canonical';
            document.head.appendChild(canonicalTag);
        } else if (canonicalTag.href === canonicalUrl) {
            // No need to update if the URL hasn't changed
            return canonicalUrl;
        }
        
        // Update the href
        canonicalTag.href = canonicalUrl;
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
    try {
        if (typeof window === 'undefined' || !document || !document.head) {
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
    } catch (error) {
        // Silently fail in production
        if (import.meta.env.DEV) {
            console.error('Error in restoreCanonical:', error);
        }
    }
}