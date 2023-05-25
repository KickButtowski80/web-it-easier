<template lang="">
  <section class="bg-purple-400  ">
    <div class="p-2 flex max-w-2xl mx-auto relative">
      <span class="text-xl md:text-2xl"> IT 🚪 </span>
      <nav
        class="hidden md:[&>*]:pr-5 md:[&>*]:text-xl
         md:[&>*]:font-semibold md:flex md:absolute md:right-0"
        aria-label="main"
      >
        <a href="#">Home</a>
        <a href="#">My Work</a>
        <a href="#">Hire me</a>
      </nav>
      <div class="">
        <section
          @click="toggleHamburgerMenu"
          :class="{ hidden: isHamburgerShowing }"
          class="absolute right-10 flex flex-col md:hidden mt-2.5
           before:content-[''] before:bg-white
           before:w-6 before:h-1 before:rounded
           before:-translate-x-0 before:-translate-y-2 bg-black
           w-6 h-1 rounded translate-x-1 translate-y-0
           after:content-[''] after:rounded after:bg-white
           after:w-6 after:h-1 after:-translate-x-0 after:translate-y-2"
        ></section>
        <section
          @click="toggleHamburgerMenu"
          :class="{ hidden: !isHamburgerShowing }"
          class="absolute right-9 top-3   md:hidden  mt-2.5 w-8 h-1
           rounded bg-white rotate-45 before:flex
           before:rounded before:content-['']
           before:w-8 before:h-1 before:bg-black
           before:-rotate-90"
        ></section>
      </div>
    </div>
  </section>
  <nav
   class="flex flex-col min-h-screen absolute right-0 bg-purple-900
   [&>*]:m-5 [&>*]:text-white md:hidden" 
  :class="{ hidden: !isHamburgerShowing }"
  >   
        <a href="#">Home</a>
        <a href="#">My Work</a>
        <a href="#">Hire me</a></nav>
</template>
<script>
export default {
  data() {
    return {
      isHamburgerShowing: false,
    };
  },
  methods: {
    toggleHamburgerMenu() {
      this.isHamburgerShowing = !this.isHamburgerShowing;
    },
  },
};
</script>
<style lang=""></style>
