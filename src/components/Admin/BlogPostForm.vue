<template>
  <div class="admin-form">
    <div class="admin-header">
      <div class="admin-actions">
        <button @click="logout" class="logout-btn">Logout</button>
      </div>
    </div>
      <h1>New Blog Post</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">Title</label>
        <input id="title" v-model="formData.title" type="text" placeholder="Enter post title" required>
      </div>

      <div class="form-group">
        <label for="date">Date</label>
        <input id="date" v-model="formData.date" type="date" required>
      </div>

      <div class="form-group">
        <label for="readingTime">Reading Time (minutes)</label>
        <input id="readingTime" v-model.number="formData.readingTime" type="number" min="1" required>
      </div>

      <div class="form-group">
        <label for="featureImage">Feature Image URL</label>
        <input id="featureImage" v-model="formData.featureImage" type="url" placeholder="Enter image URL">
      </div>

      <div class="form-group">
        <label for="content">Content (Markdown)</label>
        <div class="markdown-editor">
          <textarea 
            id="content" 
            v-model="formData.content" 
            placeholder="Write your post content in markdown..."
            required
          ></textarea>
          <div class="preview-container">
            <h3>Preview</h3>
            <div v-html="previewContent" class="preview-content"></div>
          </div>
        </div>
      </div>

      <button type="submit">Publish Post</button>
    </form>
    <Notification 
      v-model="showNotification" 
      :message="notificationMessage" 
      :type="notificationType" 
      :logo="notificationLogo"
    />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { addPost, signOut, auth } from '@/config/firebase'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import Notification from '@/components/UI/Notification.vue'

const router = useRouter()
const formData = ref({
  title: '',
  date: new Date().toISOString().split('T')[0],
  readingTime: 5,
  featureImage: '',
  content: ''
})

const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref('info')
const notificationLogo = ref('')

// Configure marked for syntax highlighting
marked.setOptions({
  gfm: true,
  breaks: true,
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(lang, code).value
    }
    return hljs.highlightAuto(code).value
  }
})

const previewContent = computed(() => {
  return marked.parse(formData.value.content || '')
})

// Check token expiration on component mount
onMounted(() => {
  if ( !auth.currentUser) {
    router.push('/login')
  }
})

const logout = async () => {
  try {
    const response = await signOut(auth)
    console.log(response)
    router.push('/login')
  } catch (e) {
    console.log(e)
  }
}

function showNotify(message, type = 'info', logo = '') {
  notificationMessage.value = message
  notificationType.value = type
  notificationLogo.value = logo
  showNotification.value = true
}

const handleSubmit = async () => {
  try {
    // Validate form data
    if (!formData.value.title.trim()) {
      showNotify('Please enter a title', 'error', '')
      return
    }

    if (!formData.value.content.trim()) {
      showNotify('Please enter content', 'error', '')
      return
    }

    // Add post to Firestore
    await addPost({
      ...formData.value,
      date: new Date(formData.value.date),
      createdAt: new Date(),
    })
    showNotify('Post published successfully!', 'success', '')
    // Redirect to blog page
    router.push('/blog')
  } catch (error) {
    console.error('Error publishing post:', error)
    showNotify('Failed to publish post. Pick up unique title, and Please, try again.', 'error', '')
  }
}
</script>

<style scoped>
.admin-form {
  
  max-width: 800px;
  margin: 4rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  

}

h1 {
  font-size: 1.8rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 600;
}

.admin-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-block: 2rem;
}

.admin-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.change-password-btn {
  background-color: #4299e1;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.2s;
}

.change-password-btn:hover {
  background-color: #3182ce;
}

.logout-btn {
  background-color: #f56565;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background-color: #e53e3e;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 500;
  color: #4a5568;
}

input,
textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
}

textarea {
  min-height: 200px;
  resize: vertical;
}

button {
  padding: 0.8rem;
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover {
  background-color: #3182ce;
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

.markdown-editor {
  display: grid;
  gap: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.preview-container {
  background: white;
  border-radius: 6px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.preview-container h3 {
  margin: 0 0 1rem 0;
  color: #4a5568;
  font-size: 1rem;
}

.preview-content {
  padding: 1rem;
  background: white;
  border-radius: 6px;
  line-height: 1.6;
  color: #2d3748;
}

.preview-content code {
  background: #f7fafc;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: 'Fira Code', monospace;
}

.preview-content pre {
  background: #f7fafc;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
}

.preview-content pre code {
  padding: 0;
  border: none;
  background: none;
}

@media (max-width: 640px) {
  .admin-form {
    margin: 1rem;
    padding: 1rem;
  }

  h1 {
    font-size: 1.5rem;
  }
}

@media (max-width: 768px) {
  .markdown-editor {
    grid-template-columns: 1fr;
  }
}
</style>