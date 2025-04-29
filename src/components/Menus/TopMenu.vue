<template>
  <section class="bg-purple-400 fixed top-0 
  w-full z-50 h-navbar-height md:h-md-navbar-height">
    <div class="p-2 flex md:justify-between md:items-center">
      <span class="text-xl font-semibold md:text-5xl"> IT 🚪 </span>
      <nav
        class="hidden md:[&>*]:pr-5 md:[&>*]:text-2xl md:[&>*]:p-5
         md:[&>*]:font-semibold md:flex md:justify-between md:items-center
         "
        aria-label="main"
      >
        <RouterLink :to="{ name: 'Home'  }">Home</RouterLink>
        <RouterLink :to="{ name: 'Blog' }">Blog</RouterLink>
        <RouterLink :to="{ name: 'Home', hash: '#our-works' }">Our Works</RouterLink>
        <RouterLink :to="{ name: 'Home', hash: '#hire-us' }" class="border rounded-xl bg-purple-950 text-white">Hire Us</RouterLink>
      </nav>
    </div>
  </section>
</template>
