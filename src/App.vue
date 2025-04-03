<template lang="">
  <main class="overflow-scroll md:overflow-visible pb-[50px] md:pb-0">
    <Menu></Menu> 
    <GoBackTop /> 
    <RouterView />
  </main>
</template>
<script>
import Menu from "./components/Menu.vue";
import GoBackTop from "./components/GoBackTop.vue";
export default {
  components: {
    Menu,
    GoBackTop,
  },
};
</script>

