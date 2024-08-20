<template lang="">
  <main class="overflow-scroll md:overflow-visible pb-[50px] md:pb-0">
    <Menu></Menu>
    <Hero />
    <GoBackTop />
    <Works  />
    <Contact />
  </main>
</template>
<script>
import Menu from "./components/Menu.vue";
import Hero from "./views/Hero.vue";
import Works from "./views/Works.vue";
import Contact from "./views/HireUs.vue";
import GoBackTop from "./components/GoBackTop.vue";
export default {
  components: {
    Menu,
    Hero,
    Works,
    Contact,
    GoBackTop,
  },
};
</script>
<style lang=""></style>
