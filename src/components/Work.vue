<template>
  <div class="max-w-sm rounded overflow-hidden shadow-lg">
    <img
      class="w-full"
      src="https://v1.tailwindcss.com/img/card-top.jpg"
      alt="Sunset in the mountains"
    />
    <div class="px-3 py-2">
      <div class="font-bold text-xl mb-2">Project Title</div>

      <p class="text-black text-base">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus
        quia, nulla! Maiores et perferendis eaque, exercitationem praesentium
        nihil.
      </p>
    </div>
    <div class="px-3 pt-4 pb-2">
      <span
        class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
        >#javascript</span
      >
      <span
        class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
        >#tailwindcss</span
      >
      <span
        class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
        >#html</span
      >
      <p class="text-gray-900 leading-none">Role: Developer</p>
      <p class="text-gray-600">Completed: January 2024</p>
    </div>
    <div class="px-3 py-2 flex gap-2">
      <a
        class="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
        type="button"
      >
        live view
      </a>
      <a
        class="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
        type="button"
      >
        code view
      </a>
    </div>
  </div>
</template>
