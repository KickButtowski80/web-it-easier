<template>

  <section class="container mx-auto px-4 py-28">
    <div class="relative mb-20 text-center overflow-visible">
      <div class="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div class="inline-block relative group">
        <h1 class="text-5xl md:text-7xl font-extrabold mb-6 relative z-10 text-gray-900 dark:text-white">
          <span class="relative inline-block">
            <span class="relative z-10">Blog</span>
            <span class="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 -z-0 transform -rotate-1 translate-y-1 group-hover:translate-y-2 transition-all duration-300"></span>
          </span>
        </h1>
      </div>
      
      <div class="max-w-2xl mx-auto relative
                before:absolute before:left-0 before:top-1/2 before:w-8 before:h-px before:bg-gradient-to-r before:from-transparent before:to-gray-300 dark:before:to-gray-600
                after:absolute after:right-0 after:top-1/2 after:w-8 after:h-px after:bg-gradient-to-l after:from-transparent after:to-gray-300 dark:after:to-gray-600">
        <p class="text-gray-500 dark:text-gray-400 font-medium px-10">
          <span class="inline-block transform group-hover:translate-y-1 transition-transform duration-300">
            Explore my latest articles and insights
          </span>
        </p>
      </div>
      
      <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-indigo-300 dark:via-indigo-600 to-transparent group-hover:w-48 transition-all duration-500"></div>
    </div>

    <section aria-label="Blog posts" class="isolate">
      <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 list-none p-0">
        <li v-for="(post, i) in posts" :key="titleToSlug(post.title) + '-' + i" class="blog-card-container">
          <article 
            class="blog-card"
            role="article"
            :aria-labelledby="`post-title-${titleToSlug(post.title)}-${i}`"
            :aria-describedby="`post-desc-${titleToSlug(post.title)}-${i}`"
            tabindex="0"
            @click="navigateToPost(post.title)"
            @keydown.enter="navigateToPost(post.title)"
            @keydown.space.prevent="navigateToPost(post.title)"
          >
            <div class="card-content">
              <h2 :id="`post-title-${titleToSlug(post.title)}-${i}`" class="card-title">
                {{ post.title }}
              </h2>
              <div :id="`post-desc-${titleToSlug(post.title)}-${i}`" class="card-body" v-html="renderMarkdown(post.content.substring(0, 100) + '...')"></div>
              <div class="card-footer">
                <time :datetime="formatDateISO(post.date)" class="mr-4">{{ formatDate(post.date) }}</time>
                <span aria-hidden="true">•</span>
                <span class="sr-only">Reading time: </span>
                <span>{{ post.readingTime }} min read</span>
                <span class="sr-only">. Click to read full article.</span>
              </div>
            </div>
          </article>
        </li>
      </ul>
      <Notification v-model="showNotification" :message="notificationMessage" :type="notificationType"
        :icon="notificationIcon" />
    </section>

    <div v-if="loading" class="text-center py-12" aria-live="polite">
      <p>Loading blog posts...</p>
    </div>

    <div v-if="!loading && posts.length === 0" class="text-center py-12" aria-live="polite">
      <p>No blog posts found. Check back soon!</p>
    </div>
  </section>
</template>

<script>
import { formatDate, titleToSlug } from '../utils/helpers';
import { getPosts, auth } from '../config/firebase';
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import Notification from '../components/UI/Notification.vue';
import { useNotification } from '../utils/helpers';
import { renderMarkdown } from '../utils/markdown';
import { updateCanonicalUrl } from '../utils/seo-update-canonical-url';
const {
  showNotification,
  notificationMessage,
  notificationType,
  notificationIcon,
  showNotify
} = useNotification();

export default {
  components: {
    Notification
  },
  setup() {
    const posts = ref([])
    const loading = ref(true)
    const isAdmin = ref(false)

    onMounted(async () => {
      try {
        posts.value = await getPosts()
        // Check if user is logged in
        auth.onAuthStateChanged(user => {
          isAdmin.value = !!user
        })

        // Wait for the next DOM update cycle
        await nextTick();
        
        try {
          console.log('Updating canonical URL for blog page...');
          const canonicalUrl = updateCanonicalUrl();
          console.log('Canonical URL set to:', canonicalUrl);
          
          // Verify the canonical tag was created/updated
          const canonicalTag = document.querySelector('link[rel="canonical"]');
          if (canonicalTag) {
            console.log('Canonical tag found in DOM:', {
              href: canonicalTag.href,
              outerHTML: canonicalTag.outerHTML
            });
          } else {
            console.warn('Warning: Canonical tag not found in DOM after update');
          }
        } catch (err) {
          console.error('Error updating canonical URL:', err);
        }

        // Set page title for SEO
        document.title = 'Blog | Web It Easier - Web Development Insights & Tips';

      } catch (error) {
        console.error('Error fetching posts:', error);
        showNotify('Failed to load blog posts. Please try again later.', 'error');
      } finally {
        loading.value = false;
      }
    })


    // Format date for machine-readable datetime attribute
    const formatDateISO = (date) => {
      return new Date(date).toISOString().split('T')[0];
    };

    const router = useRouter();
    const navigateToPost = (title) => {
      router.push('/blog/' + titleToSlug(title));
    };

    return {
      posts,
      loading,
      isAdmin,
      formatDate,
      formatDateISO,
      titleToSlug,
      renderMarkdown,
      navigateToPost,
      notificationMessage,
      notificationType,
      notificationIcon,
      showNotification
    };
  }
};
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.blog-card-container {
  contain: content;
  min-width: 0;
  perspective: 1000px;
}

.blog-card {
  width: 100%;
  text-align: left;
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 1.75rem;
  border: 2px solid #e2e8f0;
  cursor: pointer;
  color: #1e293b;
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.05);
  outline: none;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  will-change: transform, box-shadow;
}

.blog-card:focus-visible {
  outline: 3px solid #4f46e5;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.3);
}

.blog-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.blog-card:hover,
.blog-card:focus {
  transform: translateY(-4px);
  border-color: #6366f1;
  box-shadow: 0 12px 25px -5px rgba(99, 102, 241, 0.15), 
              0 8px 10px -6px rgba(99, 102, 241, 0.1),
              0 0 0 1px rgba(99, 102, 241, 0.1);
}

.blog-card:active {
  transform: translateY(-2px);
  box-shadow: 0 6px 10px -1px rgba(0, 0, 0, 0.1), 
              0 2px 5px -1px rgba(0, 0, 0, 0.06),
              inset 0 0 0 1px rgba(99, 102, 241, 0.1);
}

.blog-card:hover::before {
  transform: scaleX(1);
}

.dark .blog-card {
  background: linear-gradient(145deg, #1e293b, #0f172a);
  border-color: #475569;
  color: #f8fafc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
}

.dark .blog-card:focus-visible {
  outline-color: #818cf8;
  box-shadow: 0 0 0 4px rgba(129, 140, 248, 0.3);
}

.dark .blog-card:hover,
.dark .blog-card:focus {
  border-color: #818cf8;
  box-shadow: 0 15px 30px -5px rgba(99, 102, 241, 0.25), 
              0 10px 10px -5px rgba(99, 102, 241, 0.1),
              0 0 0 1px rgba(99, 102, 241, 0.1);
}

.dark .blog-card:active {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(129, 140, 248, 0.2), 0 2px 4px -1px rgba(129, 140, 248, 0.1);
}

.blog-card:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
}

.card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  z-index: 1;
  gap: 1rem;
}

/* Ensure sufficient color contrast */
.card-title {
  color: #1e40af;
}

.dark .card-title {
  color: #93c5fd;
}

.card-body {
  color: #334155;
  font-size: 1.05rem;
  line-height: 1.7;
  font-weight: 450;
  letter-spacing: 0.01em;
}

.dark .card-body {
  color: #e2e8f0;
  font-weight: 400; /* Slightly lighter in dark mode for better readability */
}

/* Ensure proper spacing for touch targets */
@media (pointer: coarse) {
  .blog-card {
    min-height: 300px;
    padding: 2rem;
  }
  
  .card-body {
    font-size: 1.1rem; /* Slightly larger on touch devices */
  }
  
  .card-content {
    gap: 1.25rem;
  }
}

.card-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.4;
  color: #1e40af;
  transition: color 0.2s ease;
}

.dark .card-title {
  color: #93c5fd;
}

.blog-card:hover .card-title {
  color: #4f46e5;
}

.dark .blog-card:hover .card-title {
  color: #a5b4fc;
}

.card-body {
  margin-bottom: 1.25rem;
  flex-grow: 1;
  color: #475569;
  font-size: 0.95rem;
  line-height: 1.7;
}

.dark .card-body {
  color: #cbd5e1;
}

.card-body :deep(*) {
  margin-top: 0;
  margin-bottom: 1rem;
  line-height: 1.7;
}

.card-body :deep(*:last-child) {
  margin-bottom: 0;
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
  padding-top: 1rem;
}

.dark .card-footer {
  color: #94a3b8;
  border-color: #334155;
}

/* Ensure proper spacing in dark mode */
.dark .prose {
  color: #e2e8f0;
}

.dark .prose :where(strong):not(:where([class~="not-prose"] *)) {
  color: #f8fafc;
}

.dark .prose :where(a):not(:where([class~="not-prose"] *)) {
  color: #818cf8;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.dark .prose :where(a:hover):not(:where([class~="not-prose"] *)) {
  color: #a5b4fc;
  text-decoration: underline;
}
</style>
