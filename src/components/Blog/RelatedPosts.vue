<template>
  <section v-if="relatedPosts.length > 0" class="related-posts mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
    <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center gap-2">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        class="h-6 w-6 text-indigo-600 dark:text-indigo-400" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
        aria-hidden="true"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" 
        />
      </svg>
      Related Articles
    </h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link 
        v-for="post in relatedPosts" 
        :key="post.id" 
        :to="`/blog/${titleToSlug(post.title)}`"
        class="related-post-card"
        :aria-labelledby="`related-post-title-${post.id}`"
      >

      <RelativeTimeBadge v-if="post.updatedAt" :post-updated-at="post.updatedAt" />
        <article class="h-full">
          <div class="card-content">
            <h3 :id="`related-post-title-${post.id}`" class="card-title">
              {{ post.title }}
            </h3>
            <p v-if="post.excerpt" class="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
              {{ post.excerpt }}
            </p>
            <div class="card-footer">
            <time :datetime="formatDateISO(post.date)" class="mr-4">{{ formatDate(post.date) }}</time>
            <span aria-hidden="true">•</span>
            <span class="sr-only">Reading time: </span>
            <span>{{ post.readingTime }} min read</span>
            </div>
          </div>
        </article>
      </router-link>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { TagNormalizer } from '@/utils/tagNormalizer';
import { formatDate, formatDateISO, titleToSlug } from '@/utils/helpers';
import RelativeTimeBadge from './RelativeTimeBadge.vue';

const props = defineProps({
  allPosts: {
    type: Array,
    required: true,
    default: () => []
  },
  currentPostId: {
    type: String,
    required: true
  },
  currentPostTitle: {
    type: String,
    default: ''
  },
  currentPostContent: {
    type: String,
    default: ''
  },
  currentPostTags: {
    type: Array,
    required: true
  }
});

// Initialize tag normalizer
const tagNormalizer = new TagNormalizer();

// Find related posts based on tag similarity
const relatedPosts = computed(() => {
  if (!props.allPosts?.length || !props.currentPostTags?.length) {
    return [];
  }

  // Filter out the current post
  const otherPosts = props.allPosts.filter(post => post.id !== props.currentPostId);
  
  // Normalize current post tags
  const normalizedCurrentTags = props.currentPostTags
    .map(tag => tagNormalizer.normalize(String(tag).toLowerCase()))
    .filter(Boolean);

  if (normalizedCurrentTags.length === 0) {
    return [];
  }

  // Score other posts based on tag matches
  const scoredPosts = otherPosts.map(post => {
    if (!post.tags?.length) {
      return { ...post, score: 0, matchingTags: [] };
    }

    // Normalize post tags
    const normalizedPostTags = post.tags
      .map(tag => tagNormalizer.normalize(String(tag).toLowerCase()))
      .filter(Boolean);

    // Count matching tags
    const matchingTags = normalizedPostTags.filter(tag => 
      normalizedCurrentTags.some(currentTag => 
        currentTag === tag || 
        currentTag.includes(tag) || 
        tag.includes(currentTag)
      )
    );

    return { 
      ...post, 
      score: matchingTags.length,
      matchingTags,
      date: post.date || new Date().toISOString() // Ensure date exists
    };
  });

  // Sort by score (highest first) and date (newest first)
  const sortedPosts = [...scoredPosts].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(b.date) - new Date(a.date);
  });

  // Take top 3 posts with matching tags, or most recent if no matches
  const topPosts = sortedPosts
    .filter(post => post.score > 0)
    .slice(0, 3);

  // Fallback to most recent posts if no matches
  if (topPosts.length === 0) {
    return otherPosts
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
  }

  return topPosts;
});


</script>

<style scoped>
.related-posts {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.related-post-card {
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 1.5rem;
  border: 2px solid #e2e8f0;
  cursor: pointer;
  color: #1e293b;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  outline: none;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.related-post-card:focus-visible {
  outline: 3px solid #4f46e5;
  outline-offset: 2px;
}

.related-post-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.related-post-card:hover,
.related-post-card:focus {
  transform: translateY(-4px);
  border-color: #6366f1;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.related-post-card:hover::before {
  transform: scaleX(1);
}

.card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1e40af;
  line-height: 1.4;
  transition: color 0.2s ease;
}

.dark .card-title {
  color: #93c5fd;
}

.related-post-card:hover .card-title {
  color: #1e40af;
}

.dark .related-post-card:hover .card-title {
  color: #3b82f6;
}

.card-footer {
  margin-top: auto;
  padding-top: 1rem;
  font-size: 0.85rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-top: 1px dashed #e2e8f0;
}

.dark .related-post-card {
  background: linear-gradient(145deg, #1e293b, #0f172a);
  border-color: #475569;
  color: #f8fafc;
}

.dark .card-title {
  color: #93c5fd;
}

.dark .card-footer {
  border-top-color: #334155;
  color: #9ca3af;
}

.related-post-card:hover .card-footer {
  color: #3b82f6;
}

.dark .related-post-card:hover .card-footer {
  color: #60a5fa;
}

/* Focus styles for keyboard navigation */
.related-post-card:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px #3b82f6;
  border-radius: 0.5rem;
}

/* Line clamp for excerpt */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
