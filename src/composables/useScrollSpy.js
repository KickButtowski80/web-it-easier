import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

/**
 * Reliable ScrollSpy composable with improved detection for short headings
 *
 * @param {Object} options
 * @param {string|Element} options.contentRoot - Container element or selector
 * @param {string} [options.headingSelector='h2, h3, h4'] - Which headings to track
 * @param {number} [options.offset=0] - Pixel offset for fixed headers
 * @param {boolean} [options.autoStart=true] - Auto-start observing on mount
 * @param {number} [options.threshold=0.1] - Intersection threshold (0-1)
 * @param {string} [options.rootMargin='0px'] - Root margin for intersection observer
 */
export default function useScrollSpy(options = {}) {
  const {
    contentRoot,
    headingSelector = 'h2, h3, h4',
    offset = 0,
    autoStart = true,
    threshold = 0.1,
    rootMargin = '0px'
  } = options

  const activeId = ref(null)
  let observer = null
  let isStarted = false
  let headings = []

  // Function to detect if intersection happened at top or bottom
  const didThisIntersectionHappenAtTop = (entry) => {
    return entry.rootBounds.bottom - entry.boundingClientRect.bottom > entry.rootBounds.bottom / 2
  }

  const start = () => {
    if (isStarted || typeof window === 'undefined') return

    const rootEl = typeof contentRoot === 'string'
      ? document.querySelector(contentRoot)
      : contentRoot

    if (!rootEl) {
      console.warn('ScrollSpy: contentRoot not found')
      return
    }

    headings = [...rootEl.querySelectorAll(headingSelector)]
      .filter(h => h.id)
      .sort((a, b) => {
        // Sort by document order
        const aRect = a.getBoundingClientRect()
        const bRect = b.getBoundingClientRect()
        return aRect.top - bRect.top
      })

    console.log('Observing headings:', headings.map(h => h.id))

    observer = new IntersectionObserver(entries => {
      const intersectingEntries = entries.filter(entry => entry.isIntersecting);
      if (intersectingEntries.length > 0) {
        // Choose the topmost intersecting heading
        const topmost = intersectingEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (topmost.target.id !== activeId.value) {
          activeId.value = topmost.target.id;
        }
      } else {
        // Handle non-intersecting for scrolling up
        const nonIntersecting = entries.filter(entry => !entry.isIntersecting);
        if (nonIntersecting.length > 0) {
          const entry = nonIntersecting[0];
          if (!didThisIntersectionHappenAtTop(entry)) {
            // Scrolling up: Set previous heading
            const currentIndex = headings.findIndex(h => h === entry.target);
            if (currentIndex > 0) {
              activeId.value = headings[currentIndex - 1].id;
            }
          }
        }
      }
    }, {
      rootMargin: offset > 0 
        ? `-${Math.min(offset, 100)}px 0px -30% 0px`
        : '0px 0px -30% 0px',
      threshold: 0
    })

    headings.forEach(h => observer.observe(h))
    isStarted = true
  }

  const stop = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
    
    isStarted = false
  }

  // Method to manually set active heading (useful for programmatic scrolling)
  const setActive = (id) => {
    activeId.value = id
  }

  onMounted(async () => {
    if (autoStart) {
      await nextTick()
      start()
    }
  })

  onBeforeUnmount(stop)

  return { 
    activeId, 
    start, 
    stop, 
    setActive,
    isStarted: () => isStarted 
  }
}