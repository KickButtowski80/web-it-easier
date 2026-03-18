/**
 * useSectionHighlight - Simple Intersection Observer for navigation highlighting
 * 
 * Automatically highlights the currently visible section on the page.
 * Perfect for sticky navigation menus that need to show which section is active.
 * 
 * @param {string[]} sectionIds - Array of section IDs to observe (e.g., ['home', 'our-works', 'hire-us'])
 * @returns {Object} { activeSection, startHighlighting, stopHighlighting }
 * 
 * @example
 * const { activeSection } = useSectionHighlight(['home', 'our-works', 'hire-us']);
 * 
 * // In template:
 * <a :class="{ active: activeSection === 'home' }" href="#home">Home</a>
 * <a :class="{ active: activeSection === 'our-works' }" href="#our-works">Work</a>
 */
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';

export default function useSectionHighlight(sectionIds = []) {
  const activeSection = ref(null);
  let observer = null;
  

  /**
   * Start observing sections for intersection changes
   * Uses "most visible wins" logic when multiple sections are intersecting
   */
  const startHighlighting = () => {
    console.log('useSectionHighlight: Starting highlighting for sections:', sectionIds);
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

      // Pick the section with the highest visibility ratio
      if (visibleSections.size > 0) {
        const mostVisible = Array.from(visibleSections.entries()).reduce((prev, curr) =>
          curr[1] > prev[1] ? curr : prev
        );
        console.log('useSectionHighlight: Setting activeSection to:', mostVisible[0]);
        activeSection.value = mostVisible[0];
      } else {
        console.log('useSectionHighlight: No visible sections found');
      }
    }, options);

    let foundCount = 0;
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
        foundCount++;
      } else {
        console.log('useSectionHighlight: Element NOT found:', id);
      }
    });
    console.log(`useSectionHighlight: Found ${foundCount}/${sectionIds.length} elements`);
  };

  /**
   * Stop observing all sections and clean up the observer
   */
  const stopHighlighting = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };

  /**
   * Wait for DOM to be ready, then start observing
   * Uses nextTick to ensure all child components (like router-view) are mounted
   */
  onMounted(async () => {
      await nextTick(); 
      startHighlighting();
  });

  /**
   * Clean up observer when component is destroyed
   */
  onBeforeUnmount(() => {
    stopHighlighting();
  });

  return {
    activeSection,
    startHighlighting,
    stopHighlighting,
  };
}