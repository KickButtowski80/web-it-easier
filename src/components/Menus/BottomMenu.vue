<template lang="">
  <footer class="fixed bottom-0 w-full z-50">
    <nav
      :class="{ hidden: hideIt }"
      class="md:hidden bg-purple-900
       [&>*]:text-white [&>*]:text-sm    
       flex justify-evenly items-center
       h-full py-2"
    >
      <RouterLink :to="{ name: 'Home'  }">Home 🏠</RouterLink>
      <RouterLink :to="{ name: 'Blog' }">Blog 📝</RouterLink>
      <RouterLink :to="{ name: 'Home', hash: '#our-works' }">Our Works 🖥️</RouterLink>
      <RouterLink :to="{ name: 'Home', hash: '#hire-us' }" class="border p-2 rounded-xl bg-purple-950 text-white">Hire Us 🔈</RouterLink>
    </nav>
  </footer>
</template>
<script>
export default {
  props: ["hideIt"],
};
</script>
