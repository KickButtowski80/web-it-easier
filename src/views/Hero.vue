<template>
  <section
    id="hero"
    class="bg-purple-500 h-screen md:mt-20 md:h-[40rem]
     text-white flex flex-col items-center justify-center md:flex-row md:gap-20 md:text-9xl mx-auto diagonal"
  >
    <div class="relative">
      <div class="frame p-10 m-10 clip-your-needful-style w-40 h-[15rem] md:h-[16rem]"></div>
      <div
        ref="door"
        class="door border-2 border-purple-800 opacity-0 absolute top-[3.75rem] left-[3.25rem] z-50 w-[6.5rem] h-[14.25rem] md:h-[14rem] animate-open-door"
      >
        <div
          ref="knob"
          class="knob inline-block text-9xl md:text-[10rem] border-xl rounded-full bg-purple-800 h-5 w-5 absolute bottom-24 left-[4.5rem] animate-open-door-knob md:bottom-[80px] md:right-[145px]"
        ></div>
      </div>
      <div
        ref="sun"
        class="sun w-[2.5rem] absolute bottom-[173px] left-[8.5rem] opacity-0 animate-sun-appears"
      >
        <img src="/sun.svg" alt="" />
      </div>
      <div
        ref="background"
        class="background w-[8rem] h-[5.5rem] absolute bottom-[122px] md:bottom-[140px] left-[3rem] opacity-0 animate-bg-appears"
      >
        <img class="" src="/nature-road-bg-pres.png" alt="" />
      </div>
      <div
        class="font-normal text-[22rem] md:text-[22rem] text-stroke-purple absolute top-0 -left-5"
      >
        <div
          ref="letterI"
          class="inline-block mx-auto opacity-0 animate-rotate-letter-right absolute top-[-123px] md:top-[-37px] left-0"
        >
          I
        </div>
        <div
          ref="letterT"
          class="inline-block opacity-0 animate-rotate-letter-left absolute top-[-123px] md:top-[-37px] left-[97px]"
        >
          T
        </div>
      </div>
    </div>
    <p
      ref="slogan"
      class="text-3xl md:text-4xl font-semibold md:leading-[4rem] opacity-0 text-center animate-slogan"
    >
      The Door to
      <!-- <br> -->
      an easier future
      <br />
      <span class="font-thin text-xl">one website at a time</span>
    </p>
    
  </section>
  <button
    @click="replayAnimation"
    class="px-4 py-2 relative z-1
     bg-purple-700 text-sm text-white rounded-lg hover:bg-purple-800"
  >
    Replay Animation
  </button>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'HeroSection',
  setup() {
    const door = ref(null);
    const knob = ref(null);
    const sun = ref(null);
    const background = ref(null);
    const letterI = ref(null);
    const letterT = ref(null);
    const slogan = ref(null);

    const replayAnimation = () => {
      console.log('I am clicked')
      const elements = [door, knob, sun, background, letterI, letterT, slogan];
      elements.forEach(element => {
        element.value.classList.remove('animate-open-door', 'animate-open-door-knob', 'animate-sun-appears', 'animate-bg-appears', 'animate-rotate-letter-right', 'animate-rotate-letter-left', 'animate-slogan');
        // Force reflow to restart the animation
        // void element.value.offsetWidth;
        element.value.classList.add('animate-open-door', 'animate-open-door-knob', 'animate-sun-appears', 'animate-bg-appears', 'animate-rotate-letter-right', 'animate-rotate-letter-left', 'animate-slogan');
      });
    };

    return {
      door,
      knob,
      sun,
      background,
      letterI,
      letterT,
      slogan,
      replayAnimation,
    };
  },
};
</script>

<style scoped>
/* Add any additional styles if needed */
</style>


<style scoped lang="css">
#hero {
  /* background-image: linear-gradient(55deg, #7612e9, #c471ed, #f64f59); */

}
.diagonal {
  position: relative;
 
  isolation: isolate;
  background-image: linear-gradient(315deg, #7612e9, #c471ed, #f64f59);
}

.diagonal::before,
.diagonal::after {
  content: "";
  width: 100%;
  height: 200px; 
  position: absolute;
 

}


.diagonal::after{
  bottom: -75px;
  background: linear-gradient(-145deg, #7612e9, #c471ed, #f64f59);
  transform: skewY(-538deg);
  z-index: -2;
 
}
</style>
