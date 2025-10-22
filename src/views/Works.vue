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
/*
 * FINAL OPTIMIZED CSS VERSION
 * Focus: Performance (will-change) and Code Cleanliness (removed redundancies).
 */

/* ======================================= */
/* 1. SECTION BLOCK */
/* ======================================= */
.works-section {
    position: relative;
    overflow: hidden;
    isolation: isolate;
    background:
        /* Radial 1 */
        radial-gradient(120% 85% at 15% -5%, rgba(124, 58, 237, 0.28), transparent 60%),
        /* Radial 2 */
        radial-gradient(95% 65% at 85% 0%, rgba(236, 72, 153, 0.2), transparent 65%),
        /* Linear Gradient (Main Background) */
        linear-gradient(180deg,
            rgba(55, 35, 115, 0.94) 0%,
            rgba(99, 52, 181, 0.88) 20%,
            rgba(153, 104, 222, 0.82) 42%,
            rgba(208, 161, 255, 0.86) 68%,
            rgba(244, 225, 255, 0.97) 90%,
            rgba(248, 240, 255, 1) 100%
        );
    transition: background 0.4s ease;
}

/* Pseudo-Elements Base Styles - Added performance hint */
.works-section::before,
.works-section::after {
    content: "";
    position: absolute;
    z-index: 1;
    mix-blend-mode: multiply;
    pointer-events: none;
    will-change: transform, filter, opacity, background; 
}

/* ELEMENT: ::before (Large Skewed Blur) */
.works-section::before {
    top: -12rem;
    left: -24%;
    width: 92%;
    height: 20rem;
    background: linear-gradient(112deg,
        rgba(18, 16, 46, 0.92) 0%,
        rgba(44, 28, 94, 0.78) 42%,
        rgba(99, 102, 241, 0.28) 82%,
        rgba(99, 102, 241, 0) 100%
    );
    transform: skewY(-8deg) rotate(-2deg);
    filter: blur(3.2rem); 
    opacity: 0.8;
}

/* ELEMENT: ::after (Top Clip-Path Border) */
.works-section::after {
    top: -2.5rem;
    left: 0;
    right: 0;
    height: 9rem;
    background: linear-gradient(176deg, rgba(118, 18, 233, 0.18) 10%, rgba(92, 47, 176, 0.32) 55%, rgba(237, 233, 254, 0.9) 100%);
    clip-path: polygon(0 0, 100% 12%, 100% 100%, 0 88%);
    opacity: 0.85;
    transform: skewY(-2.2deg);
    transform-origin: top;
}

/* ELEMENT: ::after::after (Inner Radial Glow) */
.works-section::after::after {
    content: ""; 
    position: absolute;
    top: -1.5rem;
    left: 6%;
    width: 18rem;
    height: 18rem;
    background: radial-gradient(circle,
        rgba(255, 255, 255, 0.7) 0%,
        rgba(236, 217, 255, 0.35) 38%,
        rgba(224, 204, 255, 0.16) 62%,
        rgba(207, 187, 248, 0) 100%
    );
    border-radius: 50%;
    transform: translate(-30%, -35%);
    filter: blur(8px); 
    mix-blend-mode: screen;
    opacity: 0.75;
    pointer-events: none;
    will-change: transform, filter, opacity;
}

/* ======================================= */
/* 2. DARK MODE STYLES */
/* ======================================= */
.dark .works-section {
    background:
        radial-gradient(120% 95% at 18% -12%, rgba(129, 140, 248, 0.42), transparent 78%),
        radial-gradient(115% 75% at 90% 12%, rgba(236, 72, 153, 0.18), transparent 70%),
        linear-gradient(185deg,
            rgba(58, 68, 160, 0.92) 0%,
            rgba(72, 63, 196, 0.82) 52%,
            rgba(57, 42, 148, 0.88) 100%
        );
}
.dark .works-section::before {
    background: linear-gradient(110deg,
        rgba(57, 51, 140, 0.68) 0%,
        rgba(99, 102, 241, 0.48) 60%,
        rgba(148, 163, 255, 0.2) 92%,
        rgba(57, 51, 140, 0) 100%
    );
    opacity: 0.68;
}
.dark .works-section::after {
    background: linear-gradient(282deg,
        rgba(165, 180, 252, 0.54) 0%,
        rgba(148, 163, 255, 0.24) 58%,
        rgba(96, 80, 180, 0.22) 100%
    );
    clip-path: polygon(0 0, 100% 14%, 100% 100%, 0 88%);
    opacity: 0.44;
    transform: skewY(-2.2deg);
    transform-origin: top;
}
.dark .works-section::after::after {
    background: radial-gradient(circle,
        rgba(153, 133, 255, 0.26) 0%,
        rgba(109, 95, 205, 0.19) 46%,
        rgba(68, 56, 163, 0) 100%
    );
    filter: blur(12px);
    opacity: 0.18;
}

/* ======================================= */
/* 3. DECORATION ELEMENTS */
/* ======================================= */
.works-section__decor {
    position: absolute;
    pointer-events: none;
    z-index: 0;
    mix-blend-mode: screen;
    will-change: transform, filter;
}

.works-section__decor--one {
    width: 22rem;
    height: 22rem;
    top: -8rem;
    left: -6rem;
    background: radial-gradient(circle, rgba(124, 58, 237, 0.45) 0%, rgba(124, 58, 237, 0) 70%);
    filter: blur(2rem);
}
.dark .works-section__decor--one {
    background: radial-gradient(circle, rgba(99, 102, 241, 0.5) 0%, rgba(99, 102, 241, 0.08) 72%, transparent 100%);
    filter: blur(2.4rem);
    opacity: 0.75;
}

.works-section__decor--two {
    width: 18rem;
    height: 18rem;
    bottom: -6rem;
    right: -4rem;
    background: radial-gradient(circle, rgba(236, 72, 153, 0.38) 0%, rgba(236, 72, 153, 0) 70%);
    filter: blur(3rem);
}
.dark .works-section__decor--two {
    background: radial-gradient(circle, rgba(236, 72, 153, 0.48) 0%, rgba(236, 72, 153, 0.12) 68%, transparent 100%);
    filter: blur(3.6rem);
    opacity: 0.68;
}

/* Grid is already very efficient */
.works-section__decor--grid {
    inset: 0;
    background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
    background-size: 9rem 9rem;
    opacity: 0.4;
}
.dark .works-section__decor--grid {
    background-image:
        linear-gradient(rgba(148, 163, 255, 0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(167, 139, 250, 0.06) 1px, transparent 1px);
    opacity: 0.28;
}

/* ======================================= */
/* 4. CONTENT & CARD STYLES */
/* ======================================= */
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
    color: rgba(30, 27, 75, 0.9);
}
.dark .works-title {
    color: rgba(226, 232, 240, 0.95);
}
.works-subtitle {
    max-width: 38rem;
    margin: 0 auto 3rem;
    text-align: center;
    color: rgba(55, 65, 81, 0.82);
    font-size: 1.05rem;
    line-height: 1.7;
}
.dark .works-subtitle {
    color: rgba(203, 213, 225, 0.88);
}

/* Works Card - Added performance hint for hover effects */
.works-card {
    position: relative;
    overflow: hidden;
    border-radius: 1.25rem;
    padding: 0.35rem;
    transition: transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease, background 0.4s ease;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(230, 230, 255, 0.9));
    border: 1px solid rgba(124, 58, 237, 0.12);
    box-shadow: 0 22px 40px rgba(15, 23, 42, 0.12);
    backdrop-filter: blur(9px);
    will-change: transform, box-shadow; 
}

.works-card::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at top right, rgba(124, 58, 237, 0.22), transparent 55%);
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
    will-change: opacity;
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
    background: linear-gradient(160deg, rgba(30, 41, 59, 0.92) 0%, rgba(17, 24, 39, 0.88) 100%);
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