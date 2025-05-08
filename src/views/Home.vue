<template>
  <section
  id="home"
  class="overflow-scroll md:overflow-visible pb-[50px] md:pb-0">
    <Hero />
    <Works />
    <Contact />
  </section>
</template>

<script>
import Hero from '../views/Hero.vue'
import Works from '../views/Works.vue'
import Contact from '../views/HireUs.vue'

export default {
  components: {
    Hero,
    Works,
    Contact
  }
}
</script>
