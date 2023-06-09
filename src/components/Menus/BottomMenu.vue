<template lang="">
  <footer class="fixed bottom-0 w-full z-50">
    <nav
      :class="{ hidden: hideIt }"
      class="md:hidden bg-purple-900
       [&>*]:text-white [&>*]:text-sm    
       flex justify-evenly items-center
       h-10"
    >
      <a href="#">Home 🏠</a>
      <a href="#">My Work 🖥️</a>
      <a href="#">Hire me 🔈</a>
    </nav>
  </footer>
</template>
<script>
export default {
  props: ["hideIt"],
};
</script>
<style lang=""></style>
