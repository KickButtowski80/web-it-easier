import { ref, onMounted, onBeforeUnmount } from 'vue';

export default function useSectionHighlight(sectionIds = []) {
  const activeSection = ref(null);
  let observer = null;

  const startHighlighting = () => {
    const visibleSections = new Map();

    const options = {
      root: null,
      rootMargin: "0px 0px 0px 0px",
      threshold: [0.1, 0.3, 0.4, 0.5],
    };

    observer = new IntersectionObserver((entries) => {
      console.log('entries', entries);
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
        console.log('mostVisible', mostVisible, 'activeSection', activeSection.value);
      }
    }, options);

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });
  };

  const stopHighlighting = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };

  onMounted(() => {
    startHighlighting();
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