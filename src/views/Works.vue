<template>
  <section id="our-works" class="works-section py-24 text-text-1 -mt-24 md:-mt-28 relative z-[5]">
    <div class="works-section__decor works-section__decor--one" aria-hidden="true"></div>
    <div class="works-section__decor works-section__decor--two" aria-hidden="true"></div>
    <div class="works-section__decor works-section__decor--grid" aria-hidden="true"></div>
    <div class="container relative z-10 mx-auto px-4 lg:px-8">
      <p class="works-kicker">Featured Projects</p>
      <h1 class="works-title">Our Works</h1>
      <p class="works-subtitle">
        Crafted partnerships that blend strategy, design, and performant code. Here are a few highlights.
      </p>
      <div class="relative z-10 container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-0">
        <div v-for="project in freelancerProjectHistory" :key="project.projectId"
          class="works-card">
          <Suspense>
            <template #default>
              <Work :projectInfo="project" />
            </template>
            <template #fallback>
              <div>Loading project...</div>
            </template>
          </Suspense>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted, defineAsyncComponent } from "vue";
import freelancerProjectHistoryData from "../assets/json/freelancerProjectHistoryData.json";


export default {
  components: {
    Work: defineAsyncComponent(() => import('../components/Work.vue'))
  },
  setup() {
    const freelancerProjectHistory = ref([]);

    onMounted(() => {
      freelancerProjectHistory.value =
        freelancerProjectHistoryData.freelancerProjectHistory;
    });

    return {
      freelancerProjectHistory,
    };
  },
};
</script>

<style scoped>
.works-section {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  background:
    radial-gradient(120% 85% at 15% -5%, rgba(124, 58, 237, 0.28), transparent 60%),
    radial-gradient(95% 65% at 85% 0%, rgba(236, 72, 153, 0.2), transparent 65%),
    linear-gradient(180deg,
      rgba(55, 35, 115, 0.94) 0%,
      rgba(99, 52, 181, 0.88) 20%,
      rgba(153, 104, 222, 0.82) 42%,
      rgba(208, 161, 255, 0.86) 68%,
      rgba(244, 225, 255, 0.97) 90%,
      rgba(248, 240, 255, 1) 100%);
  transition: background 0.4s ease;
}

.works-section::before {
  content: "";
  position: absolute;
  top: -12rem;
  left: -24%;
  width: 92%;
  height: 20rem;
  background: linear-gradient(112deg,
      rgba(18, 16, 46, 0.92) 0%,
      rgba(44, 28, 94, 0.78) 42%,
      rgba(99, 102, 241, 0.28) 82%,
      rgba(99, 102, 241, 0) 100%);
  transform: skewY(-8deg) rotate(-2deg);
  filter: blur(3.2rem);
  opacity: 0.8;
  z-index: 1;
  mix-blend-mode: multiply;
  pointer-events: none;
}

.works-section::after {
  content: "";
  position: absolute;
  top: -2.5rem;
  left: 0;
  right: 0;
  height: 9rem;
  background: linear-gradient(176deg, rgba(118, 18, 233, 0.18) 10%, rgba(92, 47, 176, 0.32) 55%, rgba(237, 233, 254, 0.9) 100%);
  clip-path: polygon(0 0, 100% 12%, 100% 100%, 0 88%);
  z-index: 1;
  mix-blend-mode: multiply;
  opacity: 0.85;
  pointer-events: none;
  transform: skewY(-2.2deg);
  transform-origin: top;
}

.works-section::after,
.works-section::before,
.works-section::after::after {
  content: "";
}

.works-section::after::after {
  position: absolute;
  top: -1.5rem;
  left: 6%;
  width: 18rem;
  height: 18rem;
  background: radial-gradient(circle,
      rgba(255, 255, 255, 0.7) 0%,
      rgba(236, 217, 255, 0.35) 38%,
      rgba(224, 204, 255, 0.16) 62%,
      rgba(207, 187, 248, 0) 100%);
  border-radius: 50%;
  transform: translate(-30%, -35%);
  filter: blur(8px);
  mix-blend-mode: screen;
  opacity: 0.75;
  pointer-events: none;
}

.dark .works-section {
  background:
    radial-gradient(120% 95% at 18% -12%, rgba(129, 140, 248, 0.28), transparent 68%),
    radial-gradient(110% 70% at 92% 6%, rgba(236, 72, 153, 0.12), transparent 62%),
    linear-gradient(185deg, rgba(26, 31, 78, 0.92) 0%, rgba(17, 24, 39, 0.88) 52%, rgba(30, 27, 75, 0.94) 100%);
}

.dark .works-section::after {
  background: linear-gradient(178deg, rgba(41, 30, 89, 0.45) 12%, rgba(36, 23, 84, 0.64) 58%, rgba(30, 24, 76, 0.9) 100%);
  clip-path: polygon(0 0, 100% 14%, 100% 100%, 0 88%);
  opacity: 0.9;
  transform: skewY(-2.2deg);
  transform-origin: top;
}

.dark .works-section::after::after {
  background: radial-gradient(circle,
      rgba(120, 110, 210, 0.28) 0%,
      rgba(88, 78, 170, 0.18) 42%,
      rgba(44, 38, 112, 0) 100%);
  filter: blur(14px);
  opacity: 0.;
}

.dark .works-section::before {
  background: linear-gradient(180deg, rgba(40, 34, 89, 0.8) 0%, rgba(40, 34, 89, 0) 100%);
}

.dark .works-section::before {
  background: linear-gradient(110deg, rgba(10, 12, 32, 0.96) 0%, rgba(30, 27, 75, 0.78) 60%, rgba(99, 102, 241, 0.16) 88%, rgba(10, 12, 32, 0) 100%);
  opacity: 0.9;
}

.dark .works-section::after {
  background: linear-gradient(282deg, rgba(148, 163, 255, 0.55) 0%, rgba(148, 163, 255, 0.18) 58%, rgba(148, 163, 255, 0) 100%);
  opacity: 0.32;
}

.works-section__decor {
  position: absolute;
  pointer-events: none;
  z-index: 0;
  mix-blend-mode: screen;
}

.works-section__decor--one {
  width: 22rem;
  height: 22rem;
  top: -8rem;
  left: -6rem;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.45) 0%, rgba(124, 58, 237, 0) 70%);
  filter: blur(2rem);
}

.works-section__decor--two {
  width: 18rem;
  height: 18rem;
  bottom: -6rem;
  right: -4rem;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.38) 0%, rgba(236, 72, 153, 0) 70%);
  filter: blur(3rem);
}

.works-section__decor--grid {
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 9rem 9rem;
  opacity: 0.4;
}

.dark .works-section__decor--grid {
  background-image: linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.028) 1px, transparent 1px);
}

.works-kicker {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.9rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 600;
  color: var(--color-accent);
  background: rgba(255, 255, 255, 0.65);
  border-radius: 999px;
  padding: 0.35rem 1.1rem;
  margin: 0 auto 1.5rem;
  width: max-content;
  box-shadow: 0 1rem 2.5rem rgba(124, 58, 237, 0.12);
}

.dark .works-kicker {
  background: rgba(30, 27, 75, 0.65);
  box-shadow: 0 1.2rem 3rem rgba(129, 140, 248, 0.15);
}

.works-title {
  font-size: clamp(2.5rem, 4vw + 0.5rem, 3.5rem);
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.75rem;
  color: var(--color-text-1);
}

.works-subtitle {
  max-width: 38rem;
  margin: 0 auto 3rem;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 1.05rem;
  line-height: 1.7;
}


.works-card {
  position: relative;
  overflow: hidden;
  border-radius: 1.25rem;
  padding: 0.35rem;
  transition: transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease,
    background 0.4s ease;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(230, 230, 255, 0.9));
  border: 1px solid rgba(124, 58, 237, 0.12);
  box-shadow: 0 22px 40px rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(9px);
}

.works-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, rgba(124, 58, 237, 0.22), transparent 55%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.works-card:hover {
  transform: translateY(-14px);
  box-shadow: 0 28px 55px rgba(15, 23, 42, 0.24);
  border-color: rgba(124, 58, 237, 0.28);
}

.works-card:hover::before {
  opacity: 1;
}

.dark .works-card {
  background:
    linear-gradient(160deg, rgba(30, 41, 59, 0.92) 0%, rgba(17, 24, 39, 0.88) 100%);
  border: 1px solid rgba(129, 140, 248, 0.22);
  box-shadow: 0 26px 48px rgba(9, 12, 20, 0.55);
}

.dark .works-card::before {
  background: radial-gradient(circle at top right, rgba(129, 140, 248, 0.28), transparent 60%);
}

.dark .works-card:hover {
  border-color: rgba(129, 140, 248, 0.45);
}
</style>
