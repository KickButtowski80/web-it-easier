import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

/**
 * Lightweight ScrollSpy with IntersectionObserver
 *
 * @param {Object} options
 * @param {string|Element} options.contentRoot - Container element or selector
 * @param {string} [options.headingSelector='h2, h3, h4'] - Which headings to track
 * @param {number} [options.offset=0] - Pixel offset for fixed headers
 * @param {boolean} [options.autoStart=true] - Auto-start observing on mount
 */
export default function useScrollSpy(options = {}) {
  const {
    contentRoot,
    headingSelector = 'h2, h3, h4',
    offset = 0,
    autoStart = true
  } = options

  const activeId = ref(null)
  let observer = null
  let isStarted = false
  // Adjust rootMargin to be more precise with intersection detection
  const rootMargin = `-${Math.min(offset, 100)}px 0px -30% 0px`

  const start = () => {
    if (isStarted || typeof window === 'undefined') return

    const rootEl = typeof contentRoot === 'string'
      ? document.querySelector(contentRoot)
      : contentRoot

    if (!rootEl) {
      console.warn('ScrollSpy: contentRoot not found')
      return
    }

    const headings = [...rootEl.querySelectorAll(headingSelector)]
    .filter(h => h.id)
    if (!headings.length) {
      console.warn('ScrollSpy: no headings with IDs')
      return
    }

   
    
    const updateObserver = () => {
      if (observer) {
        // Disconnect old observer
        observer.disconnect()
      }

      // Create new observer with updated rootMargin
      observer = new IntersectionObserver(entries => {
        // Track all visible headings with their intersection ratio
        const visibleEntries = entries
          .filter(entry => entry.isIntersecting || entry.intersectionRatio > 0)
          .map(entry => ({
            id: entry.target.id,
            element: entry.target,
            ratio: entry.intersectionRatio,
            // Calculate distance from viewport top (lower is higher on screen)
            distance: entry.boundingClientRect.top
          }));
          console.log("visibleEntries", visibleEntries);
        if (visibleEntries.length) {
          // Find the most visible heading (highest ratio, or if equal, the one higher on screen)
          const mostVisible = visibleEntries.reduce((prev, current) => {
            // If ratios are close (within 0.1), prefer the one higher on the page
            if (Math.abs(current.ratio - prev.ratio) < 0.1) {
              return current.distance < prev.distance ? current : prev;
            }
            return current.ratio > prev.ratio ? current : prev;
          });

          if (mostVisible.id && mostVisible.id !== activeId.value) {
            activeId.value = mostVisible.id;
          }
          console.log("mostVisible", mostVisible);
        }
      }, {
        rootMargin: `-${offset}px 0px -30% 0px`,
        // Use multiple thresholds for more precise intersection detection
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
      })
      
      // Re-observe all headings
      headings.forEach(h => observer.observe(h))
    }
    
    // Initial observer setup
    updateObserver()

    isStarted = true
  }

  const stop = () => {
    observer?.disconnect()
    observer = null
    isStarted = false
  }

  onMounted(async () => {
    if (autoStart) {
      await nextTick()
      start()
    }
  })

  onBeforeUnmount(stop)
  // Opt-in utility for manual TOC navigation (call from component if needed)
  function setupManualTocNav(navSelector = '#table-of-contents:has(ul#toc-body li a)') {
    let currentSection = null;
    function updateActiveNav() {
      document.querySelectorAll(navSelector).forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${currentSection}`) {
          a.classList.add('active');
        }
      });
    }
    function clickHandler(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      currentSection = targetId;
      updateActiveNav();
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // Attach listeners
    document.querySelectorAll(navSelector).forEach(link => {
      link.addEventListener('click', clickHandler);
    });
    // Return cleanup function
    return () => {
      document.querySelectorAll(navSelector).forEach(link => {
        link.removeEventListener('click', clickHandler);
      });
    };
  }
  return { activeId, start, stop, isStarted: () => isStarted, setupManualTocNav }
}
