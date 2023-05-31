<template lang="">
  <section>
    <nav
      :class="{ hidden: hideIt }"
      class="md:hidden bg-purple-900
       [&>*]:text-white [&>*]:text-sm
       flex justify-around items-center
       fixed bottom-0
       w-full h-10"
    >
      <a href="#">Home 🏠</a>
      <a href="#">My Work 🖥️</a>
      <a href="#">Hire me 🔈</a>
    </nav>
  </section>
</template>
<script>
export default {
  props: ["hideIt"],
};
</script>
<style lang=""></style>
