<template>
  <section
    class="grid place-items-center min-h-screen1 bg-[url('/layered-steps-haikei-bg.svg')] bg-cover bg-center h-full w-full"
  >
    <header class="text-center mb-20 mt-10">
      <div id="hire-us" aria-label="Hire Us Section"></div>
      <h1 class="font-bold py-6 text-3xl">Hire Us</h1>
    </header>
    <article
      class="relative md:left-9 grid grid-cols-1 md:grid-cols-2 max-w-sm md:max-w-xl lg:max-w-3xl p-6 mb-16 md:mb-8 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 glass"
    >
      <div class="col-span-1"></div>
      <section class="">
        <h2 class="text-center font-semibold text-2xl text-blue-700">
          The place to make your dream a reality
        </h2>
        <p class="font-normal text-gray-900 pb-32">
          Here are the biggest enterprise technology acquisitions of 2024 so
          far, in reverse chronological order.
        </p>
      </section>
      <aside
        id="hire-us-info"
        class="max-w-sm bg-purple-400 p-6 rounded-xl md:absolute relative bottom-[-20%] md:bottom-9 md:-left-28 min-h-full text-blue-700"
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea facere
        quaerat ipsam soluta reprehenderit, nesciunt quos nobis suscipit
        consequatur sit voluptas maiores ab tenetur illum obcaecati, dolor nulla
        provident fuga!
      </aside>
    </article>
  </section>
</template>
<style scoped lang="css">
.glass {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* For Safari */
  background-color: rgba(255, 255, 255, 0.3); /* Adjust the transparency */
  border-radius: 1rem; /* Rounded corners */
  padding: 1.5rem; /* Padding */
  color: #fff; /* Text color */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Optional: Add a subtle shadow */
}
</style>
