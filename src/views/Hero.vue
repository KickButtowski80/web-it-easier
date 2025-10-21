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
      <h1 class="text-3xl md:text-4xl font-semibold md:leading-[4rem] opacity-0 animate-slogan">
        The Door to an easier digital future
      </h1>
      <p class="font-thin text-xl opacity-0 animate-slogan-tagline">
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
  background-image: linear-gradient(308deg, #5b21b6 0%, #9333ea 28%, #f472b6 62%, #fb7185 100%);
}

.dark .diagonal {
  background-image: linear-gradient(320deg, #140a2d, #27115a, #4c1d95);
}

.diagonal::before,
.diagonal::after {
  content: "";
  width: 100%;
  height: 200px;
  position: absolute;
}


.diagonal::after {
  bottom: -75px;
  background: linear-gradient(-145deg, #7612e9, #c471ed, #f64f59);
  transform: skewY(-538deg);
  z-index: -2;
}

.dark .diagonal::after {
  background: linear-gradient(-140deg, #3b1a96, #6d28d9, #c026d3);
}

.diagonal::before {
  content: "";
  position: absolute;
  inset: auto 0 -16rem 0;
  height: 22rem;
  background: linear-gradient(
    174deg,
    rgba(124, 18, 233, 0) 0%,
    rgba(116, 18, 233, 0.12) 28%,
    rgba(88, 35, 156, 0.48) 60%,
    rgba(53, 24, 110, 0.65) 78%,
    var(--color-surface-2, #ede9fe) 100%
  );
  clip-path: polygon(0 32%, 100% 10%, 100% 100%, 0 100%);
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
    rgba(55, 16, 124, 0.18) 32%,
    rgba(66, 26, 142, 0.46) 60%,
    rgba(42, 19, 103, 0.72) 78%,
    rgba(15, 6, 52, 0.92) 100%
  );
}
</style>
