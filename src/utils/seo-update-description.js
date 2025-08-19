/**
 * Updates meta description across standard, Open Graph, and Twitter tags.
 * @param {string} description - Plain-text description (<= 160-180 chars recommended)
 * @returns {string|null} The applied description or null on error/env mismatch
 */
export function updateMetaDescriptions(description) {
  try {
    if (typeof window === 'undefined' || !document || !document.head) {
      return null;
    }
    const desc = (description || '').trim();
    if (!desc) return null;

    const ensureTag = (selector, attrs) => {
      let el = document.head.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        Object.entries(attrs).forEach(([k, v]) => (el.setAttribute(k, v)));
        document.head.appendChild(el);
      }
      return el;
    };

    // Standard description
    const metaDesc = ensureTag('meta[name="description"]', { name: 'description' });
    if (metaDesc.getAttribute('content') !== desc) {
      metaDesc.setAttribute('content', desc);
    }

    // Open Graph description
    const ogDesc = ensureTag('meta[property="og:description"]', { property: 'og:description' });
    if (ogDesc.getAttribute('content') !== desc) {
      ogDesc.setAttribute('content', desc);
    }

    // Twitter description
    const twDesc = ensureTag('meta[property="twitter:description"]', { property: 'twitter:description' });
    if (twDesc.getAttribute('content') !== desc) {
      twDesc.setAttribute('content', desc);
    }

    return desc;
  } catch (e) {
    console.error('Error updating meta descriptions:', e);
    return null;
  }
}
