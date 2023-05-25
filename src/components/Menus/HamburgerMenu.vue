<template lang="">
      <section 
      :class="{hidden: hideIt}"
        class="rounded-xl border-purple-700">
        <section
          @click="toggleHamburgerMenu"
          :class="{ hidden: isHamburgerVisible }"
          class="absolute right-10 flex flex-col md:hidden 
           before:content-[''] before:bg-black
           before:w-6 before:h-1 before:rounded
           before:-translate-x-0 before:-translate-y-2 bg-black
           w-6 h-1 rounded translate-x-1 -translate-y-6
           after:content-[''] after:rounded after:bg-black
           after:w-6 after:h-1 after:-translate-x-0 after:translate-y-2"
        ></section>
        <section
          @click="toggleHamburgerMenu"
          :class="{ hidden: !isHamburgerVisible}"
          class="absolute right-7 top-5   md:hidden  w-8 h-1
           rounded bg-white rotate-45 before:flex
           before:rounded before:content-['']
           before:w-8 before:h-1 before:bg-black
           before:-rotate-90"
        ></section>        
      </section>
      
</template>
<script>
export default {
    props: ['hideIt'],
    data(){
        return{
            isHamburgerVisible:false,
        }
    },
    methods: {
    toggleHamburgerMenu() {
      this.isHamburgerVisible = !this.isHamburgerVisible;
      this.$emit('hamburger-changed', this.isHamburgerVisible)
    },
  },
    
}
</script>
<style lang="">
    
</style>