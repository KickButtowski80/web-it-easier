import { ref, onMounted, onBeforeUnmount } from 'vue';

export default function useSectionHighlight(sectionIds = [], options = {}) {
  const { autoStart = true } = options;
  const activeSection = ref(null);
  let observer = null;
  let retryHandle = null;

  // Option A: ID-based auto observer with retry
  // -------------------------------------------
  // This version:
  // - Accepts an array of section IDs (['home', 'our-works', 'hire-us'])
  // - Tries to find matching DOM elements and attach a single IntersectionObserver
  // - If none of the sections exist yet, it schedules a retry on the next frame
  //   so that late-mounted sections can still be observed
  const startHighlighting = () => {
    stopHighlighting();
    const visibleSections = new Map();

    const options = {
      root: null,
      rootMargin: "0px 0px 0px 0px",
      threshold: [0.1, 0.3, 0.4, 0.5],
    };

    observer = new IntersectionObserver((entries) => {    
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleSections.set(entry.target.id, entry.intersectionRatio);
        } else {
          visibleSections.delete(entry.target.id);
        }
      });

      // Find the section with the highest intersection ratio
      if (visibleSections.size > 0) {
        const mostVisible = Array.from(visibleSections.entries()).reduce((prev, curr) =>
          curr[1] > prev[1] ? curr : prev
        );
        activeSection.value = mostVisible[0];
      }
    }, options);

    let hasObservedAnySection = false;
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
        hasObservedAnySection = true;
      }
    });

    if (!hasObservedAnySection && typeof window !== 'undefined') {
      retryHandle = window.requestAnimationFrame(startHighlighting);
    }
  };

  const stopHighlighting = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    if (retryHandle) {
      window.cancelAnimationFrame(retryHandle);
      retryHandle = null;
    }
  };

  onMounted(() => {
    if (autoStart) {
      startHighlighting();
    }
  });

  onBeforeUnmount(() => {
    stopHighlighting();
  });

  return {
    activeSection,
    startHighlighting,
    stopHighlighting,
  };
}

/*
 * Option B: Alternative pattern (manual start from the owning view)
 * -----------------------------------------------------------------
 * Instead of letting the menus own the observer and query the DOM by ID,
 * the Home view (where the sections actually live) can control when
 * highlighting starts. This removes the need for the retry logic above
 * because we only start once we know the sections are rendered.
 *
 * Example sketch (HomeView.vue):
 *
 * <script setup>
 * import { onMounted, onBeforeUnmount, nextTick, provide } from 'vue';
 * import useSectionHighlight from '@/composables/useSectionHighlight.js';
 *
 * const { activeSection, startHighlighting, stopHighlighting } =
 *   useSectionHighlight(['home', 'our-works', 'hire-us'], { autoStart: false });
 *
 * // Make activeSection available to menus via provide/inject
 * provide('activeSection', activeSection);
 *
 * onMounted(async () => {
 *   // Wait for this view's DOM (sections) to be in place
 *   await nextTick();
 *   startHighlighting();
 * });
 *
 * onBeforeUnmount(() => {
 *   stopHighlighting();
 * });
 * </script>
 *
 * Then, in TopMenu/BottomMenu you could inject activeSection instead of
 * creating their own observers:
 *
 * const activeSection = inject('activeSection', ref(null));
 *
 * This keeps the observer logic close to the sections themselves and
 * demonstrates an alternative to the ID + retry approach.
 */