<template>

  <section class="container mx-auto px-4 py-28">
    <h1 class="text-4xl font-bold mb-8">Blog</h1>

    <section aria-label="Blog posts">
      <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 list-none p-0">
        <li v-for="post in posts" :key="titleToSlug(post.title)" class="post-item">
          <article class="h-full relative">
            <router-link :to="'/blog/' + titleToSlug(post.title)" class="block h-full bg-white rounded-lg shadow-2xl overflow-hidden 
              post-preview hover:shadow-lg transition-shadow p-8 
              focus-visible:outline-none focus-visible:ring-2 
              focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
              :aria-labelledby="`post-title-${titleToSlug(post.title)}`">
              <h2 :id="`post-title-${titleToSlug(post.title)}`" class="text-2xl font-bold mb-4">
                {{ post.title }}
              </h2>

              <div class="mb-4 prose max-w-none" v-html="renderMarkdown(post.content.substring(0, 100) + '...')"></div>

              <footer class="text-gray-600 mt-auto">
                <time :datetime="formatDateISO(post.date)" class="mr-4">{{ formatDate(post.date) }}</time>
                <span><span class="sr-only">Reading time: </span>{{ post.readingTime }} min read</span>
              </footer>
            </router-link>
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
import { getPosts, auth } from '../config/firebase'
import { ref, onMounted } from 'vue'
import Notification from '../components/UI/Notification.vue';
import { useNotification } from '../utils/helpers'
import { renderMarkdown } from '../utils/markdown';
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

        // Update canonical URL using the shared utility function
        updateCanonicalUrl();

      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        loading.value = false
      }
    })


    // Format date for machine-readable datetime attribute
    const formatDateISO = (date) => {
      return new Date(date).toISOString().split('T')[0];
    };

    return {
      posts,
      loading,
      isAdmin,
      formatDate,
      formatDateISO,
      titleToSlug,
      renderMarkdown,
      notificationMessage,
      notificationType,
      notificationIcon,
      showNotification
    };
  }
};
</script>

<style scoped>
/* Ensure focus styles are visible for keyboard navigation */

/* Ensure post items have equal height */
.post-item {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Improve contrast for text */
.text-gray-600 {
  color: #4b5563;
  /* Darker gray for better contrast */
}
</style>
