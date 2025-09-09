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

    const visibleHeadings = new Set();
    let lastActiveId = null;

    observer = new IntersectionObserver((entries) => {
 

      entries.forEach(entry => {
        if (entry.isIntersecting) {
          visibleHeadings.add(entry.target);
        } else {
          visibleHeadings.delete(entry.target);
        }
      });

      let newActiveId = null;

      if (visibleHeadings.size > 0) {
        // If there are visible headings, find the last one in DOM order.
        for (let i = observedHeadings.length - 1; i >= 0; i--) {
          const heading = observedHeadings[i];
          if (visibleHeadings.has(heading)) {
            newActiveId = heading.id;
            break;
          }
        }
      } else {
        // If no headings are visible, we are in a gap. We use the last known
        // active heading to maintain state, which is more robust.
        newActiveId = lastActiveId;
      }

      if (newActiveId !== null && activeId.value !== newActiveId) {
        activeId.value = newActiveId;
      }
      // Keep track of the last active ID for gap handling.
      if (newActiveId) {
        lastActiveId = newActiveId;
      }

    }, {
      // Activate based on a band near the top; reduce bottom margin to avoid early next-heading activation
      rootMargin: `-${offset}px 0px -70% 0px`,
      threshold: [0, 0.5, 1]
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
