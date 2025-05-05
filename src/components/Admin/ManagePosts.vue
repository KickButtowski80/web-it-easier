<template>
  <div class="manage-posts">
    <h2>Manage Blog Posts</h2>
    
    <div v-if="loading" class="loading-container">
      <AdminLoadingSpinner />
    </div>
    
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="fetchPosts" class="retry-button">Try Again</button>
    </div>
    
    <div v-else-if="posts.length === 0" class="no-posts">
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
          <button 
            @click="editPost(post.id)" 
            class="edit-button"
            aria-label="Edit post"
          >
            Edit
          </button>
          <button 
            @click="confirmDelete(post.id)" 
            class="delete-button"
            aria-label="Delete post"
          >
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
          <button 
            @click="cancelDelete" 
            class="cancel-button"
          >
            Cancel
          </button>
          <button 
            @click="deletePost" 
            class="confirm-delete-button"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getPosts, deletePost} from '@/config/firebase';

import AdminLoadingSpinner from '../UI/AdminLoadingSpinner.vue';

const router = useRouter();
const posts = ref([]);
const loading = ref(true);
const error = ref(null);
const showDeleteModal = ref(false);
const postToDelete = ref(null);

// Fetch all blog posts
const fetchPosts = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const fetchedPosts = await getPosts();
    posts.value = fetchedPosts;
    posts.value.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first
    console.log('Posts loaded:', posts.value);
  } catch (err) {
    console.error('Error fetching posts:', err);
    error.value = 'Failed to load blog posts. Please try again.';
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
  
  try {
    await deletePost(postToDelete.value);
    // Remove the deleted post from the local array
    posts.value = posts.value.filter(post => post.id !== postToDelete.value);
    showDeleteModal.value = false;
    postToDelete.value = null;
  } catch (err) {
    console.error('Error deleting post:', err);
    error.value = 'Failed to delete post. Please try again.';
  }
};

// Fetch posts when component mounts
onMounted(fetchPosts);
</script>

<style scoped>
.manage-posts {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
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
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1rem;
}

.post-details {
  flex: 1;
}

.post-details h3 {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
}

.post-date {
  color: #718096;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.post-excerpt {
  color: #4a5568;
  font-size: 0.875rem;
  line-height: 1.4;
}

.post-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-button, .delete-button {
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

.delete-button {
  background-color: #e53e3e;
  color: white;
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
  
  .edit-button, .delete-button {
    flex: 1;
  }
}
</style>
