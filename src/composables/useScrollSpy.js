import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';

/**
 * Simple scrollspy composable that tracks the currently visible heading
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.contentRoot - CSS selector for the container with scrollable content
 * @param {string} [options.headingSelector='h2, h3, h4'] - CSS selector for headings to observe
 * @param {number} [options.offset=0] - Offset in pixels (useful for fixed headers)
 * @param {boolean} [options.autoStart=true] - Whether to start observing automatically on mount
 * @returns {Object} - Returns activeId ref and start/stop functions
 */
export default function useScrollSpy(options = {}) {
  const { 
    contentRoot, 
    headingSelector = 'h2, h3, h4',
    offset = 0,
    autoStart = true
  } = options;
 
  const activeId = ref(null);
  let observer = null;
  let isStarted = false;
  // Keep a stable reference to the headings we observe, in DOM order
  let observedHeadings = [];

  const start = () => {
    if (isStarted) return;
    if (typeof window === 'undefined') return;
    
    stop(); // Clean up any existing observer

    const rootEl = typeof contentRoot === 'string' 
      ? document.querySelector(contentRoot) 
      : contentRoot;
      
    if (!rootEl) {
      console.warn('ScrollSpy: contentRoot element not found');
      return;
    }

    // Set up intersection observer
    observer = new IntersectionObserver((entries) => {
      // Guard against programmatic scrolling - check global flag
      if (globalThis.isProgrammaticScroll) return;
      
      // Compute the active heading as the one closest to the top offset,
      // preferring the last heading whose top is at or above the offset line.
      if (!observedHeadings.length) return;

      let candidate = null;
      for (const h of observedHeadings) {
        const rect = h.getBoundingClientRect();
        // If the heading top is above or at the activation line, consider it.
        if (rect.top - offset <= 1) {
          candidate = h; // keep moving forward to get the last one above the line
        } else {
          // As soon as we find one below the line, stop (DOM order)
          break;
        }
      }

      // Fallback: if none are above the line (e.g., at very top), pick the first visible one
      if (!candidate) {
        candidate = observedHeadings.find(h => h.getBoundingClientRect().top >= 0) || observedHeadings[0];
      }

      if (candidate && candidate.id && activeId.value !== candidate.id) {
        activeId.value = candidate.id;
      }
    }, {
      // Activate based on a band near the top; reduce bottom margin to avoid early next-heading activation
      rootMargin: `-${offset}px 0px -70% 0px`,
      threshold: [0, 0.25, 0.5, 0.75, 1]
    });

    // Find and observe all headings with IDs
    const headings = rootEl.querySelectorAll(headingSelector);
    if (headings.length === 0) {
      console.warn('ScrollSpy: No headings found with selector:', headingSelector);
      return;
    }

    let hasValidHeadings = false;
    observedHeadings = [];
    headings.forEach(heading => {
      if (heading.id) {
        observer.observe(heading);
        hasValidHeadings = true;
        observedHeadings.push(heading);
      }
    });

    if (hasValidHeadings) {
      isStarted = true;
    } else {
      console.warn('ScrollSpy: No headings with IDs found');
    }
  };

  const stop = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
      isStarted = false;
    }
  };

  // Auto-start on mount if enabled
  onMounted(async () => {
    if (autoStart) {
      await nextTick(); // Wait for the next tick to ensure DOM is ready
      start();
    }
  });

  // Clean up on unmount
  onBeforeUnmount(stop);

  return { 
    activeId, 
    start, 
    stop,
    isStarted: () => isStarted
  };
}
