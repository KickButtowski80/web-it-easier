<template lang="">
    <section>
        <nav 
          :class="{hidden: hideIt}"
          class="md:hidden bg-purple-900 [&>*]:text-white flex justify-around
                    fixed w-full bottom-0 h-10">
          <a href="#">Home 🏠</a>
          <a href="#">My Work 🖥️</a>
          <a href="#">Hire me 🔈</a>
        </nav>
    </section>
</template>
<script>
export default {
    props: ['hideIt']

}
</script>
<style lang="">
    
</style>