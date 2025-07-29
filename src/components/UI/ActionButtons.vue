<!-- ActionButtons.vue -->
<template>
    <div class="gray-bg-card mb-2">
        <div class="px-3 py-4 flex gap-2 justify-center">
            <a
              class="inline-flex items-center justify-center gap-1.5 select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none text-xs py-3 px-6 rounded-lg bg-blue-600 text-white shadow-md hover:shadow-lg hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 focus-visible:ring-offset-white"
              type="button"
              :href="liveView"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`Live Demo of ${projectTitle} (opens in new tab)`"
            >
              <span aria-hidden="true">🚀</span>
              <span>Live Demo</span>
            </a>
            
            <a
              :class="[
                privateRepo
                  ? 'bg-gray-300 text-gray-800 cursor-not-allowed focus-visible:ring-gray-400'  
                  : 'bg-green-600 text-white hover:shadow-lg hover:bg-green-700 focus-visible:ring-green-500',
              ]"
              class="inline-flex items-center justify-center gap-1.5 select-none font-sans font-bold text-center uppercase transition-all
               disabled:opacity-50 disabled:shadow-none text-xs py-3 px-6 rounded-lg shadow-md focus:outline-none
               focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              type="button"
              :href="privateRepo ? '#' : codeView"
              target="_blank"
              rel="noopener noreferrer"
              :tabindex="privateRepo ? -1 : 0"
              :aria-disabled="privateRepo ? 'true' : 'false'"
              :aria-label="`${privateRepo ? 'Private' : 'Code View'} of ${projectTitle}${privateRepo ? '' : ' (opens in new tab)'}`"
              @click="privateRepo ? $event.preventDefault() : null"
            >
              <span v-if="privateRepo" aria-hidden="true">🔒</span>
              <span v-else aria-hidden="true">💻</span>
              <span>{{ privateRepo ? 'Private' : 'Code View' }}</span>
            </a>
          </div>
    </div>
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
