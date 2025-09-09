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

    observer = new IntersectionObserver(entries => {
      // Find the last intersecting heading (closest to top)
      const visible = entries
        .filter(e => e.isIntersecting)
        .map(e => e.target)

      if (visible.length) {
        const lastVisible = visible[visible.length - 1]
        if (lastVisible.id !== activeId.value) {
          activeId.value = lastVisible.id
        }
      }
    }, {
      rootMargin: `-${offset}px 0px -30% 0px`,
      threshold: [0, 0.5, 1]
    })

    headings.forEach(h => observer.observe(h))
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

  return { activeId, start, stop, isStarted: () => isStarted }
}
