<template>

  <div v-if="isLoading" class="loading-overlay fixed inset-0 bg-white/90 
    dark:bg-gray-900/90 flex flex-col items-center 
    justify-center z-50 transition-opacity duration-300
    perspective-[1000px]" 
    role="status" aria-live="assertive" aria-atomic="true" aria-busy="true">
    <div class="w-72 h-72 border border-purple-800 rounded-md  
   flex flex-col items-center justify-center 
    backdrop-blur-sm bg-white/50 dark:bg-gray-900/50">
      <!-- Animated Door (hidden from screen readers since it's decorative) -->
      <div class="door-container relative w-24 h-32 mb-6" aria-hidden="true">
        <!-- Door Frame -->
        <div class="absolute inset-0 border-4 border-purple-800 rounded-md">
          <!-- Door Panel -->
          <div class="door-panel absolute inset-0.5 bg-purple-50 dark:bg-purple-900/30 rounded-sm overflow-hidden">
            <!-- Wood Grain Effect -->
            <div class="absolute inset-0 opacity-20">
              <div v-for="i in 8" :key="i" 
                   class="absolute w-full h-[2px] bg-purple-600" 
                   :class="`top-[${i * 15}%]`">
              </div>
            </div>
            <!-- Opening Door Effect with Knob -->
            <div
              class="door-open absolute inset-0 bg-purple-100/50 dark:bg-purple-900/50 rounded-sm
               origin-left transition-transform transition-opacity transition-colors duration-1000 ease-in-out transform-gpu will-change-transform">
              <!-- Door Knob -->
              <div class="absolute right-1 top-1/2 w-2 h-2 bg-purple-400 rounded-full transform
               -translate-y-1/2 shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>

      <p id="loading-message" class="text-purple-900 dark:text-purple-200 font-medium text-lg">
        <slot>{{ message }}</slot>
      </p>
      <p v-if="subMessage" id="loading-submessage" class="text-purple-800/70 dark:text-purple-300/80 text-sm mt-2">
        {{ subMessage }}
      </p>
      <!-- Screen reader only text for better context -->
      <span class="sr-only">
        <slot name="sr-text">{{ message }} {{ subMessage }}</slot>
      </span>
    </div>
  </div>
</template>

<script setup>


defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: 'Please wait while content is loading...'
  },
  subMessage: {
    type: String,
    default: 'Just a moment please'
  }
});
</script>

<style scoped>
.loading-overlay {
  backdrop-filter: blur(3px);
}

.door-container {
  transform-style: preserve-3d;
}

.door-panel {
  transition: transform 0.5s ease-in-out;
  transform-origin: left;
  box-shadow: 0 0 15px rgba(124, 58, 237, 0.2);
}

.door-open {
  animation: doorOpen 2s ease-in-out infinite alternate;
  transform-origin: left;
  opacity: 0.7;
  width: 100%;
  height: 100%;
}

@keyframes doorOpen {
  0% {
    transform: rotateY(0deg);
    opacity: 0.3;
    background-color: rgba(196, 181, 253, 0.5);
  }

  100% {
    transform: perspective(200px) rotateY(40deg) translateX(-0.25rem);
    opacity: 0.8;
    background-color: rgba(147, 51, 234, 0.7);
  }
}

/* Optimized transitions */
.door-panel {
  transition: background-color 0.3s ease, transform 0.5s ease-in-out;
}
</style>
