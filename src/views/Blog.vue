<template>

  <section class="container mx-auto px-4 py-28">
    <h1 class="text-4xl font-bold mb-8">Blog</h1>

    <section aria-label="Blog posts">
      <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 list-none p-0">
        <li v-for="post in posts" :key="slugify(post.title)" class="post-item">
          <article class="h-full relative">
            <router-link :to="'/blog/' + slugify(post.title)" class="block h-full bg-white rounded-lg shadow-2xl overflow-hidden 
              post-preview hover:shadow-lg transition-shadow p-8 
              focus-visible:outline-none focus-visible:ring-2 
              focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
              :aria-labelledby="`post-title-${slugify(post.title)}`">
              <h2 :id="`post-title-${slugify(post.title)}`" class="text-2xl font-bold mb-4">
                {{ post.title }}
              </h2>

              <p class="mb-4">{{ post.content.substring(0, 100) }}...</p>

              <footer class="text-gray-600 mt-auto">
                <time :datetime="formatDateISO(post.date)" class="mr-4">{{ formatDate(post.date) }}</time>
                <span><span class="sr-only">Reading time: </span>{{ post.readingTime }} min read</span>
              </footer>
            </router-link>
          </article>
          <button v-if="isAdmin" class="bg-red-600 text-white font-semibold px-4 py-2 rounded-md 
                hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-red-500 transition-colors" @click="handleDeletePost(post.title)"
            aria-label="Delete this post">
            Remove
          </button>
        </li>
      </ul>
          <Notification 
          v-model="showNotification"
           :message="notificationMessage"
           :type="notificationType"
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
import { getPosts, deletePost, auth } from '../config/firebase'
import { ref, onMounted } from 'vue'
import Notification from '../components/UI/Notification.vue';
// Helper function to create slugs from titles
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[\W_]+/g, '-') // Replace non-word characters with hyphens
    .replace(/\-+/g, '-') // Replace multiple hyphens with a single hyphen
    .replace(/^-+/, '') // Remove leading hyphens
    .replace(/-+$/, ''); // Remove trailing hyphens
};

export default {
  components: {
    Notification
  },
  setup() {
    const posts = ref([])
    const loading = ref(true)
    const isAdmin = ref(false)
    const showNotification = ref(false)
    const notificationMessage = ref('')
    const notificationType = ref('info')
    const notificationIcon = ref('')


    // Function to handle post deletion
    const handleDeletePost = async (title) => {
      try {
        await deletePost(title)
        // Remove the deleted post from the local array
        posts.value = posts.value.filter(post => post.title !== title)
        // Show success notification
        showNotify(`${title} deleted successfully`, 'success', 'check')
      } catch (error) {
        console.error('Error deleting post:', error)
        showNotify('Failed to delete post. Please try again.', 'error', 'exclamation-triangle')
      }
    }
    function showNotify(message, type = 'info', icon = '') {
      notificationMessage.value = message
      notificationType.value = type
      notificationIcon.value = icon
      showNotification.value = true
    }

    onMounted(async () => {
      try {
        posts.value = await getPosts()

        // Check if user is logged in
        auth.onAuthStateChanged(user => {
          isAdmin.value = !!user
        })
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        loading.value = false
      }
    })

    // Format date for display
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

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
      slugify,
      handleDeletePost,
      showNotify,
      showNotification,
      notificationMessage,
      notificationType,
      notificationIcon,

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
