<template>
  <div v-if="categories.length > 0" class="category-tags">
    <h3 class="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
      </svg>
      Categories
    </h3>
    
    <div class="flex flex-wrap gap-2">
      <RouterLink 
        v-for="category in categories" 
        :key="category"
        :to="{ path: '/blog', query: { search: category.toLowerCase() } }"
        class="category-tag"
        :aria-label="`Search for posts about: ${category}`"
      >
        {{ category }}
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { titleToSlug } from '@/utils/helpers';

const props = defineProps({
  content: {
    type: String,
    required: true
  }
});

// Extract categories from content using a simple pattern matching approach
// This looks for common category indicators in the content
const categories = computed(() => {
  if (!props.content) return [];
  
  // Common category keywords to look for
  const categoryKeywords = [
    'javascript', 'vue', 'react', 'angular', 'svelte', 'frontend', 'backend',
    'node', 'express', 'mongodb', 'sql', 'database', 'api', 'rest', 'graphql',
    'css', 'html', 'web design', 'ui', 'ux', 'accessibility', 'a11y',
    'performance', 'seo', 'security', 'testing', 'devops', 'ci/cd',
    'docker', 'kubernetes', 'aws', 'cloud', 'serverless', 'jamstack',
    'static site', 'headless cms', 'wordpress', 'php', 'laravel', 'python',
    'django', 'flask', 'ruby', 'rails', 'go', 'rust', 'typescript',
    'mobile', 'responsive', 'pwa', 'web components', 'webassembly', 'wasm'
  ];
  
  // Find matches in the content
  const matches = [];
  const contentLower = props.content.toLowerCase();
  
  categoryKeywords.forEach(keyword => {
    if (contentLower.includes(keyword.toLowerCase())) {
      // Capitalize first letter of each word
      const formattedKeyword = keyword.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      matches.push(formattedKeyword);
    }
  });
  
  // Return unique categories, limited to 5 max
  return [...new Set(matches)].slice(0, 5);
});

// Helper function to create URL-friendly slugs
const slugify = (text) => {
  return titleToSlug(text);
};
</script>

<style scoped>
.category-tags {
  margin: 1.5rem 0;
}

.category-tag {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  background-color: rgba(99, 102, 241, 0.1);
  color: #4f46e5;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
  text-decoration: none;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.category-tag:hover,
.category-tag:focus {
  background-color: rgba(99, 102, 241, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.category-tag:focus-visible {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
}

.dark .category-tag {
  background-color: rgba(99, 102, 241, 0.15);
  color: #818cf8;
  border-color: rgba(129, 140, 248, 0.3);
}

.dark .category-tag:hover,
.dark .category-tag:focus {
  background-color: rgba(99, 102, 241, 0.25);
}
</style>
