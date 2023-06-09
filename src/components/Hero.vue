<template lang="">
  <section
    class="bg-purple-500 h-screen text-white flex flex-col items-center justify-center md:flex-row md:gap-20 md:text-9xl mx-auto"
  >
    <div class="relative">
      <div
        class="frame p-10 m-10 
        clip-your-needful-style w-40 h-[15rem] md:h-[16rem]"
      ></div>
      <div
        class="door border-2 border-purple-800
         opacity-0
         absolute top-[3.75rem] left-[3.25rem] z-50
         w-[6.5rem] h-[14.25rem]
         md:h-[14rem] animate-open-door"
      >
        <div
          class="knob inline-block text-9xl md:text-[10rem]          
          border-xl rounded-full bg-purple-800 h-5 w-5
          absolute bottom-24 left-[4.5rem] animate-open-door-knob
          md:bottom-[80px] md:right-[145px] "
        >          
        </div>      
      </div>
      <div class="sun w-[5rem] absolute bottom-[70px] left-[5.5rem]
            opacity-0
            animate-sun-appears">
          <img src="/sun.svg" alt="">
       </div>
       <div class="background  w-[8rem] h-[5.5rem]
       absolute bottom-[44px] md:bottom-[53px] left-[3rem]
       opacity-0 animate-bg-appears">
          <img
      class=""
      src="/nature-road-bg.png"
      alt=""
    />
       </div>
      <div class="font-normal text-[22rem] md:text-[22rem] 
      text-stroke-purple 
      absolute top-0 -left-5
      ">
        <div
          class="inline-block mx-auto opacity-0 animate-rotate-letter-right
            absolute top-[-123px] md:top-[-37px] left-0"
        >
          I
        </div>
        <div class="w-[8.25rem] h-[2rem] border z-10
         translate-x-[4.5rem] translate-y-[1.75rem]
        bg-black">

        </div>
        <div
          class="inline-block opacity-0 animate-rotate-letter-left 
           absolute top-[-123px] md:top-[-37px] left-[97px]"
        >
          T
        </div>
      </div>
    </div>
    <p
      class="text-3xl md:text-4xl font-semibold md:leading-[4rem]
      opacity-0
       text-center animate-slogan"
    >
    Opening    
    the Door
    <br>
    to
    <br>
    an easier Future Web
    <br>     
    <span class="text-xl md:text-2xl">
       One Line of Code at a Time
     </span>       
    </p>
  </section>
</template>
<script>
export default {};
</script>
<style lang=""></style>
