<template>
  <section
    id="hero"
    class="bg-purple-500 h-[90vh] md:mt-[4.5rem] md:h-[40rem] text-white flex flex-col items-center justify-center
     md:flex-row md:gap-20 md:text-9xl mx-auto diagonal"
  >
    <div class="relative" style="perspective: 1000px">
      <div
        class="frame p-10 m-10 clip-your-needful-style w-40 h-[15rem] md:h-[16rem]"
      ></div>
      <div
        style="perspective: 1000px"
        class="door border-2 border-purple-800 opacity-0 absolute top-[3.75rem] left-[3.25rem] z-50 w-[6.5rem] h-[14.25rem] md:h-[14rem] animate-open-door"
      >
        <div
          class="knob inline-block text-9xl md:text-[10rem] border-xl rounded-full bg-purple-800 h-5 w-5 absolute bottom-24 left-[4.5rem] animate-open-door-knob md:bottom-[80px] md:right-[145px]"
        ></div>
      </div>
      <div
        class="sun w-[2.5rem] absolute bottom-[173px] left-[8.5rem] opacity-0 animate-sun-appears"
      >
        <img src="/sun.svg" alt="Sun icon" loading="lazy" class="overflow-hidden" width="64" height="64" />
      </div>
      <div
        class="background w-[8rem] h-[5.5rem] absolute bottom-[122px] md:bottom-[140px] left-[3rem] opacity-0 animate-bg-appears"
      >
        <img
          class="overflow-hidden"
          src="/nature-road-bg-pres.png"
          alt="Nature road background"
          loading="lazy"
          width="800"
          height="550"
        />
      </div>
      <div
        class="font-normal text-[22rem] md:text-[22rem] text-stroke-purple absolute top-0 -left-5"
      >
        <div
          class="inline-block mx-auto opacity-0 animate-rotate-letter-right absolute top-[-123px] md:top-[-37px] left-0"
        >
          I
        </div>
        <div
          class="inline-block opacity-0 animate-rotate-letter-left absolute top-[-123px] md:top-[-37px] left-[97px]"
        >
          T
        </div>
      </div>
    </div>
    <div class="text-center">
      <h1 class="hero-slogan text-3xl md:text-4xl font-semibold md:leading-[4rem] opacity-0 animate-slogan text-slate-800 dark:text-white">
        The Door to an easier digital future
      </h1>
      <p class="hero-tagline font-thin text-xl opacity-0 animate-slogan-tagline text-slate-700 dark:text-gray-300">
        one website at a time
      </p>
    </div>
  </section>
  <div class="flex items-center justify-center">
    <button
      type="button"
      @click="replayAnimation"
      class="my-9 mx-6 -translate-y-28 z-1 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 w-fit"
      role="button"
    >
      Replay Animation
    </button>
  </div>
</template>

<script>
export default {
  name: "Hero",
  setup() {
    const replayAnimation = () => {
      const elements = [
        "open-door",
        "open-door-knob",
        "sun-appears",
        "bg-appears",
        "rotate-letter-right",
        "rotate-letter-left",
        "slogan",
      ];

      elements.forEach((element) => {
        const node = document.querySelector(`.animate-${element}`);

        node.classList.remove(`animate-${element}`);
        void node.offsetWidth; // Trigger reflow to restart the animation
        node.classList.add(`animate-${element}`);
      });
    };

    return {
      replayAnimation,
    };
  },
};
</script>

<style scoped lang="css">
 
.diagonal {
  position: relative;
  isolation: isolate;
  background-image: linear-gradient(24deg, #7c3aed 0%, #a855f7 25%, #f472b6 62%, #fb7185 100%);
}

.dark .diagonal {
  background-image:
    radial-gradient(circle at 14% 34%, rgba(255, 236, 204, 0.96) 0%, rgba(255, 236, 204, 0.42) 38%, rgba(255, 236, 204, 0.12) 64%, rgba(255, 236, 204, 0) 80%),
    radial-gradient(circle at 22% 18%, rgba(211, 164, 255, 0.35), rgba(211, 164, 255, 0) 78%),
    linear-gradient(320deg, #140a2d, #27115a, #4c1d95);
}

.diagonal::before,
.diagonal::after {
  content: "";
  width: 100%;
  height: 200px;
  position: absolute;
}

.diagonal::after {
  bottom: -110px;
  height: 260px;
  background: linear-gradient(45deg, rgba(118, 18, 233, 0.4), rgba(196, 113, 237, 0.32), rgba(246, 79, 89, 0.28));
  transform: skewY(185deg);
  opacity: 0.75;
  z-index: 60;
  pointer-events: none;
}

.dark .diagonal::after {
  background: linear-gradient(18deg,
      rgba(45, 21, 110, 0.45),
      rgba(92, 36, 180, 0.32),
      rgba(158, 38, 211, 0.24));
  opacity: 0.58;
}

.diagonal::before {
  content: "";
  position: absolute;
  inset: auto 0 -14rem 0;
  height: 18rem;
  background: linear-gradient(
    174deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(245, 240, 255, 0.32) 24%,
    rgba(196, 181, 253, 0.58) 52%,
    rgba(144, 118, 220, 0.78) 74%,
    rgba(78, 52, 145, 0.9) 100%
  );
  clip-path: polygon(0 58%, 100% 30%, 100% 100%, 0 100%);
  mix-blend-mode: multiply;
  opacity: 0.95;
  pointer-events: none;
  z-index: -1;
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.dark .diagonal::before {
  background: linear-gradient(
    176deg,
    rgba(32, 6, 85, 0) 0%,
    rgba(50, 14, 112, 0.16) 32%,
    rgba(60, 20, 132, 0.38) 58%,
    rgba(38, 18, 98, 0.66) 78%,
    rgba(18, 8, 54, 0.88) 100%
  );
}
</style>
