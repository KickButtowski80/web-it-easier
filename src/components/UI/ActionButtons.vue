<!-- ActionButtons.vue -->
<template>
    <div class="gray-bg-card mb-2">
        <div class="px-3 py-4 flex gap-2 justify-center">
            <a
              class="inline-block align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none text-xs py-3 px-6 rounded-lg bg-blue-600 text-white shadow-md hover:shadow-lg hover:bg-blue-700 focus:opacity-85 focus:shadow-none active:opacity-85 active:shadow-none"
              type="button"
              :href="liveView"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Live View of {{ projectTitle }}"
            >
              Live View
            </a>
            <!-- Hidden link for crawlers -->
          <a
            v-if="!privateRepo"
            :href="codeView"
            class="hidden"
            aria-hidden="true"
            rel="noopener noreferrer"
            aria-label="Code View of {{ projectTitle }}"
          >
            Code View
          </a>
            <a
              :class="[
                privateRepo
                  ? 'bg-gray-400 text-gray-300'
                  : 'bg-green-600 text-white hover:shadow-lg hover:bg-green-700',
              ]"
              class="inline-block align-middle select-none font-sans font-bold text-center uppercase transition-all
               disabled:opacity-50 disabled:shadow-none text-xs py-3 px-6 rounded-lg shadow-md focus:opacity-85
               focus:shadow-none active:opacity-85 active:shadow-none"
              type="button"
              :href="privateRepo ? '#' : codeView"
              target="_blank"
              rel="noopener noreferrer"
              :tabindex="privateRepo ? -1 : 0"
              :aria-disabled="privateRepo ? 'true' : 'false'"
              aria-label="Code View of {{ projectTitle }}"
              @click="privateRepo ? $event.preventDefault() : null"
            >
              Code View
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
