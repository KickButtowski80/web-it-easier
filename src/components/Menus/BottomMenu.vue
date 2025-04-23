<template lang="">
  <footer class="fixed bottom-0 w-full z-50">
    <nav
      :class="{ hidden: hideIt }"
      class="md:hidden bg-purple-900
       [&>*]:text-white [&>*]:text-sm    
       flex justify-evenly items-center
       h-10"
    >
      <RouterLink to="/">Home 🏠</RouterLink>
      <RouterLink to="/blog">Blog 📝</RouterLink>
      <RouterLink 
        to="/#our-works" 
        @click.native.prevent="scrollToSection('our-works')"
      >Our Works 🖥️</RouterLink>
      <RouterLink 
        to="/#hire-us" 
        @click.native.prevent="scrollToSection('hire-us')"
      >Hire Us 🔈</RouterLink>
    </nav>
  </footer>
</template>
<script>
export default {
  props: ["hideIt"],
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
<style lang=""></style>
