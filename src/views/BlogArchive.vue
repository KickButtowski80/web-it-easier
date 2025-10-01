<template>
  <section class="container mx-auto px-4 py-24">
    <div class="max-w-4xl mx-auto">
      <div class="relative mb-16 text-center overflow-visible">
        <div class="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div class="inline-block relative group">
          <h1 class="text-5xl md:text-7xl font-extrabold mb-6 relative z-10 text-gray-900 dark:text-white">
            <span class="relative inline-block">
              <span class="relative z-10">Blog Archive</span>
              <span class="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 -z-0 transform -rotate-1 translate-y-1 group-hover:translate-y-2 transition-all duration-300"></span>
            </span>
          </h1>
        </div>
        
        <div class="max-w-2xl mx-auto relative
              before:absolute before:left-0 before:top-1/2 before:w-8 before:h-px before:bg-gradient-to-r before:from-transparent before:to-gray-300 dark:before:to-gray-600
              after:absolute after:right-0 after:top-1/2 after:w-8 after:h-px after:bg-gradient-to-l after:from-transparent after:to-gray-300 dark:after:to-gray-600">
          <p class="text-gray-500 dark:text-gray-400 font-medium px-10">
            <span class="inline-block transform group-hover:translate-y-1 transition-transform duration-300">
              Browse all articles by year and month
            </span>
          </p>
        </div>
        
        <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-indigo-300 dark:via-indigo-600 to-transparent group-hover:w-48 transition-all duration-500"></div>
      </div>

      <!-- Archive Navigation -->
      <div class="archive-navigation mb-12">
        <div class="flex flex-wrap justify-center gap-4 mb-8">
          <button 
            v-for="year in availableYears" 
            :key="year"
            @click="selectedYear = year"
            class="year-button"
            :class="{ 'active': selectedYear === year }"
            :aria-pressed="selectedYear === year"
          >
            {{ year }}
          </button>
        </div>
        
        <div v-if="selectedYear" class="flex flex-wrap justify-center gap-3">
          <button 
            v-for="month in availableMonths" 
            :key="month.value"
            @click="selectedMonth = month.value"
            class="month-button"
            :class="{ 'active': selectedMonth === month.value }"
            :aria-pressed="selectedMonth === month.value"
          >
            {{ month.label }}
          </button>
        </div>
      </div>

      <!-- Posts List -->
      <div class="posts-list">
        <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          {{ selectedMonth ? getMonthName(selectedMonth) + ' ' : '' }}{{ selectedYear || 'All Posts' }}
        </h2>
        
        <div v-if="filteredPosts.length === 0" class="text-center py-12">
          <p class="text-gray-500 dark:text-gray-400">No posts found for this period.</p>
          <button @click="resetFilters" class="mt-4 text-indigo-600 dark:text-indigo-400 hover:underline">
            View all posts
          </button>
        </div>
        
        <ul v-else class="space-y-6">
          <li v-for="post in filteredPosts" :key="post.id" class="archive-post-item">
            <article>
              <RouterLink 
                :to="`/blog/${titleToSlug(post.title)}`" 
                class="archive-post-link"
              >
                <h3 class="archive-post-title">{{ post.title }}</h3>
                <div class="archive-post-meta">
                  <time :datetime="formatDateISO(post.date)">{{ formatDate(post.date) }}</time>
                  <span aria-hidden="true">•</span>
                  <span>{{ post.readingTime }} min read</span>
                </div>
                <p class="archive-post-excerpt" v-if="post.content">
                  {{ truncateContent(post.content) }}
                </p>
              </RouterLink>
            </article>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getPosts } from '@/config/firebase';
import { formatDate, titleToSlug } from '@/utils/helpers';

// State
const posts = ref([]);
const loading = ref(true);
const selectedYear = ref(null);
const selectedMonth = ref(null);

// Format date for machine-readable datetime attribute
const formatDateISO = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

// Get all available years from posts
const availableYears = computed(() => {
  if (!posts.value.length) return [];
  
  const years = posts.value.map(post => {
    const date = new Date(post.date);
    return date.getFullYear();
  });
  
  return [...new Set(years)].sort((a, b) => b - a); // Sort descending (newest first)
});

// Get available months for the selected year
const availableMonths = computed(() => {
  if (!selectedYear.value || !posts.value.length) return [];
  
  const months = posts.value
    .filter(post => {
      const date = new Date(post.date);
      return date.getFullYear() === selectedYear.value;
    })
    .map(post => {
      const date = new Date(post.date);
      return date.getMonth();
    });
  
  const uniqueMonths = [...new Set(months)].sort((a, b) => a - b);
  
  return uniqueMonths.map(month => ({
    value: month,
    label: new Date(2000, month, 1).toLocaleString('default', { month: 'short' })
  }));
});

// Filter posts based on selected year and month
const filteredPosts = computed(() => {
  if (!posts.value.length) return [];
  
  return posts.value
    .filter(post => {
      const date = new Date(post.date);
      
      if (selectedYear.value && selectedMonth.value !== null) {
        return date.getFullYear() === selectedYear.value && date.getMonth() === selectedMonth.value;
      }
      
      if (selectedYear.value) {
        return date.getFullYear() === selectedYear.value;
      }
      
      return true;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date (newest first)
});

// Helper to get month name
const getMonthName = (monthIndex) => {
  return new Date(2000, monthIndex, 1).toLocaleString('default', { month: 'long' });
};

// Reset filters
const resetFilters = () => {
  selectedYear.value = null;
  selectedMonth.value = null;
};

// Truncate content for excerpts
const truncateContent = (content) => {
  if (!content) return '';
  
  // Remove markdown formatting
  const plainText = content
    .replace(/#+\s+/g, '') // Remove headings
    .replace(/\*\*|__/g, '') // Remove bold
    .replace(/\*|_/g, '') // Remove italic
    .replace(/`{1,3}[\s\S]*?`{1,3}/g, '') // Remove code blocks
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1') // Replace links with just the text
    .replace(/\n/g, ' '); // Replace newlines with spaces
  
  // Limit to ~150 characters, avoiding cutting words
  if (plainText.length <= 150) return plainText;
  
  const truncated = plainText.substring(0, 150);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return truncated.substring(0, lastSpace) + '...';
};

// Fetch posts on component mount
onMounted(async () => {
  try {
    posts.value = await getPosts();
    
    // Set default year to most recent if posts exist
    if (availableYears.value.length > 0) {
      selectedYear.value = availableYears.value[0];
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.archive-navigation {
  border-bottom: 1px solid rgba(99, 102, 241, 0.2);
  padding-bottom: 1.5rem;
}

.year-button,
.month-button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
  background-color: rgba(99, 102, 241, 0.05);
  color: #4f46e5;
}

.year-button {
  font-size: 1.1rem;
}

.month-button {
  font-size: 0.9rem;
}

.year-button:hover,
.month-button:hover {
  background-color: rgba(99, 102, 241, 0.1);
  transform: translateY(-1px);
}

.year-button:focus-visible,
.month-button:focus-visible {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
}

.year-button.active,
.month-button.active {
  background-color: #4f46e5;
  color: white;
}

.archive-post-item {
  border-bottom: 1px solid rgba(99, 102, 241, 0.1);
  padding-bottom: 1.5rem;
  transition: transform 0.2s ease;
}

.archive-post-item:hover {
  transform: translateX(4px);
}

.archive-post-link {
  display: block;
  text-decoration: none;
  padding: 1rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease;
}

.archive-post-link:hover {
  background-color: rgba(99, 102, 241, 0.05);
}

.archive-post-link:focus-visible {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
}

.archive-post-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.archive-post-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 0.75rem;
}

.archive-post-excerpt {
  color: #475569;
  font-size: 1rem;
  line-height: 1.6;
}

.dark .year-button,
.dark .month-button {
  background-color: rgba(99, 102, 241, 0.1);
  color: #818cf8;
}

.dark .year-button:hover,
.dark .month-button:hover {
  background-color: rgba(99, 102, 241, 0.2);
}

.dark .year-button.active,
.dark .month-button.active {
  background-color: #6366f1;
  color: white;
}

.dark .archive-post-title {
  color: #93c5fd;
}

.dark .archive-post-meta {
  color: #94a3b8;
}

.dark .archive-post-excerpt {
  color: #cbd5e1;
}

.dark .archive-post-link:hover {
  background-color: rgba(99, 102, 241, 0.1);
}
</style>
