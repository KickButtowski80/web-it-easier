<template lang="">
  <footer class="fixed bottom-0 w-full z-50">
    <nav
      :class="{ hidden: hideIt }"
      class="bottom-nav md:hidden flex items-stretch justify-between gap-2 px-3 py-3"
    >
      <RouterLink
        :to="{ name: 'Home' }"
        class="bottom-nav__link"
        :class="{ 'bottom-nav__link--active': activeSection === 'home' }"
      >
        <span class="bottom-nav__icon" aria-hidden="true">🏠</span>
        <span class="bottom-nav__label">Home</span>
      </RouterLink>
      <RouterLink
        :to="{ name: 'Home', hash: '#our-works' }"
        class="bottom-nav__link"
        :class="{ 'bottom-nav__link--active': activeSection === 'our-works' }"
      >
        <span class="bottom-nav__icon" aria-hidden="true">🖥️</span>
        <span class="bottom-nav__label">Our Works</span>
      </RouterLink>
      <RouterLink
        :to="{ name: 'Home', hash: '#hire-us' }"
        class="bottom-nav__link bottom-nav__link--cta"
        :class="{ 'bottom-nav__link--active': activeSection === 'hire-us' }"
      >
        <span class="bottom-nav__icon" aria-hidden="true">🔈</span>
        <span class="bottom-nav__label">Hire Us</span>
      </RouterLink>
      <RouterLink
        :to="{ name: 'Blog' }"
        class="bottom-nav__link bottom-nav__link--blog"
        :class="{ 'bottom-nav__link--blog-active': isBlogRoute }"
      >
        <span class="bottom-nav__icon" aria-hidden="true">📝</span>
        <span class="bottom-nav__label">Blog</span>
      </RouterLink>
    </nav>
  </footer>
</template>
<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import useSectionHighlight from '@/composables/useSectionHighlight.js';

export default {
  props: ["hideIt"],
  setup() {
    const { activeSection } = useSectionHighlight(['home', 'our-works', 'hire-us']);
    const route = useRoute();
    const isBlogRoute = computed(() => route.name === 'Blog');

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

.bottom-nav__link::after {
  content: "";
  position: absolute;
  inset: 0.15rem;
  border-radius: 0.75rem;
  opacity: 0.15;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(99, 102, 241, 0.12));
  border: 1px solid rgba(99, 102, 241, 0.35);
  transform-origin: left center;
  transform: perspective(120px) rotateY(0deg);
  transition: transform 0.35s ease, opacity 0.2s ease;
  pointer-events: none;
}

.bottom-nav__link::before {
  content: "";
  position: absolute;
  inset: -0.1rem;
  border-radius: inherit;
  border: 1px solid rgba(255, 255, 255, 0.08);
  opacity: 0.35;
  pointer-events: none;
}

.bottom-nav__link--active,
.bottom-nav__link--blog-active {
  color: #ffffff;
  transform: translateY(-2px);
}

.bottom-nav__link--active::after,
.bottom-nav__link--blog-active::after {
  opacity: 0.9;
  transform: perspective(120px) rotateY(-45deg);
}

.bottom-nav__link--cta {
  border: 1px solid rgba(248, 250, 252, 0.3);
}

.bottom-nav__link--blog {
  color: #ccfbf1;
}

.bottom-nav__link--blog::after {
  background: linear-gradient(180deg, rgba(16, 185, 129, 0.25), rgba(59, 130, 246, 0.2));
  border-color: rgba(20, 184, 166, 0.4);
}

.bottom-nav__link--blog-active {
  color: #d1fae5;
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

.dark .bottom-nav__link--active {
  color: #f4f3ff;
}

.dark .bottom-nav__link--blog-active {
  color: #ecfdf5;
}

.dark .bottom-nav__link--cta {
  border-color: rgba(99, 102, 241, 0.55);
}
</style>
