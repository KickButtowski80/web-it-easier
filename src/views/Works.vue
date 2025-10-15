<template>
  <section id="our-works" class="works-section py-24 text-text-1">
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
    radial-gradient(95% 65% at 85% 0%, rgba(236, 72, 153, 0.22), transparent 65%),
    linear-gradient(180deg, var(--color-surface-2) 0%, var(--color-surface-1) 45%, var(--color-surface-3) 100%);
  transition: background 0.4s ease;
}

.dark .works-section {
  background:
    radial-gradient(120% 95% at 18% -10%, rgba(129, 140, 248, 0.28), transparent 68%),
    radial-gradient(110% 70% at 90% 5%, rgba(236, 72, 153, 0.16), transparent 62%),
    linear-gradient(185deg, rgba(26, 31, 78, 0.95) 0%, rgba(17, 24, 39, 0.9) 55%, rgba(30, 27, 75, 0.92) 100%);
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
