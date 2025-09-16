<template>
  <nav class="gray-bg-card mb-2" aria-label="Project actions">
    <ul class="px-3 py-4 flex flex-wrap gap-2 justify-center list-none m-0 p-0">
      <li v-if="liveView">
        <a
          class="inline-flex items-center justify-center gap-1.5 select-none font-sans font-bold text-center uppercase transition-colors transition-shadow duration-200 text-xs py-3 px-6 rounded-lg bg-blue-600 text-white shadow-md hover:shadow-lg hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 focus-visible:ring-offset-white"
          :href="liveView"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="`Live Demo of ${projectTitle} (opens in new tab)`"
        >
          <span aria-hidden="true">🚀</span>
          <span>Live Demo</span>
        </a>
      </li>
      
      <li>
        <a
          v-if="!privateRepo"
          class="inline-flex items-center justify-center gap-1.5 select-none font-sans font-bold text-center uppercase transition-colors transition-shadow duration-200 text-xs py-3 px-6 rounded-lg shadow-md bg-green-600 text-white hover:shadow-lg hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 focus-visible:ring-offset-white"
          :href="codeView"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="`View source code for ${projectTitle} (opens in new tab)`"
        >
          <span aria-hidden="true">💻</span>
          <span>Code View</span>
        </a>
        <button
          v-else
          class="inline-flex items-center justify-center gap-1.5 select-none font-sans font-bold text-center uppercase transition-colors transition-shadow duration-200 text-xs py-3 px-6 rounded-lg shadow-md bg-gray-300 text-gray-800 cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400 focus-visible:ring-offset-white"
          disabled
          aria-label="Source code is private"
        >
          <span aria-hidden="true">🔒</span>
          <span>Private</span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
    props: {
        privateRepo: Boolean,
        codeView: String,
        liveView: String,
        projectTitle: String,
    },
}
</script>
