<template>
  <section id="hire-us" aria-label="Hire Us Section" class="flex flex-col items-center justify-center relative py-16">
    <div class="hire-us__divider" aria-hidden="true"></div>
    <header class="text-center mb-20 relative z-20">
      <h1 class="font-bold py-6 text-3xl text-slate-900 dark:text-slate-100">Hire Our Team</h1>
    </header>

    <div id="members-cards-info"
      class="w-96 bg-purple-400 dark:bg-slate-950/70 p-6 rounded-[1.1rem] relative text-blue-700 dark:text-sky-300 z-[2] left-0 md:left-[-14rem] border-white dark:border-slate-700 border-1 h-[60%]">
      <div class="card relative">
        <header class="text-2xl font-semibold text-slate-900 dark:text-slate-100">Our Team members</header>
        <section class="members flex flex-col items-center justify-center gap-2">
          <div>
            <h2 class="font-bold text-2xl text-slate-900 dark:text-slate-100">Sam T</h2>
            <img src="/programmers/Samuel-C-Tyler.svg" alt="picture of Samuel C Tyler the lead developer"
              class="float-right w-1/2 overflow-hidden" loading="lazy" width="300" height="300" />
            <p class="text-lg font-semibold text-slate-800 dark:text-slate-300" role="doc-subtitle">Lead Developer</p>
            <a href="#sam-info" class="text-blue-700 dark:text-sky-300 underline">more info...</a>
          </div>
          <div>
            <h2 class="font-bold text-2xl text-slate-900 dark:text-slate-100">Izak T</h2>
            <img src="/programmers/izak-t.svg" alt="picture of Izak Tarashandegan the founder and Developer"
              class="float-right w-1/2 overflow-hidden" loading="lazy" />
            <p class="text-lg font-semibold text-slate-800 dark:text-slate-300" role="doc-subtitle">Founder / Developer</p>
            <a href="#izak-info" class="text-blue-700 dark:text-sky-300 underline">more info...</a>
          </div>
        </section>
      </div>

      <section
        class="contact-info md:absolute grid grid-cols-1 md1:grid-cols-2 max-w-sm md:max-w-xl lg:max-w-3xl p-6 mb-16 md:mb-8 bg-white dark:bg-slate-950/80 border border-gray-200 dark:border-slate-700 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-slate-950 glass">
        <section class="col-span-1">
          <div class="card">
            <div class="font-normal text-gray-900 dark:text-slate-100">
              <h2 class="text-center w-full pr-[28px] font-semibold text-2xl text-blue-700 dark:text-sky-300">
                Contact Us to make your dream a reality
              </h2>
              <div class="flex flex-col gap-5 mt-16">
                <div>
                  <span class="text-slate-900 dark:text-slate-300">Tel:</span>
                  <a href="tel:+1 (424)-442-0591" class="text-blue-700 dark:text-sky-300">(424)-442-0591 </a>
                </div>
                <div>
                  <span class="text-slate-900 dark:text-slate-300">Email:</span>
                  <a href="mailto:pazpaz25@gmail.com" class="text-blue-700 dark:text-sky-300">pazpaz25@gmail.com</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </div>

    <section
      class="contact-info md:absolute z-[1] grid grid-cols-1 md:grid-cols-2 max-w-sm md:max-w-xl lg:max-w-3xl p-6 mb-16 md:mb-8 bg-white dark:bg-slate-950/80 border border-gray-200 dark:border-slate-700 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-slate-950 glass">
      <div class="col-span-1"></div>
      <section class="col-span-1">
        <div class="card">
          <div class="font-normal text-gray-900 dark:text-slate-100">
            <h2 class="text-center w-full pr-[28px] font-semibold text-2xl text-blue-700 dark:text-sky-300">
              Contact Us to make your dream a reality
            </h2>
            <div class="flex flex-col gap-5 mt-16">
              <div>
                <span class="text-slate-900 dark:text-slate-300">Tel:</span>
                <a href="tel:+1 (424)-442-0591" class="text-blue-700 dark:text-sky-300">(424)-442-0591 </a>
              </div>
              <div>
                <span class="text-slate-900 dark:text-slate-300">Email:</span>
                <a href="mailto:pazpaz25@gmail.com" class="text-blue-700 dark:text-sky-300">pazpaz25@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>

    <section
      class="members-info md:absolute grid grid-cols-1 md:grid-cols-2 max-w-sm md:max-w-xl lg:max-w-3xl p-6 mb-16 md:mb1-8">
      <div class="col-span-1"></div>
      <section class="col-span-1">
        <div class="card">
          <div id="sam-info"
            class="bg-gradient-to-r from-blue-100 to-purple-500 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950 text-slate-900 dark:text-slate-100 rounded-lg shadow-md max-w-2xl leading-relaxed">
            <a href="#close" class="text-slate-700 dark:text-sky-300 font-semibold"> X </a>
            <h2 class="font-bold py-3 text-3xl">Samuel C Tyler</h2>
            <p class="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-300" role="doc-subtitle">Lead Developer</p>
            <img src="/programmers/Samuel-C-Tyler.svg" alt="Samuel C Tyler the leader coder"
              class="float-right overflow-hidden w-1/2 fit-content" loading="lazy" />
            <p>
              Web Application Developer with 10+ years experience in modern,
              full-stack, component-based design with a focus on reliability via
              automated testing. Extremely diverse history in getting up to
              speed quickly and utilizing many different technologies to solve
              real-world problems. Diverse portfolio of applications includes an
              online document viewer, inventory management software, online
              health care tracking apps, and social network visualization and
              analysis.
            </p>
          </div>

          <div id="izak-info"
            class="bg-gradient-to-r from-blue-100 to-purple-500 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950 text-slate-900 dark:text-slate-100 p-6 rounded-lg shadow-md max-w-2xl leading-relaxed">
            <a href="#close" class="text-slate-700 dark:text-sky-300 font-semibold"> X </a>
            <h2 class="font-bold py-3 text-3xl">Izak Tarashandegan</h2>
            <p class="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-300" role="doc-subtitle">Founder / Coder</p>
            <img src="/programmers/izak-t.svg" alt="izak tarashandegan the founder and coder"
              class="float-right overflow-hidden w-1/2 fit-content" loading="lazy" />
            <p>
              At IT, we specialize in helping businesses build a strong internet
              presence. With a degree in CS from CSUN and years of experience as
              a freelance web developer, I’ve had the pleasure of supporting
              various companies in bringing their digital visions to life. Our
              mission is simple: to make your life easier by crafting websites
              that are not only functional but also impactful. We believe in
              opening doors of opportunity, one website at a time.
            </p>
          </div>
        </div>
      </section>
    </section>
  </section>
</template>

<script>
import membersInfoData from "../assets/json/membersInfoData.json";
import MemberProfile from "../components/MemberProfile.vue";
import { ref, onMounted } from "vue";
export default {
  components: { MemberProfile },

  setup() {
    const membersInfo = ref([]);
    onMounted(() => {
      membersInfo.value = membersInfoData.membersInfo;
    });
    return {
      membersInfo,
    };
  },
};
</script>

<style scoped lang="css">
header h1 {
  animation: slide-in 0.8s ease-in-out;
}

@keyframes slide-in {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(0);
  }
}

.glass {
  -webkit-backdrop-filter: blur(0.625rem);
  backdrop-filter: blur(0.625rem);
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 1rem;
  padding: 1.5rem;
  color: #1f2937;
  box-shadow: 0 0.25rem 0.375rem rgba(0, 0, 0, 0.1);
  opacity: 1;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.dark .glass {
  background-color: rgba(30, 41, 59, 0.3);
  color: #e2e8f0;
  box-shadow: 0 0.25rem 0.375rem rgba(0, 0, 0, 0.3);
}

#hire-us {
  height: 100%;
  min-height: 100%;
  position: relative;
  overflow: hidden;
  z-index: 0;
  --hire-primary: #bd80fa;
  --hire-primary-soft: rgba(189, 128, 250, 0.42);
  --hire-secondary: #a855f7;
  --hire-secondary-soft: rgba(168, 85, 247, 0.16);
  --hire-accent: #7c3aed;
  --hire-accent-soft: rgba(124, 58, 237, 0.08);
  --hire-gold: rgb(189, 128, 250);
  --hire-gold-soft: rgba(186, 196, 255, 0.42);
  --hire-blue: rgba(99, 110, 230, 0.64);
  --hire-blue-soft: rgba(99, 102, 241, 0.36);
  --hire-indigo: #4c1d95;
  --hire-indigo-soft: rgba(71, 85, 179, 0.22);
  --hire-transition-speed: 0.5s;
  transition: background 0.3s ease;
}

.dark #hire-us {
  --hire-primary: #6366f1;
  --hire-primary-soft: rgba(99, 102, 241, 0.35);
  --hire-secondary: #a855f7;
  --hire-secondary-soft: rgba(168, 85, 247, 0.16);
  --hire-accent: #4c1d95;
  --hire-accent-soft: rgba(124, 58, 237, 0.08);
  --hire-gold: rgb(129, 140, 248);
  --hire-gold-soft: rgba(129, 140, 248, 0.42);
  --hire-blue: rgba(99, 110, 230, 0.64);
  --hire-blue-soft: rgba(99, 102, 241, 0.36);
  --hire-indigo: #4c1d95;
  --hire-indigo-soft: rgba(71, 85, 179, 0.22);
}

#hire-us::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-image: linear-gradient(135deg,
      transparent 50%,
      var(--hire-primary) 50%);
  background-size: 48rem 48rem;
  transition: background-position 0.2s;
  background-attachment: fixed;
  background-position: bottom right;
  background-repeat: no-repeat;
  z-index: 0;
}

.dark #hire-us::before {
  background-image: linear-gradient(135deg,
      transparent 50%,
      var(--hire-primary-soft) 50%);
}

#hire-us::after {
  content: "";
  position: absolute;
  top: -2.5rem;
  left: -18%;
  right: -10%;
  height: 12rem;
  background:
    radial-gradient(118% 88% at 4% 22%, var(--hire-gold-soft), transparent 74%),
    linear-gradient(160deg, var(--hire-secondary-soft) 10%, var(--hire-secondary-soft) 44%, var(--hire-accent-soft) 74%, rgba(255, 255, 255, 0) 100%);
  opacity: 0.78;
  pointer-events: none;
  z-index: 0;
  transition: opacity 0.3s ease, background 0.3s ease;
}

.dark #hire-us::after {
  background:
    radial-gradient(118% 88% at 4% 22%, var(--hire-blue), transparent 70%),
    linear-gradient(156deg, var(--hire-blue-soft) 12%, rgba(148, 163, 255, 0.3) 48%, var(--hire-indigo-soft) 78%, rgba(28, 28, 60, 0) 100%);
  opacity: 0.86;
}

.hire-us__divider {
  position: absolute;
  inset: -6rem -1% auto -6%;
  height: 11rem;
  background: linear-gradient(194deg,
      var(--hire-secondary-soft) 10%,
      var(--hire-accent-soft) 54%,
      rgba(236, 72, 153, 0.08) 92%,
      rgba(255, 255, 255, 0) 100%);
  opacity: 0.7;
  pointer-events: none;
  z-index: 1;
  transition: opacity 0.3s ease, background 0.3s ease;
}

.dark .hire-us__divider {
  background: linear-gradient(192deg,
      var(--hire-blue-soft) 12%,
      rgba(148, 163, 255, 0.24) 58%,
      var(--hire-indigo-soft) 94%,
      rgba(24, 24, 56, 0) 100%);
  opacity: 0.7;
}

#members-cards-info .card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  place-items: center;
  gap: 2rem;
}

#members-cards-info .contact-info {
  opacity: 0;
  width: 24rem;
  top: 0;
  left: 0;
  z-index: -1;
}

#members-cards-info .members div {
  width: 100%;
  background: white;
  border: 0.0625rem solid gray;
  border-radius: 10%;
  padding: 2rem;
  transition:
    transform 0.5s ease-in-out,
    opacity 0.5s ease-in-out;
}

.dark #members-cards-info .members div {
  background: rgba(15, 23, 42, 0.92);
  border-color: rgba(148, 163, 184, 0.4);
  color: rgb(226, 232, 240);
}

.members-info .card div {
  width: 60%;
  height: 33.75rem;
  padding: 1.5rem;
  opacity: 0;
  color: #1f2937;
  transition:
    transform 0.5s ease-in-out,
    opacity 0.5s ease-in-out;
  position: absolute;
  top: -10%;
}

.dark .members-info .card div {
  color: rgb(226, 232, 240);
  background: linear-gradient(160deg, rgba(15, 23, 42, 0.96), rgba(30, 41, 59, 0.88));
  border-radius: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.35);
}

.contact-info {
  transition:
    transform 0.5s ease-in-out,
    opacity 0.5s ease-in-out;
}

#hire-us:has(:target) .contact-info {
  transform: translateX(-100%);
  opacity: 0;
}

#hire-us:has(:target) #members-cards-info .contact-info {
  top: 0%;
  left: 100%;
  opacity: 1;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: #bd80fa;
}

#hire-us:has(:target):has(.members-info) #members-cards-info+.card {
  opacity: 0;
}

.members-info .card div:target {
  transform: translateX(0%);
  opacity: 1;
  color: black;
}

.card div a {
  cursor: pointer;
}

a[href="#close"] {
  float: right;
  border: 0.125rem solid black;
  padding: 0.3125rem;
  border-radius: 0.3125rem;
  text-decoration: none;
}

@media screen and (max-width: 26.5625rem) {
  #hire-us * {
    overflow: initial;
    position: static;
    transform: none;
    height: auto;
    width: auto;
  }

  #hire-us {
    height: auto;
  }

  #hire-us::before {
    display: none;
  }

  #members-cards-info {
    display: none;
  }

  .members-info {
    margin: 0;
    padding: 0;
  }

  .members-info::before {
    content: "Our Team Members";
    width: 100%;
    display: block;
    position: relative;
    bottom: 100%;
    z-index: 1;
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
  }

  .members-info .card {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .members-info {
    opacity: 1;
  }

  #hire-us .members-info .card div {
    position: relative;
    opacity: 1;
    width: 18.5rem;
    height: auto;
    padding: 0.9rem;
    top: 100%;
    transition: none;
  }

  #hire-us .contact-info {
    width: calc(19rem - 0.5rem);
  }

  a[href="#close"] {
    display: none;
  }
}

@media screen and (min-width: 26.625rem) and (max-width: 48.0625rem) {
  #members-cards-info {
    left: -11rem;
  }

  .contact-info {
    left: 10rem;
  }

  .members-info {
    left: 8rem;
  }
}
</style>
