<template lang="">
  <footer class="fixed bottom-0 w-full z-50">
    <nav
      :class="{ hidden: hideIt }"
      class="bottom-nav md:hidden flex items-stretch justify-between gap-2 px-3 py-3"
    >
      <DoorNavLink
        :to="{ name: 'Home' }"
        class="bottom-nav__link"
        :active="activeSection === 'home'"
      >
        <span class="bottom-nav__icon" aria-hidden="true">🏠</span>
        <span class="bottom-nav__label">Home</span>
      </DoorNavLink>
      <DoorNavLink
        :to="{ name: 'Home', hash: '#our-works' }"
        class="bottom-nav__link"
        :active="activeSection === 'our-works'"
      >
        <span class="bottom-nav__icon" aria-hidden="true">🖥️</span>
        <span class="bottom-nav__label">Our Works</span>
      </DoorNavLink>
      <DoorNavLink
        :to="{ name: 'Home', hash: '#hire-us' }"
        class="bottom-nav__link bottom-nav__link--cta"
        :active="activeSection === 'hire-us'"
      >
        <span class="bottom-nav__icon" aria-hidden="true">🔈</span>
        <span class="bottom-nav__label">Hire Us</span>
      </DoorNavLink>
      <DoorNavLink
        :to="{ name: 'Blog' }"
        class="bottom-nav__link"
        :active="isBlogRoute"
        variant="blog"
      >
        <span class="bottom-nav__icon" aria-hidden="true">📝</span>
        <span class="bottom-nav__label">Blog</span>
      </DoorNavLink>
    </nav>
  </footer>
</template>
<script>
import { computed, watch, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import useSectionHighlight from '@/composables/useSectionHighlight.js';
import DoorNavLink from '@/components/Menus/DoorNavLink.vue';

export default {
  components: {
    DoorNavLink,
  },
  props: ["hideIt"],
  setup() {
    const { activeSection, startHighlighting, stopHighlighting } = useSectionHighlight(
      ['home', 'our-works', 'hire-us'],
      { autoStart: false }
    );
    const route = useRoute();
    const isBlogRoute = computed(() => route.name === 'Blog');

    watch(
      () => route.name,
      (name) => {
        if (name === 'Blog') {
          stopHighlighting();
          activeSection.value = null;
        } else {
          startHighlighting();
        }
      },
      { immediate: true }
    );

    onBeforeUnmount(() => {
      stopHighlighting();
    });

    return {
      activeSection,
      isBlogRoute,
    };
  }
};
</script>

<style scoped>
.bottom-nav {
  backdrop-filter: blur(12px);
  background: rgba(15, 10, 40, 0.9);
  border-radius: 1.1rem 1.1rem 0 0;
  box-shadow: 0 -8px 22px rgba(15, 23, 42, 0.5);
  width: 100%;
}

.bottom-nav__link {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1 1 0;
  min-width: 0;
  padding: 0.55rem 0.6rem 0.65rem;
  border-radius: 0.95rem;
  font-weight: 600;
  font-size: 0.92rem;
  color: #ede9fe;
  gap: 0.25rem;
  text-align: center;
  white-space: normal;
  transition:
    color 0.2s ease,
    transform 0.3s ease;
}
.bottom-nav__link--cta {
  border: 1px solid rgba(248, 250, 252, 0.3);
}

.bottom-nav__label {
  font-size: 0.78rem;
  line-height: 1.1;
}

.bottom-nav__icon {
  font-size: 1.1rem;
}

.dark .bottom-nav {
  background: rgba(2, 6, 23, 0.88);
  box-shadow: 0 -10px 28px rgba(0, 0, 0, 0.65);
}

.dark .bottom-nav__link {
  color: #c7d2fe;
}

.dark .bottom-nav__link--cta {
  border-color: rgba(99, 102, 241, 0.55);
}
</style>
