<template>
  <section v-if="relatedPosts.length > 0" class="related-posts mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
    <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"
       aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
      Related Articles
    </h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link 
  v-for="post in relatedPosts" 
  :key="post.id" 
  :to="`/blog/${titleToSlug(post.title)}`"
  class="block related-post-card"
  :aria-labelledby="`related-post-title-${post.id}`"
>
      <article>
        <div class="card-content">
          <h3 :id="`related-post-title-${post.id}`" class="card-title">
            {{ post.title }}
          </h3>
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
import { useRouter } from 'vue-router';
import { formatDate, titleToSlug } from '@/utils/helpers';

const props = defineProps({
  currentPostId: {
    type: String,
    required: true
  },
  currentPostTitle: {
    type: String,
    required: true
  },
  currentPostContent: {
    type: String,
    required: true
  },
  allPosts: {
    type: Array,
    required: true
  }
});

const router = useRouter();

// Format date for machine-readable datetime attribute
const formatDateISO = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

// Navigate to a post when clicked
const navigateToPost = (title) => {
  router.push('/blog/' + titleToSlug(title));
};

// Find related posts based on content similarity
const relatedPosts = computed(() => {
  if (!props.allPosts || props.allPosts.length === 0) return [];
  
  // Filter out the current post
  const otherPosts = props.allPosts.filter(post => post.id !== props.currentPostId);
  
  // Extract keywords from current post (simple implementation)
  const currentPostKeywords = extractKeywords(props.currentPostTitle, props.currentPostContent);
 
  // Score other posts based on keyword matches
  const scoredPosts = otherPosts.map(post => {
    const postKeywords = extractKeywords(post.title, post.content);
    const score = calculateSimilarityScore(currentPostKeywords, postKeywords);
    return { ...post, score };
  });
  
  // Sort by score (highest first) and take top 3
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
});

// Extract keywords from title and content
function extractKeywords(title, content) {
  // Combine title and content, giving title more weight
  const text = `${title} ${title} ${content}`.toLowerCase();
  
  // Remove common stop words and punctuation
  const stopWords = ['the', 'and', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'of', 'is', 'are', 'was', 'were'];
  
  const words = text
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(/\s+/) // Split by whitespace
    .filter(word => word.length > 2 && !stopWords.includes(word)); // Filter out stop words and short words
  
  // Count word frequencies
  const wordCounts = {};
  words.forEach(word => {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });
  
  return wordCounts;
}

// Calculate similarity score between two keyword sets
function calculateSimilarityScore(keywords1, keywords2) {
  let score = 0;
  
  // For each keyword in the current post
  Object.keys(keywords1).forEach(keyword => {
    // If the other post also has this keyword
    if (keywords2[keyword]) {
      // Add to score based on frequency in both posts
      score += keywords1[keyword] * keywords2[keyword];
    }
  });
  
  return score;
}
</script>

<style scoped>
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
  color: #94a3b8;
  border-color: #334155;
}
</style>
