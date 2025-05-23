<template>
  <div class="manage-posts">
    <Notification v-model="showNotification" :type="notificationType" :message="notificationMessage" />
    <h2 class="main-title">Manage Blog Posts</h2>

    <LoadingOverlay 
      v-if="loading"
      :isLoading="loading" 
      :message="'Loading posts...'" 
      :subMessage="'Please wait while we retrieve your posts'">
      
      <template #sr-text>
        Post editor is currently loading data from the database. 
        This may take a few seconds depending on your connection speed.
      </template>
    </LoadingOverlay>

    <div v-if="posts.length === 0" class="no-posts">
      <p>No blog posts found.</p>
      <router-link to="/admin/new-post" class="create-post-link">Create your first post</router-link>
    </div>

    <ul v-else class="posts-list">
      <li v-for="post in posts" :key="post.id" class="post-item">
        <div class="post-details">
          <h3>{{ post.title }}</h3>
          <p class="post-date">{{ formatDate(post.date) }}</p>
          <p class="post-excerpt">{{ truncateContent(post.content) }}</p>
        </div>
        <div class="post-actions">
          <button @click="editPost(post.id)" @keydown.enter="editPost(post.id)" class="edit-button"
            aria-label="Edit post">
            Edit
          </button>
          <button @click="confirmDelete(post.title)" @keydown.enter="confirmDelete(post.title)" class="delete-button"
            aria-label="Delete post">
            Delete
          </button>
        </div>
      </li>
    </ul>

    <!-- Confirmation Modal -->
    <div v-if="showDeleteModal" class="delete-modal">
      <div class="modal-content" role="dialog" aria-labelledby="delete-modal-title">
        <h3 id="delete-modal-title">Confirm Deletion</h3>
        <p>Are you sure you want to delete this post? This action cannot be undone.</p>
        <div class="modal-actions">
          <button @click="cancelDelete" class="cancel-button" aria-label="Cancel deletion">
            Cancel
          </button>
          <button @click="removePost" class="confirm-delete-button" aria-label="Confirm delete post">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getPosts, deletePost } from '@/config/firebase';
import Notification from '../UI/Notification.vue';
import LoadingOverlay from '../UI/LoadingOverlay.vue';

const router = useRouter();
const posts = ref([]);
const loading = ref(true);
const showDeleteModal = ref(false);
const postToDelete = ref(null);

const route = useRoute();


const showNotification = ref(false);
const notificationType = ref('');
const notificationMessage = ref('');

// Watcher with explicit immediate flag
watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.notify === 'already-logged-in') {
      showNotification.value = true;
      notificationType.value = newQuery.type || 'info';
      notificationMessage.value = 'You are already logged in as an admin.';


      setTimeout(() => {
        showNotification.value = false;

        // Remove only notification params without triggering full navigation
        if (route.query.notify) {
          // This creates a new object (cleanQuery) with all properties from route.query except notify and type.
          const { notify, type, ...cleanQuery } = route.query;
          router.replace({ query: cleanQuery }, { shallow: true });
        }
      }, 1000);
    }
  },
  { immediate: true } // Force immediate check of current value
);

// Fetch all blog posts
const fetchPosts = async () => {
  loading.value = true;


  try {
    const fetchedPosts = await getPosts();
    posts.value = fetchedPosts;
    posts.value.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first
  } catch (err) {
    console.error('Error fetching posts:', err);
    showNotification.value = true;
    notificationType.value = 'error';
    notificationMessage.value = 'Failed to load blog posts. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Format date for display
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Truncate content for preview
const truncateContent = (content) => {
  if (!content) return '';
  // Strip markdown syntax for cleaner preview
  const plainText = content.replace(/[#*_~`]/g, '');
  return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
};

// Navigate to edit page
const editPost = (postId) => {
  router.push(`/admin/edit-post/${postId}`);
};

// Show delete confirmation
const confirmDelete = (postId) => {
  postToDelete.value = postId;
  showDeleteModal.value = true;
};

// Cancel delete
const cancelDelete = () => {
  showDeleteModal.value = false;
  postToDelete.value = null;
};

// Delete post
const removePost = async () => {
  if (!postToDelete.value) return;
  console.log('Deleting post:', postToDelete.value);
  try {
    await deletePost(postToDelete.value);
    // Remove the deleted post from the local array
    posts.value = posts.value.filter(post => post.title !== postToDelete.value);
    showDeleteModal.value = false;
    postToDelete.value = null;
  } catch (err) {
    console.error('Error deleting post:', err);
    showNotification.value = true;
    notificationType.value = 'error';
    notificationMessage.value = 'Failed to delete post. Please try again.';
  }
};

// Fetch posts when component mounts
onMounted(fetchPosts);
</script>

<style scoped>
.manage-posts {
  position: relative;
  top: 6rem;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

@media (max-width: 768px) {
  .manage-posts {
    top: 7rem;
    /* Reduced top margin to match compact header */
    padding: 1rem;
    /* Standard padding */
  }
}

.main-title {
  font-size: clamp(1.5rem, 5vw, 2.25rem);
  font-weight: 700;
  color: #4c1d95;
  /* Purple to match your brand color */
  margin-bottom: clamp(1rem, 3vw, 1.5rem);
  padding-bottom: clamp(0.3rem, 1vw, 0.5rem);
  border-bottom: 3px solid #4c1d95;
  letter-spacing: -0.025em;
}

h2 {
  margin-bottom: 2rem;
  color: #2d3748;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.error-message {
  background-color: #fed7d7;
  border-left: 4px solid #e53e3e;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 0.25rem;
}

.retry-button {
  background-color: #4c1d95;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  margin-top: 0.5rem;
}

.no-posts {
  text-align: center;
  padding: 2rem;
  background-color: #f7fafc;
  border-radius: 0.25rem;
}

.create-post-link {
  display: inline-block;
  background-color: #4c1d95;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  margin-top: 1rem;
  text-decoration: none;
}

.posts-list {
  list-style: none;
  padding: 0;
}

.post-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.25rem;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1.25rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s ease;
}

.post-item:hover {
  background-color: #f7fafc;
}

.post-details {
  flex: 1;
}

.post-details h3 {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
  font-size: clamp(1.125rem, 3vw, 1.5rem);
  font-weight: 600;
  letter-spacing: -0.025em;
}

.post-date {
  color: #4a5568;
  /* Darker gray for better contrast */
  font-size: clamp(0.875rem, 2vw, 1rem);
  font-weight: 500;
  /* Slightly bolder for better readability */
  margin-bottom: clamp(0.3rem, 2vw, 0.5rem);
  display: inline-block;
}

.post-excerpt {
  color: #4a5568;
  font-size: clamp(0.9375rem, 2.5vw, 1.125rem);
  line-height: 1.5;
  margin-top: 0.5rem;
}

.post-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-button,
.delete-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.edit-button {
  background-color: #4c1d95;
  color: white;
}

.edit-button:focus-visible {
  outline: 3px solid #ffffff;
  outline-offset: 0.5rem;
  box-shadow: 0 0 0 5px rgba(76, 29, 149, 0.7);
  position: relative;
  z-index: 1;
}

.delete-button {
  background-color: #b91c1c;
  /* Darker red for better contrast with white text */
  color: white;
  font-weight: 500;
  /* Slightly bolder text for better readability */
}

.delete-button:focus-visible {
  outline: 3px solid #ffffff;
  outline-offset: 0.5rem;
  box-shadow: 0 0 0 5px rgba(185, 28, 28, 0.7);
  /* Match the new darker red */
  position: relative;
  z-index: 1;
}

/* Button focus styles */
.cancel-button:focus-visible {
  outline: 3px solid #000000;
  outline-offset: 0.5rem;
  box-shadow: 0 0 0 5px rgba(74, 85, 104, 0.5);
  position: relative;
  z-index: 1;
}

.confirm-delete-button:focus-visible {
  outline: 3px solid #ffffff;
  outline-offset: 0.5rem;
  box-shadow: 0 0 0 5px rgba(185, 28, 28, 0.7);
  /* Match the new darker red */
  position: relative;
  z-index: 1;
}

/* Modal styles */
.delete-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  max-width: 500px;
  width: 90%;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-button {
  background-color: #e2e8f0;
  color: #4a5568;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.confirm-delete-button {
  background-color: #e53e3e;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

@media (max-width: 640px) {
  .post-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .post-actions {
    margin-top: 1rem;
    width: 100%;
  }

  .edit-button,
  .delete-button {
    flex: 1;
  }
}
</style>
