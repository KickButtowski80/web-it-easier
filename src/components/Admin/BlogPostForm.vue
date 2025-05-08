<template>
  <section class="admin-form">    
    <h1 id="form-heading">New Blog Post</h1>    
    <form @submit.prevent="handleSubmit" aria-labelledby="form-heading">
      <div class="form-group">
        <label for="title">Title</label>
        <input 
          id="title" 
          v-model="formData.title" 
          type="text" 
          placeholder="Enter post title" 
          required
          :aria-invalid="formErrors.title ? 'true' : 'false'"
          autocomplete="off"
        >
        <div v-if="formErrors.title" class="error-message" role="alert">{{ formErrors.title }}</div>
      </div>

      <div class="form-group">
        <label for="date">Date</label>
        <input 
          id="date" 
          v-model="formData.date" 
          type="date" 
          required
          :aria-invalid="formErrors.date ? 'true' : 'false'"
        >
        <div v-if="formErrors.date" class="error-message" role="alert">{{ formErrors.date }}</div>
      </div>

      <div class="form-group">
        <label for="readingTime">Reading Time (minutes)</label>
        <input 
          id="readingTime" 
          v-model.number="formData.readingTime" 
          type="number" 
          min="1" 
          required
          :aria-invalid="formErrors.readingTime ? 'true' : 'false'"
          aria-describedby="readingTimeHint"
        >
        <div id="readingTimeHint" class="hint">Estimated time to read this article in minutes</div>
        <div v-if="formErrors.readingTime" class="error-message" role="alert">{{ formErrors.readingTime }}</div>
      </div>

      <div class="form-group">
        <label for="featureImage">Feature Image URL</label>
        <input 
          id="featureImage" 
          v-model="formData.featureImage" 
          type="url" 
          placeholder="Enter image URL"
          :aria-invalid="formErrors.featureImage ? 'true' : 'false'"
        >
        <div v-if="formErrors.featureImage" class="error-message" role="alert">{{ formErrors.featureImage }}</div>
      </div>

      <div class="form-group">
        <label for="content">Content (Markdown)</label>
        <div class="markdown-editor" role="group" aria-labelledby="markdown-editor-label">
          <span id="markdown-editor-label" class="sr-only">Markdown editor with preview</span>
          <textarea 
            id="content" 
            v-model="formData.content" 
            placeholder="Write your post content in markdown..."
            required
            :aria-invalid="formErrors.content ? 'true' : 'false'"
            aria-describedby="markdownHint"
            rows="10"
          ></textarea>
          <div id="markdownHint" class="hint">Use markdown syntax for formatting. Preview appears on the right.</div>
          <div v-if="formErrors.content" class="error-message" role="alert">{{ formErrors.content }}</div>
          
          <section class="preview-container" aria-live="polite">
          <h2 id="preview-heading">Preview</h2>
          <article 
            v-html="previewContent" 
            class="preview-content"
            tabindex="0"
          ></article>
        </section>
        </div>
      </div>

      <button 
        type="submit"
        class="submit-btn"
        :disabled="isSubmitting"
        :aria-busy="isSubmitting"
      >
        {{ isSubmitting ? 'Publishing...' : 'Publish Post' }}
      </button>
    </form>
    
    <Notification 
      v-model="showNotification" 
      :message="notificationMessage" 
      :type="notificationType" 
      :icon="notificationIcon"
    />
  </section>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
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

// Form validation state
const formErrors = ref({
  title: '',
  date: '',
  readingTime: '',
  featureImage: '',
  content: ''
})

const isSubmitting = ref(false)
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref('info')
const notificationIcon = ref('')

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
  if (!auth.currentUser) {
    router.push('/login')
  }
  
  // Set initial focus to the title field
  nextTick(() => {
    document.getElementById('title')?.focus()
  })
})

const logout = async () => {
  try {
    await signOut(auth)
    router.push('/login')
  } catch (e) {
    console.error('Error signing out:', e)
    showNotify('Failed to log out. Please try again.', 'error')
  }
}

function showNotify(message, type = 'info', icon = '') {
  notificationMessage.value = message
  notificationType.value = type
  notificationIcon.value = icon
  showNotification.value = true
}

// Validate form fields
const validateForm = () => {
  let isValid = true
  
  // Reset all errors
  Object.keys(formErrors.value).forEach(key => {
    formErrors.value[key] = ''
  })
  
  // Title validation
  if (!formData.value.title.trim()) {
    formErrors.value.title = 'Please enter a title'
    isValid = false
  }
  
  // Date validation
  if (!formData.value.date) {
    formErrors.value.date = 'Please select a date'
    isValid = false
  }
  
  // Reading time validation
  if (!formData.value.readingTime || formData.value.readingTime < 1) {
    formErrors.value.readingTime = 'Reading time must be at least 1 minute'
    isValid = false
  }
  
  // Feature image URL validation (if provided)
  if (formData.value.featureImage && !isValidUrl(formData.value.featureImage)) {
    formErrors.value.featureImage = 'Please enter a valid URL'
    isValid = false
  }
  
  // Content validation
  if (!formData.value.content.trim()) {
    formErrors.value.content = 'Please enter content for your post'
    isValid = false
  }
  
  return isValid
}

// Helper to validate URLs
const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}

const handleSubmit = async () => {
  if (isSubmitting.value) return; // Prevent double submit
  isSubmitting.value = true
  // Validate form
  if (!validateForm()) {
    // Focus the first field with an error
    const firstErrorField = Object.keys(formErrors.value).find(key => formErrors.value[key])
    if (firstErrorField) {
      nextTick(() => {
        document.getElementById(firstErrorField)?.focus()
      })
    }
    return
  }
  
  try {
    // Add post to Firestore
    await addPost({
      ...formData.value,
      date: new Date(formData.value.date),
      createdAt: new Date(),
    })
    
    showNotify('Post published successfully!', 'success');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await router.push('/blog');
    // Reset form after successful submission
    formData.value = {
      title: '',
      date: new Date().toISOString().split('T')[0],
      readingTime: 5,
      featureImage: '',
      content: ''
    }
    

  } catch (error) {
    console.error('Error publishing post:', error)
    showNotify('Failed to publish post. Please use a unique title and try again.', 'error')
  } 
}
</script>

<style scoped>
.admin-form {
  position: relative;
  top: 10rem;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .admin-form {
    top: 9rem; /* Reduced top margin to match compact header */
    padding: 1rem; /* Standard padding */
    margin: 0 0.75rem; /* Slightly reduced side margins */
    border-radius: 8px;
  }
}

h1 {
  font-size: clamp(1.5rem, 5vw, 1.8rem);
  color: #4c1d95; /* Match the purple brand color */
  margin-bottom: clamp(1rem, 4vw, 1.5rem);
  text-align: center;
  font-weight: 700;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #4c1d95;
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



form {
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 3vw, 1.5rem);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 600;
  color: #4a5568;
  font-size: clamp(0.9rem, 2vw, 1rem);
}

input,
textarea {
  width: 100%;
  padding: clamp(0.6rem, 2vw, 0.8rem);
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: clamp(0.9rem, 2vw, 1rem);
  transition: border-color 0.2s;
}

input:focus-visible,
textarea:focus-visible {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.3);
}

input[aria-invalid="true"],
textarea[aria-invalid="true"] {
  border-color: #e53e3e;
  background-color: #fff5f5;
}

textarea {
  min-height: 200px;
  resize: vertical;
}

.submit-btn {
  padding: clamp(0.8rem, 3vw, 1rem);
  background-color: #4c1d95; /* Match the brand purple */
  color: white;
  border: none;
  border-radius: 6px;
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .submit-btn {
    margin-top: 1rem;
    padding: 1rem;
  }
}

.submit-btn:hover:not(:disabled) {
  background-color: #6b4fa8;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.submit-btn:focus-visible {
  outline: 3px solid #ffffff;
  outline-offset: 0.5rem;
  box-shadow: 0 0 0 5px rgba(76, 29, 149, 0.7);
  position: relative;
  z-index: 1;
}

.submit-btn:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
  opacity: 0.7;
}

.markdown-editor {
  display: grid;
  gap: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

@media (min-width: 768px) {
  .markdown-editor {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "editor preview"
      "hint hint"
      "error error";
  }
}

@media (max-width: 767px) {
  .markdown-editor {
    grid-template-columns: 1fr;
    grid-template-areas:
      "editor"
      "hint"
      "error"
      "preview";
  }
}

.preview-content {
  height: 300px;
  overflow-y: auto;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
}

.preview-content:focus {
  outline: 2px solid #7c5fbf;
  outline-offset: 2px;
}

.error-message {
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  font-weight: 500;
}

.hint {
  color: #2d3748;
  font-size: 0.95rem;
  margin-top: 0.25rem;
  font-weight: 500;
}

.preview-container {
  background: white;
  border-radius: 6px;
  padding: clamp(0.75rem, 2vw, 1rem);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .preview-container {
    margin-top: 1.5rem;
  }
}

.preview-container h2 {
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