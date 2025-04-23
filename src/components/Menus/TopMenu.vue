<template lang="">
  <section class="bg-purple-400 fixed top-0 
  w-full z-[100] h-navbar-height md:h-md-navbar-height">
    <div class="p-2 flex md:justify-between md:items-center">
      <span class="text-xl font-semibold md:text-5xl"> IT 🚪 </span>
      <nav
        class="hidden md:[&>*]:pr-5 md:[&>*]:text-2xl md:[&>*]:p-5
         md:[&>*]:font-semibold md:flex md:justify-between md:items-center
         "
        aria-label="main"
      >
        <RouterLink to="/"
        @click.native.prevent="scrollToSection('home')">Home</RouterLink>
        <RouterLink to="/blog">Blog</RouterLink>
        <RouterLink 
          to="/#our-works" 
          @click.native.prevent="scrollToSection('our-works')"
        >Our Works</RouterLink>
        <RouterLink 
          to="/#hire-us" 
          @click.native.prevent="scrollToSection('hire-us')"
          class="border rounded-xl bg-purple-950 text-white"
        >Hire Us</RouterLink>
      </nav>
    </div>
  </section>
</template>
<script>
export default {
  methods: {
    scrollToSection(sectionId) {
      // Check if we're on the home page
      if (window.location.pathname === '/' || window.location.pathname === '') {
        // We're on the home page, scroll to the section
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // We're on another page, navigate to home with the hash
        window.location.href = '/#' + sectionId;
      }
    }
  }
};
</script>
<style lang="">
    
</style>