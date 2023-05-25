<template lang="">
  <TopMenu />
  <HamburgerMenu :hideIt="true" />
  <BottomMenu :hideIt="false" />
</template>
<script>
import BottomMenu from "./Menus/BottomMenu.vue";
import HamburgerMenu from "./Menus/HamburgerMenu.vue";
import TopMenu from "./Menus/TopMenu.vue";
export default {
  components: {
    BottomMenu,
    HamburgerMenu,
    TopMenu,
  },
};
</script>
<style lang=""></style>
