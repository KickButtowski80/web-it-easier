<template lang="">
  <main class="overflow-scroll md:overflow-visible pb-[50px] md:pb-0">
    <Menu></Menu> 
    <GoBackTop /> 
    <transition name="fade" mode="out-in">
      <RouterView />
    </transition>
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
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
