<template>
  <section class="bg-purple-400 fixed top-0 
  w-full z-50 h-md-navbar-height" :class="{ 'bg-purple-950': isDark }">
    <div class="p-2 flex h-md-navbar-height items-center gap-4">
      <span class="font-semibold text-5xl"> IT 🚪 </span>
      <div class="flex items-center gap-4 ml-auto">
        <nav class="hidden md:flex md:items-center md:gap-6" aria-label="main">
          <RouterLink 
            :to="{ name: 'Home' }" 
            class="rounded-xl px-5 py-2 text-2xl font-semibold text-purple-900 transition-colors hover:bg-purple-100 hover:text-purple-900 dark:text-indigo-100 dark:hover:bg-indigo-800 dark:hover:text-white"
          >Home</RouterLink>
          <RouterLink 
            :to="{ name: 'Blog' }" 
            class="rounded-xl px-5 py-2 text-2xl font-semibold text-purple-900 transition-colors hover:bg-purple-100 hover:text-purple-900 dark:text-indigo-100 dark:hover:bg-indigo-800 dark:hover:text-white"
          >Blog</RouterLink>
          <RouterLink 
            :to="{ name: 'Home', hash: '#our-works' }" 
            class="rounded-xl px-5 py-2 text-2xl font-semibold text-purple-900 transition-colors hover:bg-purple-100 hover:text-purple-900 dark:text-indigo-100 dark:hover:bg-indigo-800 dark:hover:text-white"
          >Our Works</RouterLink>
          <RouterLink
            :to="{ name: 'Home', hash: '#hire-us' }"
            class="rounded-xl border border-purple-900 bg-purple-900 px-6 py-4 text-white text-2xl font-semibold transition-colors hover:bg-purple-500 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-200 dark:border-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-600 dark:hover:text-white"
          >Hire Us
          </RouterLink>
        </nav>
        <button
          type="button"
          class="doorgroup"
          @click="isDark = !isDark"
          @keydown.enter="isDark = !isDark"
          @keydown.space="isDark = !isDark"
          :aria-pressed="isDark"
          aria-label="isDark ? 'Return to the night' : 'Step into the light'"
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
import { RouterLink } from 'vue-router';
import { ref, onMounted, watch } from 'vue';

let isDark = ref(false);

onMounted(() => {
  const stored = localStorage.getItem('theme');
  if (stored) {
    isDark.value = stored === 'dark';
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  document.documentElement.classList.toggle('dark', isDark.value);
});

watch(isDark, () => {
  document.documentElement.classList.toggle('dark', isDark.value);
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
});
</script>
<style scoped>
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
</style>
