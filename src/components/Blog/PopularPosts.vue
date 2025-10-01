<template>
  <aside class="popular-posts bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
    <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
      Popular Articles
    </h2>
    
    <ul class="space-y-4">
      <li v-for="post in popularPosts" :key="post.id" class="popular-post-item">
        <a 
          :href="`/blog/${titleToSlug(post.title)}`"
          class="popular-post-link"
          :aria-label="`Read article: ${post.title}`"
        >
          <span class="post-title">{{ post.title }}</span>
          <span class="post-meta">{{ formatDate(post.date) }}</span>
        </a>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { formatDate, titleToSlug } from '@/utils/helpers';
import { findPopularPosts } from '@/utils/related-posts';

const props = defineProps({
  currentPostId: {
    type: String,
    required: false,
    default: null
  },
  allPosts: {
    type: Array,
    required: true
  },
  limit: {
    type: Number,
    default: 5
  }
});

// Get popular posts, excluding current post if provided
const popularPosts = computed(() => {
  const posts = findPopularPosts(props.allPosts, props.limit);
  
  // If we have a current post ID, make sure it's not in the popular posts
  if (props.currentPostId) {
    return posts.filter(post => post.id !== props.currentPostId);
  }
  
  return posts;
});
</script>

<style scoped>
.popular-posts {
  border-left: 4px solid #6366f1;
}

.popular-post-item {
  position: relative;
  transition: transform 0.2s ease;
}

.popular-post-item::before {
  content: '';
  position: absolute;
  left: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 0;
  background: linear-gradient(to bottom, #6366f1, #8b5cf6);
  transition: height 0.2s ease;
  opacity: 0;
}

.popular-post-item:hover {
  transform: translateX(4px);
}

.popular-post-item:hover::before {
  height: 80%;
  opacity: 1;
}

.popular-post-link {
  display: flex;
  flex-direction: column;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background-color: rgba(99, 102, 241, 0.05);
  transition: all 0.2s ease;
  text-decoration: none;
}

.popular-post-link:hover, 
.popular-post-link:focus {
  background-color: rgba(99, 102, 241, 0.1);
  outline: none;
}

.popular-post-link:focus-visible {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}

.post-title {
  font-weight: 600;
  color: #1e40af;
  font-size: 0.95rem;
  line-height: 1.4;
  margin-bottom: 0.25rem;
}

.post-meta {
  font-size: 0.8rem;
  color: #64748b;
}

.dark .popular-post-link {
  background-color: rgba(99, 102, 241, 0.1);
}

.dark .popular-post-link:hover,
.dark .popular-post-link:focus {
  background-color: rgba(99, 102, 241, 0.15);
}

.dark .post-title {
  color: #93c5fd;
}

.dark .post-meta {
  color: #94a3b8;
}
</style>
