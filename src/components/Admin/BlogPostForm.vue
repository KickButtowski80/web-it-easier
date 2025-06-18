<template>
  <section class="admin-form relative">
    <!-- Loading Overlay Component with custom screen reader text -->
    <LoadingOverlay :isLoading="isLoading" :fullPage="false" :message="'Loading post data...'"
      :subMessage="'Please wait while we retrieve your content'">
      <template #sr-text>
        Post editor is currently loading data from the database.
        This may take a few seconds depending on your connection speed.
      </template>
    </LoadingOverlay>

    <h1 id="form-heading">{{ isEditMode ? 'Edit Blog Post' : 'New Blog Post' }}</h1>
    <form @submit.prevent="handleSubmit" aria-labelledby="form-heading" :class="{ 'opacity-50': isLoading }"
      :aria-busy="isLoading">
      <div class="form-group">
        <label for="title">Title</label>
        <input id="title" v-model="formData.title" type="text" placeholder="Enter post title" required
          :aria-invalid="formErrors.title ? 'true' : 'false'" autocomplete="off">
        <div v-if="formErrors.title" class="error-message" role="alert">{{ formErrors.title }}</div>
      </div>

      <div class="form-group">
        <label for="date">Date</label>
        <input id="date" v-model="formData.date" type="date" required
          :aria-invalid="formErrors.date ? 'true' : 'false'">
        <div v-if="formErrors.date" class="error-message" role="alert">{{ formErrors.date }}</div>
      </div>

      <div class="form-group">
        <label for="readingTime">Reading Time (minutes)</label>
        <input id="readingTime" v-model.number="formData.readingTime" type="number" min="1" required
          :aria-invalid="formErrors.readingTime ? 'true' : 'false'" aria-describedby="readingTimeHint">
        <div id="readingTimeHint" class="hint">Estimated time to read this article in minutes</div>
        <div v-if="formErrors.readingTime" class="error-message" role="alert">{{ formErrors.readingTime }}</div>
      </div>

      <div class="form-group">
        <label for="featureImage">Feature Image URL</label>
        <input id="featureImage" v-model="formData.featureImage" type="url" placeholder="Enter image URL"
          :aria-invalid="formErrors.featureImage ? 'true' : 'false'">
        <div v-if="formErrors.featureImage" class="error-message" role="alert">{{ formErrors.featureImage }}</div>
      </div>

      <div class="form-group">
        <label for="content">Content (Markdown)</label>
        <div class="markdown-editor" role="group" aria-labelledby="markdown-editor-label">
          <span id="markdown-editor-label" class="sr-only">Markdown editor with preview</span>

          <!-- Tab Navigation -->
          <div class="markdown-tabs">
            <button type="button" @click="activeTab = 'edit'" :class="['tab-button', { active: activeTab === 'edit' }]"
              aria-controls="editor-panel" :aria-selected="activeTab === 'edit'">
              <span class="icon">✏️</span> Edit
            </button>
            <button type="button" @click="activeTab = 'preview'"
              :class="['tab-button', { active: activeTab === 'preview' }]" aria-controls="preview-panel"
              :aria-selected="activeTab === 'preview'">
              <span class="icon">👁️</span> Preview
            </button>
          </div>

          <!-- Editor Panel -->
          <div id="editor-panel" v-show="activeTab === 'edit'" role="tabpanel" aria-labelledby="edit-tab">
            <!-- Markdown Toolbar -->
            <div class="markdown-toolbar">
              <button type="button" class="toolbar-btn" title="Heading 1" @click="insertMarkdown('# ', '')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 12h16"></path>
                  <path d="M4 18h16"></path>
                  <path d="M4 6h16"></path>
                </svg>
                <span>H1</span>
              </button>
              <button type="button" class="toolbar-btn" title="Heading 2" @click="insertMarkdown('## ', '')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 12h16"></path>
                  <path d="M4 18h16"></path>
                  <path d="M4 6h16"></path>
                </svg>
                <span>H2</span>
              </button>
              <div class="toolbar-divider"></div>
              <button type="button" class="toolbar-btn" title="Bold" @click="insertMarkdown('**', '**')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                  <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                </svg>
              </button>
              <button type="button" class="toolbar-btn" title="Italic" @click="insertMarkdown('*', '*')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="19" y1="4" x2="10" y2="4"></line>
                  <line x1="14" y1="20" x2="5" y2="20"></line>
                  <line x1="15" y1="4" x2="9" y2="20"></line>
                </svg>
              </button>
              <button type="button" class="toolbar-btn" title="Code" @click="insertMarkdown('`', '`')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
              </button>
              <div class="toolbar-divider"></div>
              <button type="button" class="toolbar-btn" title="Bulleted List" @click="insertMarkdown('- ', '')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </button>
              <button type="button" class="toolbar-btn" title="Numbered List" @click="insertMarkdown('1. ', '')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="10" y1="6" x2="21" y2="6"></line>
                  <line x1="10" y1="12" x2="21" y2="12"></line>
                  <line x1="10" y1="18" x2="21" y2="18"></line>
                  <path d="M4 6h1v4"></path>
                  <path d="M4 10h2"></path>
                  <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
                </svg>
              </button>
              <div class="toolbar-divider"></div>
              <button type="button" class="toolbar-btn" title="Link" @click="insertMarkdown('[', '](url)')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
              </button>
              <button type="button" class="toolbar-btn" title="Image" @click="insertMarkdown('![', '](image-url)')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </button>
              <button type="button" class="toolbar-btn" title="Blockquote" @click="insertMarkdown('> ', '')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
              <button type="button" class="toolbar-btn" title="Code Block" @click="insertMarkdown('```\n', '\n```')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
                <span>{ }</span>
              </button>
            </div>

            <textarea id="content" v-model="formData.content" placeholder="Write your post content in markdown..."
              required :aria-invalid="formErrors.content ? 'true' : 'false'" rows="15"></textarea>
            <div v-if="formErrors.content" class="error-message" role="alert">{{ formErrors.content }}</div>
          </div>

          <!-- Preview Panel -->
          <div id="preview-panel" v-show="activeTab === 'preview'" role="tabpanel" aria-labelledby="preview-tab"
            aria-live="polite">
            <div class="preview-header">
              <h2 id="preview-heading" class="text-xl font-semibold mb-2 sr-only">Preview</h2>
              <article v-html="previewContent" class="preview-content prose lg:prose-lg max-w-none" tabindex="0">

              </article>
            </div> 
          </div> 
        </div> 
      </div> 

      <div class="button-group">
        <button type="submit" class="submit-btn" :disabled="isSubmitting" :aria-busy="isSubmitting">
          {{ buttonText }}
        </button>
        <button type="button" class="cancel-btn" @click="cancelEdit" :disabled="isSubmitting">
          Cancel Post
        </button>
      </div>
    </form>

    <Notification v-model="showNotification" :message="notificationMessage" :type="notificationType"
      :icon="notificationIcon" />
  </section>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { addPost, updatePost, getPostById, signOut, auth } from '@/config/firebase'
import LoadingOverlay from '@/components/UI/LoadingOverlay.vue'
import { renderMarkdown } from '@/utils/markdown';
import Notification from '@/components/UI/Notification.vue'
import { useNotification } from '@/utils/helpers'

const {
  showNotification,
  notificationMessage,
  notificationType,
  notificationIcon,
  showNotify
} = useNotification();
const props = defineProps({
  id: { type: String, default: '' }
})

const router = useRouter();  // For navigation :performing navigation actions
const route = useRoute();    // For reading current route info
const postId = ref(null);
const isEditMode = ref(false);
const activeTab = ref('edit'); // For tab switching between edit and preview

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
const isLoading = ref(false)

const previewContent = computed(() => {
  return renderMarkdown(formData.value.content || '');
});

const buttonText = computed(() => {
  if (isSubmitting.value) {
    return isEditMode.value ? 'Updating...' : 'Publishing...'
  }
  return isEditMode.value ? 'Update Post' : 'Publish Post'
})

// Load post data if in edit mode
const loadPost = async () => {
  // Get ID from either props or route params
  const editId = props.id || route.params.id;
  if (!editId) return;

  try {
    isLoading.value = true;
    const post = await getPostById(editId);

    if (post) {
      postId.value = post.id;
      isEditMode.value = true;

      // Format the date from Firestore timestamp to YYYY-MM-DD for the input field
      formData.value = {
        ...post,
        date: post.date instanceof Date ? post.date.toISOString().split('T')[0] :
          post.date && post.date.toDate ? post.date.toDate().toISOString().split('T')[0] :
            new Date().toISOString().split('T')[0]
      };
    } else {
      showNotify('Post not found', 'error');
      router.push('/admin');
    }
  } catch (error) {
    console.error('Error loading post:', error);
    showNotify('Failed to load post', 'error');
    router.push('/admin');
  } finally {
    isLoading.value = false;
  }
};

// Check token expiration and load post if needed
onMounted(async () => {
  if (!auth.currentUser) {
    router.push('/login');
    return;
  }

  // If we have a post ID (either from props or route params), load the post data
  if (props.id || route.params.id) {
    await loadPost();
  }

  // Set initial focus to the title field
  nextTick(() => {
    document.getElementById('title')?.focus();
  });
});

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

const cancelEdit = () => {
  // Navigate back to admin page or blog page
  router.push('/admin/manage-posts');
};

// Function to handle markdown toolbar button clicks
const insertMarkdown = (prefix, suffix) => {
  // Get the textarea element
  const textarea = document.getElementById('content');
  if (!textarea) return;

  // Get current selection positions
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = formData.value.content.substring(start, end);
  const beforeText = formData.value.content.substring(0, start);
  const afterText = formData.value.content.substring(end);

  // Check if we're at the start of a line for block elements
  const isLineStart = start === 0 || formData.value.content.charAt(start - 1) === '\n';
  const needsNewLine = (prefix === '# ' || prefix === '## ' || prefix === '- ' || prefix === '1. ' || prefix === '> ') && !isLineStart;

  // Insert markdown with or without newline
  const insertion = needsNewLine ? '\n' + prefix + selectedText + suffix : prefix + selectedText + suffix;
  formData.value.content = beforeText + insertion + afterText;

  // Restore focus and update selection on next tick
  nextTick(() => {
    textarea.focus();
    const newCursorPos = start + prefix.length + (needsNewLine ? 1 : 0);

    // If there was selected text, maintain the selection
    if (selectedText.length > 0) {
      textarea.setSelectionRange(newCursorPos, newCursorPos + selectedText.length);
    } else {
      // For link and image, position cursor between brackets
      if ((prefix === '[' && suffix === '](url)') || (prefix === '![' && suffix === '](image-url)')) {
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
      // For code block, position cursor inside the block
      else if (prefix === '```\n' && suffix === '\n```') {
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
      // For other elements, position cursor after the inserted prefix
      else {
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }
  });
};

const handleSubmit = async () => {
  if (isSubmitting.value) return; // Prevent double submit
  isSubmitting.value = true;

  // Validate form
  if (!validateForm()) {
    // Focus the first field with an error
    const firstErrorField = Object.keys(formErrors.value).find(key => formErrors.value[key]);
    if (firstErrorField) {
      nextTick(() => {
        document.getElementById(firstErrorField)?.focus();
      });
    }
    isSubmitting.value = false;
    return;
  }

  try {
    const postData = {
      ...formData.value,
      date: new Date(formData.value.date)
    };

    if (isEditMode.value && postId.value) {
      // Update existing post
      await updatePost(postId.value, postData);
      showNotify('Post updated successfully!', 'success');
    } else {
      // Add new post
      postData.createdAt = new Date();
      await addPost(postData);
      showNotify('Post published successfully!', 'success');
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    await router.push('/blog');

    // Reset form after successful submission if it was a new post
    if (!isEditMode.value) {
      formData.value = {
        title: '',
        date: new Date().toISOString().split('T')[0],
        readingTime: 5,
        featureImage: '',
        content: ''
      };
    }
  } catch (error) {
    console.error(`Error ${isEditMode.value ? 'updating' : 'publishing'} post:`, error);
    showNotify(`Failed to ${isEditMode.value ? 'update' : 'publish'} post. ${error.message || 'Please try again.'}`, 'error');
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
/* 
  :deep() is a Vue scoped CSS feature that allows styling child components or dynamic content.
  The selector inside :deep() will be left untouched, allowing it to target nested elements.
  In this case, we're styling ordered lists within elements that have the 'prose' class.
*/

:deep(.prose ul) {
  list-style-type: disc; /* Default bullet points for unordered lists */
  padding-left: 1.5rem;
}

:deep(.prose ol) {
  list-style-type: decimal; /* Numbers for ordered lists */
  padding-left: 1.5rem;
}

:deep(.prose blockquote) {
  border-left: 4px solid #e5e7eb; /* Light gray border on the left */
  padding-left: 1rem;
  margin: 1.5rem 0;
  color: #4b5563; /* Slightly darker text */
  font-style: italic;
}

.admin-form {
  max-width: 800px;
  margin: 12rem auto -7rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  position: relative;
}

h1 {
  font-size: clamp(1.5rem, 5vw, 1.8rem);
  color: #4c1d95;
  /* Match the purple brand color */
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

.button-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  /* padding: 0 1rem;
  margin-bottom: 4.5rem; Balanced spacing to prevent GoBackTop overlap */

}

@media (min-width: 375px) {
  .button-group {
    flex-direction: row;
    place-items: center;
    padding: 1.5rem 0;
  }
}



.submit-btn {
  padding: 0.8rem 1.5rem;

  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4c1d95;
  /* Match the brand purple */
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.15s ease-in-out,
    transform 0.1s ease-out,
    box-shadow 0.15s ease-in-out;
  margin-top: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .submit-btn {
    margin-top: 1rem;
    padding: 1rem;
  }
}

.submit-btn:hover:not(:disabled) {
  background-color: #5b21b6;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

.cancel-btn {
  padding: 0.8rem 1.5rem;

  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e2e8f0;
  color: #4a5568;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  transition:
    background-color 0.2s ease,
    transform 0.1s ease-out;
  margin-top: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: #cbd5e0;
  cursor: pointer;
}

.markdown-editor {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

/* Tab Navigation */
.markdown-tabs {
  display: flex;
  border-bottom: 2px solid #e2e8f0;
  margin-bottom: 1rem;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  font-weight: 600;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab-button:hover {
  color: #4c1d95;
  background-color: rgba(76, 29, 149, 0.05);
}

.tab-button.active {
  color: #4c1d95;
  border-bottom-color: #4c1d95;
}

.tab-button .icon {
  font-size: 1.1rem;
}

/* Markdown Toolbar */
.markdown-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  padding: 0.5rem;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px 6px 0 0;
  margin-bottom: -1px;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.4rem 0.6rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  color: #4a5568;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.toolbar-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e0;
  color: #4c1d95;
}

.toolbar-btn:active {
  background: #edf2f7;
  transform: translateY(1px);
}

.toolbar-btn svg {
  width: 16px;
  height: 16px;
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background: #e2e8f0;
  margin: 0 0.25rem;
}

/* Editor and Preview Panels */
#editor-panel,
#preview-panel {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
}

#preview-panel {
  padding: 1rem;
}

.preview-header {
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
}

#content {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 0 0 6px 6px;
  padding: 1rem;
  min-height: 300px;
  font-family: 'Fira Code', monospace;
  line-height: 1.6;
  resize: vertical;
}

@media (min-width: 768px) {
  .markdown-editor {
    display: flex;
    flex-direction: column;
  }
}

@media (max-width: 767px) {
  .markdown-editor {
    display: flex;
    flex-direction: column;
  }

  .markdown-toolbar {
    overflow-x: auto;
    padding-bottom: 0.75rem;
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


@media (max-width: 768px) {
  .markdown-editor {
    grid-template-columns: 1fr;
  }
}
</style>