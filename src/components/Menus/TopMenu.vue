<template>
  <section
    ref="navbarEl"
    class="bg-purple-400 fixed top-0 
    w-full z-50 h-md-navbar-height"
    :class="{ 'bg-purple-950': isDark }"
  >
    <div class="p-2 flex h-md-navbar-height items-center gap-4">
      <RouterLink
        :to="{ name: 'Home' }"
        class="brand-link focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-200 dark:focus-visible:outline-indigo-300"
        aria-label="Go to homepage"
      >
        <span class="brand-link__inner" aria-hidden="true" role="presentation">
          <span class="brand-link__brand">
            <span class="brand-link__icon" role="img" aria-label="Interactive door icon">
              <span class="brand-link__icon-doorway" aria-hidden="true">
                <span class="brand-link__icon-door" aria-hidden="true">
                  <span class="brand-link__icon-knob" aria-hidden="true"></span>
                </span>
              </span>
            </span>
            <span class="brand-link__text-reveal">
              <span class="brand-link__word brand-link__word--1">WEB</span>
              <span class="brand-link__word brand-link__word--2">IT</span>
              <span class="brand-link__word brand-link__word--3">EASIER</span>
            </span>
          </span>
        </span>
      </RouterLink>
      <div class="flex items-center gap-4 ml-auto">
        <nav class="hidden md:flex md:items-center md:gap-6" aria-label="main">
          <DoorNavLink
            :to="{ name: 'Home' }"
            class="nav-link rounded-xl px-5 py-2 text-2xl font-semibold text-purple-900 transition-colors hover:bg-purple-100 hover:text-purple-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-200 dark:text-indigo-100 dark:hover:bg-indigo-800 dark:hover:text-white dark:focus-visible:outline-indigo-300"
            :active="activeSection === 'home'"
            variant="top"
            data-scrollspy-link="home"
            :data-scrollspy-active="activeSection === 'home'"
          >
            Home
          </DoorNavLink>

          <DoorNavLink
            :to="{ name: 'Home', hash: '#our-works' }"
            class="nav-link rounded-xl px-5 py-2 text-2xl font-semibold text-purple-900 transition-colors hover:bg-purple-100 hover:text-purple-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-200 dark:text-indigo-100 dark:hover:bg-indigo-800 dark:hover:text-white dark:focus-visible:outline-indigo-300"
            :active="activeSection === 'our-works'"
            variant="top"
            data-scrollspy-link="our-works"
            :data-scrollspy-active="activeSection === 'our-works'"
          >
            Our Works
          </DoorNavLink>

          <DoorNavLink
            :to="{ name: 'Home', hash: '#hire-us' }"
            class="nav-link nav-link--cta rounded-xl border border-purple-900 bg-purple-900 px-6 py-4 text-white text-2xl font-semibold transition-colors hover:bg-purple-500 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-200 dark:border-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-600 dark:hover:text-white"
            :active="activeSection === 'hire-us'"
            variant="top"
            data-scrollspy-link="hire-us"
            :data-scrollspy-active="activeSection === 'hire-us'"
          >
            Hire Us
          </DoorNavLink>

          <DoorNavLink
            :to="{ name: 'Blog' }"
            class="nav-link nav-link--blog rounded-xl px-5 py-2 text-2xl font-semibold text-purple-900 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-200 dark:text-indigo-100 dark:focus-visible:outline-indigo-300"
            :active="isBlogRoute"
            variant="blog"
            data-scrollspy-ignore="true"
          >
            Blog
            <span class="nav-link__glyph" aria-hidden="true">↗</span>
          </DoorNavLink>
        </nav>
        <button
          type="button"
          class="doorgroup"
          @click="isDark = !isDark"
          :aria-pressed="isDark ? 'true' : 'false'"
          :aria-label="isDark ? 'Return to the night' : 'Step into the light'"
          :title="isDark ? 'Return to the night' : 'Step into the light'">
          <div
            class="doorway border-2 border-purple-500 bg-purple-200 transition-colors dark:border-indigo-200 dark:bg-indigo-900"
            :class="{ 'doorway--lit': !isDark }"
            ref="doorWay"
          >
            <div class="door" ref="door" :class="{ 'door--open': !isDark }" id="openDoor">
              <div class="door-content">
                <span class="door-icon" aria-hidden="true">{{ isDark ? '🌙' : '☀️' }}</span>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  </section>
</template>
<script setup lang="js">
import { RouterLink, useRoute } from 'vue-router';
import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue';
import DoorNavLink from '@/components/Menus/DoorNavLink.vue';
import useSectionHighlight from '@/composables/useSectionHighlight.js';

let isDark = ref(false);
const route = useRoute();
const isBlogRoute = computed(() => route.name === 'Blog');
const navbarEl = ref(null);

// Use section highlighting for Home, Our Works, and Hire Us sections
const { activeSection, startHighlighting, stopHighlighting } = useSectionHighlight(
  ['home', 'our-works', 'hire-us'],
  { autoStart: false }
);
onMounted(() => {
  const stored = localStorage.getItem('theme');
  if (stored) {
    isDark.value = stored === 'dark';
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  document.documentElement.classList.toggle('dark', isDark.value);

  startHighlighting();
});

watch(isDark, () => {
  document.documentElement.classList.toggle('dark', isDark.value);
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
});

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
</script>
<style scoped>
.brand-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  --motion-fast: 0.28s ease;
  --motion-medium: 0.4s ease;
  --motion-slow: 0.6s cubic-bezier(0.25, 0.1, 0.25, 1);
  --motion-reveal: 0.5s ease;
  width: clamp(3.9rem, 5vw + 0.5rem, 4.5rem);
  height: clamp(3.9rem, 5vw + 0.5rem, 4.5rem);
  padding: clamp(0.35rem, 0.6vw + 0.2rem, 0.45rem);
  border-radius: 9999px;
  text-decoration: none;
  color: #0f172a;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.45), rgba(191, 219, 254, 0.4));
  box-shadow: 0 12px 24px -18px rgba(15, 23, 42, 0.6);
  letter-spacing: 0.08em;
  overflow: hidden;
  transition:
    transform var(--motion-fast),
    box-shadow var(--motion-fast),
    background var(--motion-fast),
    width var(--motion-medium),
    padding var(--motion-medium);
}

.brand-link:hover,
.brand-link:focus-visible {
  transform: translateY(-2px);
  box-shadow: 0 18px 34px -20px rgba(56, 189, 248, 0.55);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.65), rgba(191, 219, 254, 0.55));
  width: clamp(10rem, 18vw, 12.5rem);
  padding: clamp(0.35rem, 0.85vw, 0.5rem) clamp(1.1rem, 2.6vw, 1.6rem);
  justify-content: flex-start;
}

.brand-link__inner {
  display: contents;
}

.brand-link__brand {
  display: flex;
  align-items: center;
  gap: clamp(0.55rem, 1.15vw, 0.85rem);
  width: 100%;
}

.brand-link__text-reveal {
  display: flex;
  flex-direction: column;
  gap: 0;
  line-height: 1rem;
  max-width: 0;
  opacity: 0;
  transition:
    max-width var(--motion-medium),
    opacity var(--motion-fast);
  overflow: hidden;
}

.brand-link__word {
  letter-spacing: 0.18em;
  font-family: "Clash Display", "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  text-shadow: 0 0.15rem 0.4rem rgba(59, 7, 100, 0.3);
  opacity: 0;
  transform: translateX(-100%);
  transition: transform var(--motion-reveal), opacity var(--motion-reveal);
  will-change: transform, opacity;
}

.brand-link__word--1 {
  font-size: clamp(0.7rem, 1.2vw, 0.88rem);
  font-weight: 600;
  color: rgba(59, 130, 246, 0.92);
  text-shadow: 0 0.1rem 0.25rem rgba(37, 99, 235, 0.35);
  transition-delay: 0.1s;
}

.brand-link__word--2 {
  font-size: clamp(0.92rem, 1.6vw, 1.16rem);
  font-weight: 700;
  color: rgba(16, 185, 129, 0.95);
  text-shadow: 0 0.12rem 0.28rem rgba(5, 150, 105, 0.32);
  transition-delay: 0.25s;
}

.brand-link__word--3 {
  font-size: clamp(1.02rem, 1.9vw, 1.3rem);
  font-weight: 800;
  color: rgba(124, 58, 237, 0.95);
  text-shadow: 0 0.15rem 0.4rem rgba(76, 29, 149, 0.38);
  transition-delay: 0.4s;
}

.brand-link:hover .brand-link__text-reveal,
.brand-link:focus-visible .brand-link__text-reveal {
  max-width: clamp(6rem, 11vw, 8rem);
  opacity: 1;
}


.brand-link:hover .brand-link__word,
.brand-link:focus-visible .brand-link__word {
  opacity: 1;
  transform: translateX(0);
}

.brand-link:hover .brand-link__icon-door,
.brand-link:focus-visible .brand-link__icon-door {
  transform: rotateY(45deg);
}

@media (hover: none) {
  .brand-link:active .brand-link__icon-door,
  .brand-link:focus-visible .brand-link__icon-door {
    transform: rotateY(32deg);
  }
  
  .brand-link:active .brand-link__word {
    opacity: 1;
    transform: translateX(0);
  }

  .brand-link:active {
    width: clamp(9.5rem, 16vw, 11.5rem);
    padding: clamp(0.24rem, 0.7vw, 0.36rem) clamp(0.6rem, 1.8vw, 1rem);
    justify-content: flex-start;
  }

  .brand-link:active .brand-link__text-reveal {
    max-width: clamp(6.5rem, 12vw, 8.75rem);
    opacity: 1;
  }
}



.brand-link__icon {
  position: relative;
  display: inline-flex;
  width: clamp(2.1rem, 3.1vw, 2.55rem);
  height: clamp(2.6rem, 3.6vw, 3.1rem);
  margin-left: clamp(0.18rem, 0.4vw, 0.3rem);
}

.brand-link__icon-doorway {
  border: 3px solid rgba(76, 29, 149, 0.85);
  width: 100%;
  height: 100%;
  position: relative;
  perspective: 150px;
  border-radius: 0.35rem;
  background: rgba(226, 232, 240, 0.15);
  box-shadow: inset 0 0 0.5rem rgba(76, 29, 149, 0.25);
}

.brand-link__icon-door {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.55) 0%, rgba(226, 232, 240, 0.42) 40%, rgba(167, 139, 250, 0.68) 68%, rgba(109, 76, 200, 0.82) 86%, rgba(59, 7, 100, 0.95) 100%);
  border-radius: 0.15rem;
  transition: transform var(--motion-slow);
  transform: rotateY(0deg);
  transform-origin: left center;
  display: grid;
  place-items: center;
  overflow: hidden;
  transform-style: preserve-3d;
  will-change: transform;
}

.dark .brand-link {
  color: #e2e8f0;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.62), rgba(30, 41, 59, 0.35));
  box-shadow: 0 10px 26px -20px rgba(148, 163, 184, 0.45);
}

.dark .brand-link:hover {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.82), rgba(79, 70, 229, 0.4));
  box-shadow: 0 18px 36px -22px rgba(129, 140, 248, 0.55);
}

.dark .brand-link__icon-doorway {
  border-color: rgba(129, 140, 248, 0.65);
  background: rgba(30, 41, 59, 0.2);
  box-shadow: inset 0 0 0.5rem rgba(99, 102, 241, 0.25);
}

.dark .brand-link__icon-door {
  background: linear-gradient(180deg, rgba(191, 219, 254, 0.18) 0%, rgba(129, 140, 248, 0.32) 55%, rgba(99, 102, 241, 0.68) 80%, rgba(59, 7, 100, 0.9) 100%);
}

.dark .brand-link__word {
  color: rgba(226, 232, 240, 0.95);
  text-shadow: 0 0.15rem 0.4rem rgba(79, 70, 229, 0.4);
}

@media (prefers-reduced-motion: reduce) {
  .brand-link,
  .brand-link__icon-door,
  .brand-link__word,
  .brand-link__text-reveal {
    transition: none;
  }

  .brand-link:hover {
    transform: none;
    box-shadow: 0 12px 24px -20px rgba(15, 23, 42, 0.45);
    width: clamp(9.5rem, 16vw, 11.5rem);
    padding: clamp(0.24rem, 0.7vw, 0.36rem) clamp(0.6rem, 1.8vw, 1rem);
    justify-content: flex-start;
  }

  .brand-link:hover .brand-link__icon-door,
  .brand-link:focus-visible .brand-link__icon-door,
  .brand-link:active .brand-link__icon-door {
    transform: none;
  }

  .brand-link:hover .brand-link__word,
  .brand-link:focus-visible .brand-link__word,
  .brand-link:active .brand-link__word {
    opacity: 1;
    transform: translateX(0);
  }
}

.brand-link__icon-knob {
  position: absolute;
  right: 18%;
  top: 50%;
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 9999px;
  background: radial-gradient(circle, rgba(253, 224, 71, 0.95), rgba(217, 119, 6, 0.85));
  box-shadow: 0 0 0.3rem rgba(253, 224, 71, 0.65);
  transform: translateY(-50%) translateZ(6px);
}

.doorgroup {
  cursor: pointer;
  display: inline-flex;
  position: relative;
  z-index: 1;
  touch-action: manipulation;
  padding: 0;
  border-radius: 0.3rem;
  margin-inline:1rem;
}

.doorgroup:focus-visible {
  outline: 0.125rem solid #4f46e5;
  outline-offset: 0.5rem;
}
.dark .doorgroup:focus-visible {
  outline-color: #c7d2fe;
}
.doorway {
  height: 4rem;
  width: 2.75rem;
  position: relative;
  perspective: 11.25rem;
  border-radius: 0.25rem;
  box-shadow: inset 0 0 0.35rem rgba(76, 29, 149, 0.25);
  transition: box-shadow 0.3s ease;
}

.doorway--lit {
  box-shadow:
    inset 0 0 0 rgba(15, 10, 26, 0),
    0 0 2.25rem rgba(253, 224, 71, 0.65),
    0 0 3.75rem rgba(253, 224, 71, 0.45),
    0 0 5.5rem rgba(253, 224, 71, 0.3),
    0 0 7rem rgba(253, 224, 71, 0.18);
  position: relative;
}

.door {
  position: absolute;
  top: 0.0625rem;
  right: 0.0625rem;
  width: calc(100% - 0.125rem);
  height: calc(100% - 0.125rem);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.28) 0%, rgba(124, 58, 237, 0.85) 35%, rgba(91, 33, 182, 0.95) 70%, rgba(59, 7, 100, 0.98) 100%);
  border-radius: 0.125rem;
  color: #ffffff;
  transition: transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1), background 0.3s ease;
  transform: rotateY(0deg);
  transform-origin: right center;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.door-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.door-icon {
  font-size: 1.85rem;
  filter: drop-shadow(0 0.1875rem 0.375rem rgba(17, 24, 39, 0.6));
  transition: filter 0.3s ease, transform 0.3s ease;
}

.door--open .door-icon {
  filter: drop-shadow(0 0 0.625rem rgba(253, 224, 71, 0.85)) drop-shadow(0 0.1875rem 0.375rem rgba(17, 24, 39, 0.5));
  transform: translateY(-0.0625rem) scale(1.05);
}

.door--open {
  transform: rotateY(-45deg);
}

.doorway--lit::after {
  content: "";
  position: absolute;
  inset: -0.3rem;
  border-radius: 0.5rem;
  background: radial-gradient(circle, rgba(253, 224, 71, 0.85) 0%, rgba(253, 224, 71, 0.42) 34%, rgba(253, 224, 71, 0.14) 60%, transparent 78%);
  pointer-events: none;
}

.doorway--lit::before {
  content: "";
  position: absolute;
  top: 1.6rem;
  right: 0.25rem;
  width: 7.5rem;
  height: 14.5rem;
  background: linear-gradient(-270deg, rgba(253, 224, 71, 0.72) 0%, rgba(253, 224, 71, 0.34) 55%, rgba(253, 224, 71, 0.05) 100%);
  clip-path: polygon(100% 5%, 80% 0%, 0% 100%, 100% 95%);
  filter: blur(0.55rem);
  opacity: 0.7;
  pointer-events: none;
  z-index: -1;
}

.dark .doorway {
  box-shadow: inset 0 0 0.35rem rgba(15, 10, 26, 0.6);
}

.dark .door {
  background: linear-gradient(180deg, rgba(148, 163, 184, 0.2) 0%, rgba(76, 29, 149, 0.85) 40%, rgba(59, 7, 100, 0.95) 100%);
}

/* Navigation link styles */
.nav-link__glyph {
  font-size: 0.8em;
  margin-left: 0.25rem;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.nav-link--blog:hover .nav-link__glyph {
  opacity: 1;
}
</style>
