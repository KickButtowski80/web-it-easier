<template>

  <section class="container mx-auto px-4 py-28">
    <div class="relative mb-20 text-center overflow-visible">
      <div
        class="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      </div>

      <div class="inline-block relative group">
        <h1 class="text-5xl md:text-7xl font-extrabold mb-6 relative z-10 text-gray-900 dark:text-white">
          <span class="relative inline-block">
            <span class="relative z-10">{{ currentTag ? `#${currentTag}` : 'Blog' }}</span>
            <span
              class="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 -z-0 transform -rotate-1 translate-y-1 group-hover:translate-y-2 transition-all duration-300"></span>
          </span>
        </h1>
      </div>

      <div
        class="max-w-2xl mx-auto relative
                before:absolute before:left-0 before:top-1/2 before:w-8 before:h-px before:bg-gradient-to-r before:from-transparent before:to-gray-300 dark:before:to-gray-600
                after:absolute after:right-0 after:top-1/2 after:w-8 after:h-px after:bg-gradient-to-l after:from-transparent after:to-gray-300 dark:after:to-gray-600">
        <p class="text-gray-500 dark:text-gray-400 font-medium px-10">
          <span class="inline-block transform group-hover:translate-y-1 transition-transform duration-300">
            {{ currentTag ? `Posts tagged with "${currentTag}"` : 'Explore my latest articles and insights' }}
          </span>
        </p>
      </div>

      <div
        class="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-indigo-300 dark:via-indigo-600 to-transparent group-hover:w-48 transition-all duration-500">
      </div>
    </div>

    <!-- Blog Navigation Links -->
    <nav aria-label="Blog navigation" class="blog-navigation mb-10 flex justify-center content-center  gap-4">
      <RouterLink v-if="currentTag" to="/blog" class="nav-link">
        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Show All
      </RouterLink>
      <RouterLink to="/blog/archive" class="nav-link">
        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        Browse Archive
      </RouterLink>
    </nav>

    <section aria-label="Blog posts" class="isolate">
      <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 list-none p-0">
        <li v-for="(post, i) in filteredPosts" :key="titleToSlug(post.title) + '-' + i" class="blog-card-container">
          <article class="blog-card" :aria-labelledby="`post-title-${titleToSlug(post.title)}-${i}`"
            :aria-describedby="`post-desc-${titleToSlug(post.title)}-${i}`">

            <time v-if="post.updatedAt" class="updated-at" :datetime="formatDateISO(post.updatedAt)">
              <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" class="updated-at__icon">
                <path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                  fill="none" d="M12 6v6l3 1.5m6-1.5a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="updated-at__label">
                Updated {{ relativeTime(post.updatedAt) }}
              </span>
            </time>
            <RouterLink :to="'/blog/' + titleToSlug(post.title)" class="card-link">
              <div class="card-content">
                <h2 :id="`post-title-${titleToSlug(post.title)}-${i}`" class="card-title">
                  {{ post.title }}
                </h2>
                <div :id="`post-desc-${titleToSlug(post.title)}-${i}`" class="card-body"
                  v-html="renderMarkdown(generateExcerpt(post.content))"></div>
                <div class="card-footer">
                  <div class="card-meta">
                    <time :datetime="formatDateISO(post.date)" class="mr-4">{{ formatDate(post.date) }}</time>
                    <span aria-hidden="true">•</span>
                    <span class="sr-only">Reading time: </span>
                    <span>{{ post.readingTime }} min read</span>
                    <span class="sr-only">. Click to read full article.</span>
                  </div>

                  <!-- Tags section - show all tags -->
                  <div v-if="post.tags && post.tags.length > 0" class="card-tags-line">
                    <span class="sr-only">Tags ({{ post.tags.length }} total): </span>
                    <RouterLink v-for="tag in post.tags" :key="tag"
                      :to="`/blog/posts/${encodeURIComponent(tag.toLowerCase())}`" class="tag-link"
                      :aria-label="`View all posts tagged with ${tag}`" @click.stop>
                      {{ tag }}
                    </RouterLink>
                  </div>
                </div>
              </div>
            </RouterLink>
          </article>
        </li>
      </ul>
      <Notification v-model="showNotification" :message="notificationMessage" :type="notificationType"
        :icon="notificationIcon" />
    </section>

    <div v-if="loading" class="text-center py-12" aria-live="polite">
      <p>Loading blog posts...</p>
    </div>

    <div v-if="!loading && filteredPosts.length === 0" class="text-center py-12" aria-live="polite">
      <p>{{ currentTag ? `No posts found tagged with "${currentTag}".` : 'No blog posts found. Check back soon!' }}</p>
    </div>
  </section>
</template>

<script>
import { formatDate, formatDateISO, titleToSlug, relativeTime } from '../utils/helpers';
import { getPosts, auth } from '../config/firebase';
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
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
  props: {
    tag: {
      type: String,
      default: null
    }
  },
  setup(props) {
    const posts = ref([])
    const loading = ref(true)
    const isAdmin = ref(false)
    const route = useRoute()

    // Get current tag from props or route
    const currentTag = computed(() => {
      return props.tag || route.params.tag || null
    })

    // Filter posts by tag
    const filteredPosts = computed(() => {
      if (!currentTag.value) return posts.value

      return posts.value.filter(post => {
        if (!post.tags || !Array.isArray(post.tags)) return false
        return post.tags.some(tag =>
          tag.toLowerCase() === currentTag.value.toLowerCase()
        )
      })
    })

    const generateExcerpt = (markdown, wordLimit = 22) => {
      if (!markdown) return '';

      const tokens = markdown.trim().split(/\s+/);
      if (!tokens.length) return '';

      const excerptTokens = [];
      let wordCount = 0;
      let boldBalance = 0;
      let italicBalance = 0;
      let codeBalance = 0;

      const updateBalances = token => {
        const boldMatches = token.match(/\*\*/g);
        if (boldMatches) boldBalance = (boldBalance + boldMatches.length) % 2;
        //  Assert that the character immediately before our current spot is NOT an asterisk. ?< before 
        //  Assert that the character immediately after our current spot is NOT an asterisk. ? after 
        const italicMatches = token.match(/(?<!\*)\*(?!\*)/g);
        if (italicMatches) italicBalance = (italicBalance + italicMatches.length) % 2;

        const underscoreMatches = token.match(/__/g);
        if (underscoreMatches) italicBalance = (italicBalance + underscoreMatches.length) % 2;

        const codeMatches = token.match(/`/g);
        if (codeMatches) codeBalance = (codeBalance + codeMatches.length) % 2;
      };

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        excerptTokens.push(token);
        wordCount += 1;
        updateBalances(token);

        const reachedLimit = wordCount >= wordLimit;
        const markersBalanced = boldBalance === 0 && italicBalance === 0 && codeBalance === 0;

        if (reachedLimit && markersBalanced) {
          break;
        }
      }

      let excerpt = excerptTokens.join(' ');
      const hasMore = excerptTokens.length < tokens.length;

      if (boldBalance !== 0) excerpt += '**';
      if (italicBalance !== 0) excerpt += '*';
      if (codeBalance !== 0) excerpt += '`';

      if (hasMore) {
        if (!excerpt.endsWith('**') && !excerpt.endsWith('*') && !excerpt.endsWith('`')) {
          excerpt += '…';
        } else {
          excerpt += ' …';
        }
      }
      if (excerpt.startsWith('>')) {
        excerpt = `${excerpt.replace(/^>\s*/, '> ')}\n`;
      }
      return excerpt;
    };

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
      showNotification,
      filteredPosts,
      currentTag,
      relativeTime,
      generateExcerpt
    };
  }
};
</script>

<style scoped>
@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
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
  font-weight: 400;
  /* Slightly lighter in dark mode for better readability */
}

/* Ensure proper spacing for touch targets */
@media (pointer: coarse) {
  .blog-card {
    min-height: 300px;
    padding: 2rem;
  }

  .card-body {
    font-size: 1.1rem;
    /* Slightly larger on touch devices */
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
  padding: 1rem 1.25rem;
  background: linear-gradient(120deg, rgba(99, 102, 241, 0.06), rgba(129, 140, 248, 0.04));
  border-left: 3px solid rgba(99, 102, 241, 0.35);
  border-radius: 14px;
  box-shadow: inset 0 0 0 1px rgba(99, 102, 241, 0.08);
  transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.blog-card:hover .card-body,
.blog-card:focus .card-body {
  border-color: rgba(99, 102, 241, 0.55);
  box-shadow: inset 0 0 0 1px rgba(99, 102, 241, 0.14);
}

.dark .card-body {
  color: #cbd5e1;
  background: linear-gradient(120deg, rgba(79, 70, 229, 0.14), rgba(129, 140, 248, 0.08));
  border-left: 3px solid rgba(165, 180, 252, 0.45);
  box-shadow: inset 0 0 0 1px rgba(129, 140, 248, 0.12);
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
  border-top: 1px dashed #e2e8f0;
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.dark .card-footer {
  color: #94a3b8;
  border-color: #334155;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* Tag styling in blog cards - now on separate line */
.card-tags-line {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag-link {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  background-color: rgba(99, 102, 241, 0.1);
  color: #4f46e5;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.tag-link:hover {
  background-color: rgba(99, 102, 241, 0.15);
  transform: translateY(-1px);
  color: #3730a3;
}

.tag-link:focus {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
}

/* Dark mode tag styles */
.dark .tag-link {
  background-color: rgba(99, 102, 241, 0.15);
  color: #818cf8;
  border-color: rgba(129, 140, 248, 0.3);
}

.dark .tag-link:hover {
  background-color: rgba(99, 102, 241, 0.25);
  color: #6366f1;
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

/* Blog Navigation Links */
.blog-navigation {
  margin-top: 1rem;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  min-width: 140px;
  height: 48px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
  color: #4f46e5;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  border: 2px solid rgba(99, 102, 241, 0.2);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.nav-link:hover,
.nav-link:focus {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
  border-color: rgba(99, 102, 241, 0.4);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px -4px rgba(99, 102, 241, 0.25), 0 4px 8px -2px rgba(99, 102, 241, 0.15);
  color: #3730a3;
}

.nav-link:focus-visible {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
}

.dark .nav-link {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15));
  color: #818cf8;
  border-color: rgba(129, 140, 248, 0.3);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.dark .nav-link:hover,
.dark .nav-link:focus {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(139, 92, 246, 0.25));
  border-color: rgba(129, 140, 248, 0.4);
  color: #6366f1;
}

.updated-at {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 1rem;
  font-weight: 600;
  color: #4f46e5;
  background: rgba(99, 102, 241, 0.12);
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  letter-spacing: 0.01em;
}

.updated-at__icon {
  width: 0.9rem;
  height: 0.9rem;
}

.updated-at__label {
  display: inline-block;
}

.dark .updated-at {
  color: #c7d2fe;
  background: rgba(129, 140, 248, 0.22);
}
</style>
