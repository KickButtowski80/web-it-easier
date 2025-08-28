// src/composables/useScrollSpy.js
// Vue 3 composable for TOC scrollspy using IntersectionObserver with sensible fallbacks
// Usage (in a component):
// const { activeId } = useScrollSpy({
//   contentRoot: '#post-content',
//   headingSelector: 'h2, h3',
//   offset: 80, // height of fixed header if any
//   getId: (el) => el.id, // customize if IDs are generated differently
// });
// Then bind in template:
// <a :class="{ active: activeId === item.id }" :aria-current="activeId === item.id ? 'true' : undefined" ...>

import { onMounted, onBeforeUnmount, ref } from 'vue'

/**
 * Create a performant scrollspy that marks the heading currently in view as active.
 *
 * Options:
 * - contentRoot: Element | string (selector). Root that contains headings. Required.
 * - headingSelector: string. Defaults to 'h2, h3'.
 * - offset: number. Pixels to offset from top (e.g., fixed header). Used in fallback and IO rootMargin.
 * - getId: (el: Element) => string. How to read an ID from a heading. Defaults to el.id.
 * - autoStart: boolean. Start automatically on mount. Defaults to true.
 *
 * Returns:
 * - activeId: Ref<string | null>
 * - start: () => void
 * - stop: () => void
 */
export default function useScrollSpy(options = {}) {
  const {
    contentRoot,
    headingSelector = 'h2, h3',
    offset = 0,
    getId = (el) => el.id,
    autoStart = true,
  } = options

  const activeId = ref(null)
  let observer = null
  let headings = []
  let rootEl = null

  const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

  function resolveRoot(elOrSelector) {
    if (!isBrowser || !elOrSelector) return null
    if (typeof elOrSelector === 'string') return document.querySelector(elOrSelector)
    return elOrSelector
  }

  function computeFallbackActiveId() {
    // Pick the last heading whose top is above the viewport top (with offset)
    const scrollTop = window.scrollY + offset + 1
    let current = null
    for (const h of headings) {
      if (h.offsetTop <= scrollTop) current = h
      else break
    }
    return current ? getId(current) : headings[0] ? getId(headings[0]) : null
  }

  function onIntersect(entries) {
    // Choose the visible heading closest to the top
    const visible = entries.filter((e) => e.isIntersecting)
    let nextId = null
    if (visible.length) {
      const topmost = visible
        .map((e) => ({ id: getId(e.target), top: e.target.getBoundingClientRect().top }))
        .sort((a, b) => Math.abs(a.top) - Math.abs(b.top))[0]
      nextId = topmost?.id || null
    } else {
      nextId = computeFallbackActiveId()
    }
    if (nextId && nextId !== activeId.value) {
      activeId.value = nextId
    }
  }

  function start() {
    if (!isBrowser) return
    stop()

    rootEl = resolveRoot(contentRoot)
    if (!rootEl) return

    headings = Array.from(rootEl.querySelectorAll(headingSelector)).filter((el) => getId(el))
  
    if (!headings.length) return

    // IntersectionObserver setup
    const rootMarginTop = -(offset || 0)
    observer = new IntersectionObserver(onIntersect, {
      // viewport root
      root: null,
      // Trigger when heading crosses near the top; keep bottom margin large to avoid flicker
      rootMargin: `${rootMarginTop}px 0px -70% 0px`,
      threshold: 0.1,
    })

    headings.forEach((h) => observer.observe(h))
    // Initial selection without rAF
    const initialId = computeFallbackActiveId()
    if (initialId) activeId.value = initialId
  }

  function stop() {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  onMounted(() => {
    if (autoStart) start()
  })

  onBeforeUnmount(() => {
    stop()
  })

  return { activeId, start, stop }
}
