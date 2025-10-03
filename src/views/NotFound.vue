<template>
  <div class="not-found" role="main" aria-labelledby="notfound-title">
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <div class="not-found-content" tabindex="-1" ref="mainContent" id="main-content">
      <h1 id="notfound-title" class="sr-only">Page Not Found</h1>
      <div class="error-code" aria-hidden="true">404</div>
      <div role="status" aria-live="polite" class="sr-only">Page not found</div>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <p>It might have been moved or deleted, or you might have mistyped the URL.</p>
      <RouterLink :to="{ name: 'Home' }" class="home-link" aria-label="Return to home page">
        Return Home
      </RouterLink>
      
      <!-- Popular Blog Posts Section -->
      <div v-if="popularPosts.length > 0" class="popular-posts-section">
        <h2 class="popular-posts-title">Explore Popular Articles</h2>
        <ul class="popular-posts-list">
          <li v-for="post in popularPosts" :key="post.id" class="popular-post-item">
            <RouterLink 
              :to="`/blog/${titleToSlug(post.title)}`" 
              class="popular-post-link"
              :aria-label="`Read article: ${post.title}`"
            >
              <span class="post-title">{{ post.title }}</span>
              <span class="post-meta">{{ formatDate(post.date) }}</span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { getPosts } from '@/config/firebase';
import { formatDate, titleToSlug } from '@/utils/helpers';
import { findPopularPosts } from '@/utils/related-posts';
import { useRoute } from 'vue-router';

export default {
  name: "NotFound",
  setup() {
    const mainContent = ref(null);
    const popularPosts = ref([]);
    const route = useRoute();
    const abortController = typeof window !== 'undefined' ? new AbortController() : null;

    const notifyServer404 = async () => {
      if (typeof window === 'undefined') return;
      if (!abortController) return;

      const timeoutId = window.setTimeout(() => abortController.abort(), 4000);

      try {
        const apiUrl = new URL('/api/not-found', window.location.origin);
        if (route?.fullPath) {
          apiUrl.searchParams.set('path', route.fullPath);
        }

        await fetch(apiUrl.toString(), {
          method: 'GET',
          cache: 'no-store',
          signal: abortController.signal,
          headers: {
            'Accept': 'application/json'
          }
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Failed to notify server of 404 status:', error);
        }
      } finally {
        window.clearTimeout(timeoutId);
      }
    };

    onMounted(async () => {
      // Update page title
      document.title = 'Page Not Found | Web It Easier';

      notifyServer404();

      // Focus the main content for screen readers
      mainContent.value.focus();
      
      // Fetch blog posts for recommendations
      try {
        const posts = await getPosts();
        popularPosts.value = findPopularPosts(posts, 3); // Get top 3 popular posts
      } catch (error) {
        console.error('Error fetching posts for 404 page:', error);
      }
    });

    onBeforeUnmount(() => {
      abortController?.abort();
    });

    return {
      mainContent,
      popularPosts,
      formatDate,
      titleToSlug
    };
  }
};
</script>

<style scoped>
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #3b0764;
  color: white;
  padding: 8px;
  z-index: 100;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 0;
}



.not-found {
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(192, 132, 252, 0.8) 0%, rgba(224, 242, 254, 0.8) 50%, rgba(237, 233, 254, 0.8) 100%);
}

.not-found::before {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(45deg,
      rgba(215, 50, 198, 0.2) 0 2px,
      transparent 2px 20px);
  z-index: 1;
}

.not-found-content {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  color: #1e293b;
  outline: none;
}

.error-code {
  font-size: 6rem;
  font-weight: bold;
  line-height: 1;
  margin-bottom: 1rem;
  color: #3b0764;
}

.home-link {
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background-color: rgb(59, 7, 100);
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.2s, transform 0.2s;
  position: relative;
  z-index: 2;
}

.home-link:hover,
.home-link:focus {
  background-color: rgb(45, 5, 80);
  outline: 3px solid #ffe4a1;
  transform: translateY(-2px);
}

/* Popular Posts Section Styles */
.popular-posts-section {
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(99, 102, 241, 0.3);
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.popular-posts-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #3b0764;
}

.popular-posts-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.popular-post-item {
  position: relative;
  transition: transform 0.2s ease;
}

.popular-post-item::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
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
  background-color: rgba(99, 102, 241, 0.1);
  transition: all 0.2s ease;
  text-decoration: none;
}

.popular-post-link:hover, 
.popular-post-link:focus {
  background-color: rgba(99, 102, 241, 0.2);
  outline: 2px solid #6366f1;
  transform: none;
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
</style>
