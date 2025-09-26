<template>
  <div v-if="tags && tags.length > 0" class="mt-8">
    <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-600 dark:text-indigo-400" 
      fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
      </svg>
      Tags
    </h3>

    <div class="flex flex-wrap gap-3">
      <RouterLink
        v-for="tag in tags"
        :key="tag"
        :to="`/blog/posts/${encodeURIComponent(tag.toLowerCase())}`"
        class="group relative inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        :class="getTagClasses(tag)"
        :aria-label="`View all posts tagged with ${tag}`"
      >
        <!-- Subtle gradient overlay -->
        <div class="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
             :class="getTagGradient(tag)"></div>

        <!-- Tag content -->
        <span class="relative z-10 flex items-center gap-2">
          <!-- Tag icon -->
          <svg class="h-3 w-3 transition-transform duration-200 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
          </svg>

          <!-- Tag text -->
          <span class="font-medium">{{ tag }}</span>
        </span>

        <!-- Subtle glow effect -->
        <div class="absolute inset-0 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-300 blur-sm"
             :class="getTagGlow(tag)"></div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  tags: {
    type: Array,
    default: () => []
  }
})

// Generate different styles for tags based on their content
const getTagClasses = (tag) => {
  const tagLower = tag.toLowerCase()
  const index = tag.length % 8

  const colorSchemes = [
    // 0: Indigo/Purple
    'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 dark:from-indigo-900/40 dark:to-purple-900/40 dark:text-indigo-200',
    // 1: Blue/Cyan
    'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 dark:from-blue-900/40 dark:to-cyan-900/40 dark:text-blue-200',
    // 2: Green/Teal
    'bg-gradient-to-r from-green-100 to-teal-100 text-green-800 dark:from-green-900/40 dark:to-teal-900/40 dark:text-green-200',
    // 3: Yellow/Orange
    'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 dark:from-yellow-900/40 dark:to-orange-900/40 dark:text-yellow-200',
    // 4: Pink/Rose
    'bg-gradient-to-r from-pink-100 to-rose-100 text-pink-800 dark:from-pink-900/40 dark:to-rose-900/40 dark:text-pink-200',
    // 5: Purple/Violet
    'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 dark:from-purple-900/40 dark:to-violet-900/40 dark:text-purple-200',
    // 6: Teal/Emerald
    'bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-800 dark:from-teal-900/40 dark:to-emerald-900/40 dark:text-teal-200',
    // 7: Orange/Amber
    'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 dark:from-orange-900/40 dark:to-amber-900/40 dark:text-orange-200'
  ]

  return colorSchemes[index]
}

const getTagGradient = (tag) => {
  const index = tag.length % 6

  const gradients = [
    'bg-gradient-to-r from-indigo-200/30 to-purple-200/30 dark:from-indigo-500/20 dark:to-purple-500/20',
    'bg-gradient-to-r from-blue-200/30 to-cyan-200/30 dark:from-blue-500/20 dark:to-cyan-500/20',
    'bg-gradient-to-r from-green-200/30 to-teal-200/30 dark:from-green-500/20 dark:to-teal-500/20',
    'bg-gradient-to-r from-pink-200/30 to-rose-200/30 dark:from-pink-500/20 dark:to-rose-500/20',
    'bg-gradient-to-r from-purple-200/30 to-violet-200/30 dark:from-purple-500/20 dark:to-violet-500/20',
    'bg-gradient-to-r from-teal-200/30 to-emerald-200/30 dark:from-teal-500/20 dark:to-emerald-500/20'
  ]

  return gradients[index]
}

const getTagGlow = (tag) => {
  const index = tag.length % 6

  const glows = [
    'bg-indigo-400/20',
    'bg-blue-400/20',
    'bg-green-400/20',
    'bg-pink-400/20',
    'bg-purple-400/20',
    'bg-teal-400/20'
  ]

  return glows[index]
}
</script>


<style scoped>
/* Additional animations for the tags */
@keyframes tagPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes tagGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
  50% { box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3); }
}

/* Smooth entrance animation for tags */
.category-tags-enter-active,
.category-tags-leave-active {
  transition: all 0.3s ease;
}

.category-tags-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.category-tags-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
