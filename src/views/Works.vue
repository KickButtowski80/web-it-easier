<template>
  <section id="our-works" class="works-section py-24 text-text-1 -mt-24 md:-mt-28 relative z-[5]">
    <div class="works-section__decor works-section__decor--one" aria-hidden="true"></div>
    <div class="works-section__decor works-section__decor--two" aria-hidden="true"></div>
    <div class="works-section__decor works-section__decor--grid" aria-hidden="true"></div>
    <div class="works-section__divider works-section__divider--top" aria-hidden="true"></div>
    <div class="container relative z-10 mx-auto px-4 lg:px-8">
      <p class="works-kicker">Featured Projects</p>
      <h1 class="works-title">Our Works</h1>
      <p class="works-subtitle">
        Crafted partnerships that blend strategy, design, and performant code. Here are a few highlights.
      </p>
      <div class="relative z-10 container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-0 items-start">
        <!-- Universal Pain Management -->
        <div class="works-card">
          <Suspense>
            <template #default>
              <Work :projectInfo="{
                projectId: 1,
                image: '/images/universal-pain.webp',
                imageAlt: 'universal pain management screen shot picture',
                projectTitle: 'Universal Pain Management',
                clientName: 'Universal Pain Management',
                description: 'Developed an informative website for a pain clinic aimed at helping patients understand the services and treatments offered. The website includes comprehensive information on various pain management options, and a user-friendly interface to facilitate easy navigation and access to resources. Additionally, the website supports accessibility features to ensure it is usable by all patients, including those with disabilities.',
                technologiesUsed: ['Parcel.js', 'JavaScript', 'Tailwind.css', 'HTML'],
                startDate: '',
                endDate: '',
                highlights: [
                  'Add  comprehensive library of educational resources including videos with full explanation on pain management and treatment options.(ViewMedica)',
                  'Mobile first design',
                  'Optimized website for SEO, and accessability and performance.'
                ],
                liveView: 'https://www.universalpain.com/',
                codeView: 'https://github.com/KickButtowski80/universal-pain',
                privateRepo: true
              }" />
            </template>
            <template #fallback>
              <div>Loading project...</div>
            </template>
          </Suspense>
        </div>

        <!-- Salud Clinical Solutions -->
        <div class="works-card">
          <Suspense>
            <template #default>
              <Work :projectInfo="{
                projectId: 5,
                image: '/images/salud-clinical.webp',
                imageAlt: 'Salud Clinical Solutions website screenshot',
                projectTitle: 'Salud Clinical Solutions',
                clientName: 'Salud Clinical Solutions',
                description: 'Connecting Behavioral and Mental Health providers with the roles that matter most. We specialize in behavioral and mental health locum tenens across California. From major metro areas to underserved communities, our team can help clinicians find the right fit. The website features a modern, professional design that effectively communicates their healthcare staffing services and helps clinicians find the right behavioral health roles quickly. The platform provides comprehensive resources for healthcare professionals seeking locum tenens opportunities, with detailed information about available positions, requirements, and the application process. The site emphasizes Salud Clinical\'s commitment to quality healthcare staffing and their expertise in matching qualified clinicians with appropriate healthcare facilities throughout California.',
                technologiesUsed: ['Parcel.js', 'HTML', 'CSS', 'JavaScript'],
                startDate: '',
                endDate: '',
                highlights: [
                  'Professional healthcare staffing website design',
                  'Mobile-responsive layout for healthcare professionals',
                  'Optimized for search engines and accessibility',
                  'Clean, modern UI focused on user experience'
                ],
                liveView: 'https://saludclinical.com/',
                codeView: '',
                privateRepo: true
              }" />
            </template>
            <template #fallback>
              <div>Loading project...</div>
            </template>
          </Suspense>
        </div>

        <!-- Cicero Pizza -->
        <div class="works-card">
          <Suspense>
            <template #default>
              <Work :projectInfo="{
                projectId: 3,
                image: '/images/cicceropizza-hero.webp',
                imageAlt: 'slice of pizza was lift off from the plate',
                projectTitle: 'Cicero Pizza',
                clientName: 'Cicero Pizza',
                description: 'Cicero Pizzeria is a dynamic and user-friendly web application that offers a seamless online pizza ordering experience. Built with modern web technologies, the website showcases a clean and intuitive interface that makes navigation effortless. The project demonstrates proficiency in js for frontend development and Tailwind CSS for responsive and modern design. The website features an interactive menu, secure online payment system, and a user-friendly order tracking feature. It stands as a testament to my ability to create engaging, efficient, and scalable web applications',
                technologiesUsed: ['Parcel.js', 'JavaScript', 'Tailwind.css', 'HTML'],
                startDate: '',
                endDate: '',
                highlights: [
                  'Designed a modern, responsive layout compatible with all devices.',
                  'Integrated contact form with backend email service.',
                  'Implemented interactive hero section illustration with animated elements.',
                  'Achieved high scores in Lighthouse audits for performance and accessibility.'
                ],
                liveView: 'https://cicero-pizzeria.vercel.app/',
                codeView: 'https://github.com/KickButtowski80/cicero-pizzeria',
                privateRepo: false
              }" />
            </template>
            <template #fallback>
              <div>Loading project...</div>
            </template>
          </Suspense>
        </div>

        <!-- Jane Doe Portfolio -->
        <div class="works-card">
          <Suspense>
            <template #default>
              <Work :projectInfo="{
                projectId: 4,
                image: '/images/jane-doe-portfolio.webp',
                imageAlt: 'Jane Doe Portfolio workspace illustration and some info about her work experience and skills',
                projectTitle: 'Jane Doe Portfolio',
                clientName: 'Jane Doe',
                description: 'The website is Jane Doe\'s professional portfolio, showcasing her 2 years of experience as a full-stack developer. It features an interactive workspace illustration with animated elements, a dark mode toggle, and responsive navigation. The site highlights her skills in HTML, CSS, JavaScript, Java, Node.js, and SVG through visually appealing cards, and showcases her project experience with IBM Cloud and Watson Services. With sections like About Me, Skills, Projects, and Recommendations, the portfolio emphasizes accessibility and user experience, including skip links and ARIA labels, reflecting her commitment to web development best practices.',
                technologiesUsed: ['HTML', 'CSS', 'JavaScript', 'firebase.js'],
                startDate: '',
                endDate: '',
                highlights: [
                  'Designed a modern, responsive layout compatible with all devices.',
                  'Implemented interactive workspace illustration with animated elements.',
                  'Integrated recommendation form with backend abilities.',
                  'Achieved high scores in Lighthouse audits for performance and accessibility.'
                ],
                liveView: 'https://portfolio-it-rouge.vercel.app/',
                codeView: 'https://github.com/KickButtowski80/portfolio-coursera',
                privateRepo: false
              }" />
            </template>
            <template #fallback>
              <div>Loading project...</div>
            </template>
          </Suspense>
        </div>

        <!-- Acme Rocket -->
        <div class="works-card">
          <Suspense>
            <template #default>
              <Work :projectInfo="{
                projectId: 2,
                image: '/images/acme-rocket.webp',
                imageAlt: 'Acme Rocket screen shot picture',
                projectTitle: 'Acme Rocket',
                clientName: 'Acme Rocket',
                description: 'Developed an informative static website for a imaginary rocket company aimed at helping its customer to  understand the services and types of rockets are offered.They\'re building rockets for the next century today. From the moon to Mars, Jupiter and beyond ...🚀 Think Acme Rockets. The website includes comprehensive information on various rocket models, and a user-friendly interface to facilitate easy navigation and access to resources of the company.',
                technologiesUsed: ['Vue 3.js', 'JavaScript', 'Tailwind.css', 'HTML'],
                startDate: '',
                endDate: '',
                highlights: [
                  'Add animation to enhance user experience by make pages more dynamic and engaging',
                  'Mobile first design',
                  'Optimized website accessability and performance.'
                ],
                liveView: 'https://acme-rockets-eight.vercel.app/#hero',
                codeView: 'https://github.com/KickButtowski80/acme-rockets',
                privateRepo: false
              }" />
            </template>
            <template #fallback>
              <div>Loading project...</div>
            </template>
          </Suspense>
        </div>
      </div>
    </div>
    <div class="works-section__divider" aria-hidden="true"></div>
    <div class="works-section__divider works-section__divider--lower" aria-hidden="true"></div>
  </section>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  components: {
    Work: defineAsyncComponent(() => import('../components/Work.vue'))
  }
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
    --works-primary: #7c3aed;
    --works-primary-soft: rgba(124, 58, 237, 0.28);
    --works-secondary: #ec4899;
    --works-secondary-soft: rgba(236, 72, 153, 0.2);
    --works-accent: #9918fb;
    --works-accent-soft: rgba(153, 104, 222, 0.82);
    --works-light: rgba(244, 225, 255, 0.97);
    --works-text-primary: var(--color-text-primary);
    --works-text-secondary: var(--color-text-secondary);
    
    background:
        /* Radial 1 */
        radial-gradient(120% 85% at 15% -5%, var(--works-primary-soft), transparent 60%),
        /* Radial 2 */
        radial-gradient(95% 65% at 85% 0%, var(--works-secondary-soft), transparent 65%),
        /* Linear Gradient (Main Background) */
        linear-gradient(180deg,
            rgba(55, 35, 115, 0.94) 0%,
            rgba(99, 52, 181, 0.88) 20%,
            var(--works-accent-soft) 42%,
            rgba(208, 161, 255, 0.86) 68%,
            var(--works-light) 90%,
            rgba(248, 240, 255, 1) 100%
        );
    transition: background 0.3s ease;
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
        rgba(18, 16, 46, 0.88) 0%,
        rgba(64, 36, 128, 0.74) 36%,
        rgba(129, 140, 248, 0.32) 76%,
        rgba(129, 140, 248, 0.08) 100%
    );
    transform: skewY(-8deg) rotate(-2deg);
    filter: blur(3.2rem); 
    opacity: 0.92;
}

/* ELEMENT: ::after (Top Clip-Path Border) */
.works-section::after {
    top: -2.5rem;
    left: 0;
    right: 0;
    height: 9rem;
    background: linear-gradient(176deg,
        rgba(146, 64, 246, 0.24) 8%,
        rgba(109, 76, 217, 0.4) 56%,
        rgba(237, 233, 254, 0.95) 100%);
    opacity: 0.95;
    transform: skewY(-2.2deg);
    transform-origin: top;
}

/* Remove the fragile nested pseudo-element for better maintainability */

/* ======================================= */
/* 2. DARK MODE STYLES */
/* ======================================= */
.dark .works-section {
    --works-primary: #6366f1;
    --works-primary-soft: rgba(129, 140, 248, 0.42);
    --works-secondary: #ec4899;
    --works-secondary-soft: rgba(236, 72, 153, 0.14);
    --works-accent: #634ac3;
    --works-accent-soft: rgba(94, 72, 198, 0.7);
    --works-light: rgba(116, 95, 220, 0.65);
    --works-text-primary: #e2e8f0;
    --works-text-secondary: #cbd5e1;
    
    background:
        radial-gradient(120% 95% at 18% -12%, var(--works-primary-soft), transparent 78%),
        radial-gradient(115% 75% at 90% 12%, var(--works-secondary-soft), transparent 68%),
        linear-gradient(185deg,
            rgba(58, 68, 160, 0.92) 0%,
            rgba(72, 63, 196, 0.8) 52%,
            var(--works-accent-soft) 82%,
            var(--works-light) 100%
        );
}
.dark .works-section::before {
    background: linear-gradient(110deg,
        rgba(28, 25, 82, 0.96) 0%,
        rgba(62, 64, 158, 0.78) 52%,
        rgba(120, 130, 220, 0.38) 86%,
        rgba(48, 50, 128, 0.16) 100%
    );
    opacity: 0.95;
}
.dark .works-section::after {
    background: linear-gradient(286deg,
        rgba(186, 204, 255, 0.62) 0%,
        rgba(168, 194, 255, 0.38) 54%,
        rgba(148, 128, 242, 0.24) 100%
    );
    opacity: 0.58;
    transform: skewY(-2.2deg);
    transform-origin: top;
}
/* Simplified dark mode without the nested pseudo-element */

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

.works-section__divider {
    position: absolute;
    inset: auto 0 -3rem 0;
    height: 13rem;
    background: linear-gradient(352deg,
            rgba(124, 58, 237, 0.42) 0%,
            rgba(168, 85, 247, 0.28) 52%,
            rgba(236, 72, 153, 0.08) 78%,
            rgba(255, 255, 255, 0) 92%);
    transform: skewY(-5deg);
    transform-origin: bottom right;
    opacity: 0.9;
    pointer-events: none;
    z-index: 1;
}

.works-section__divider--top {
    inset: -6.5rem 0 auto 0;
    height: 12rem;
    background: linear-gradient(196deg,
            rgba(168, 85, 247, 0.26) 0%,
            rgba(129, 140, 248, 0.18) 46%,
            rgba(255, 255, 255, 0) 88%);
    transform: skewY(-5deg);
    transform-origin: top left;
    opacity: 0.88;
    mix-blend-mode: screen;
}

.dark .works-section__divider {
    background: linear-gradient(350deg,
            rgba(99, 102, 241, 0.48) 0%,
            rgba(129, 140, 248, 0.32) 52%,
            rgba(56, 189, 248, 0.16) 82%,
            rgba(129, 140, 248, 0) 96%);
    opacity: 0.9;
}

.dark .works-section__divider--top {
    background: linear-gradient(200deg,
            rgba(139, 92, 246, 0.32) 0%,
            rgba(165, 180, 252, 0.24) 48%,
            rgba(148, 163, 255, 0.1) 88%);
    opacity: 0.82;
    mix-blend-mode: lighten;
}

.works-section__divider--lower {
    inset: auto -2% -14.5rem 0%;
    height: 18rem;
    background: linear-gradient(201deg,
            rgba(236, 72, 153, 0.34) 8%,
            rgba(168, 85, 247, 0.22) 42%,
            rgba(124, 58, 237, 0.14) 72%,
            rgba(255, 255, 255, 0) 96%);
    transform: skewY(-2.5deg);
    transform-origin: top left;
    opacity: 0.64;
}

.dark .works-section__divider--lower {
    background: linear-gradient(199deg,
            rgba(56, 189, 248, 0.26) 12%,
            rgba(129, 140, 248, 0.2) 50%,
            rgba(79, 70, 229, 0.14) 80%,
            rgba(18, 21, 56, 0) 98%);
    opacity: 0.58;
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
    color: var(--works-primary);
    background: rgba(255, 255, 255, 0.65);
    border-radius: 999px;
    padding: 0.35rem 1.1rem;
    margin: 0 auto 1.5rem;
    width: max-content;
    box-shadow: 0 1rem 2.5rem var(--works-primary-soft);
}
.dark .works-kicker {
    background: rgba(30, 27, 75, 0.65);
    box-shadow: 0 1.2rem 3rem var(--works-primary-soft);
}
.works-title {
    font-size: clamp(2.5rem, 4vw + 0.5rem, 3.5rem);
    font-weight: 700;
    text-align: center;
    margin-bottom: 0.75rem;
    color: var(--works-text-primary);
}
.dark .works-title {
    color: var(--works-text-primary);
}
.works-subtitle {
    max-width: 38rem;
    margin: 0 auto 3rem;
    text-align: center;
    color: var(--works-text-secondary);
    font-size: 1.05rem;
    line-height: 1.7;
}
.dark .works-subtitle {
    color: var(--works-text-secondary);
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
    background: radial-gradient(circle at top right, rgba(124, 58, 237, 0.35), transparent 55%);
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
    background: radial-gradient(circle at top right, rgba(129, 140, 248, 0.35), transparent 60%);
}
.dark .works-card:hover {
    border-color: rgba(129, 140, 248, 0.45);
}
</style>