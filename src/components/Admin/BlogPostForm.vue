<template>
    <section id="main-content" class="admin-form relative" role="region" aria-labelledby="form-heading">
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
            :aria-busy="isLoading" novalidate>
            <div class="form-group">
                <label for="title">Title <span class="sr-only">(required)</span></label>
                <input 
                    id="title" 
                    v-model="formData.title" 
                    type="text" 
                    placeholder="Enter post title" 
                    required
                    :aria-invalid="formErrors.title ? 'true' : 'false'"
                    :aria-describedby="formErrors.title ? 'title-error' : undefined"
                    autocomplete="off"
                    aria-required="true">

                <div 
                    v-if="formErrors.title" 
                    id="title-error" 
                    class="error-message" 
                    role="alert" 
                    aria-live="assertive">
                    {{ formErrors.title }}
                </div>
            </div>

            <div class="form-group">
                <label for="date">Publication Date <span class="sr-only">(required)</span></label>
                <input 
                    id="date" 
                    v-model="formData.date" 
                    type="date" 
                    required
                    :aria-invalid="formErrors.date ? 'true' : 'false'"
                    :aria-describedby="formErrors.date ? 'date-error' : undefined"
                    aria-required="true">
                <div 
                    v-if="formErrors.date" 
                    id="date-error" 
                    class="error-message" 
                    role="alert" 
                    aria-live="assertive">
                    {{ formErrors.date }}
                </div>
            </div>

            <div class="form-group">
                <label for="readingTime">Reading Time (minutes) <span class="sr-only">(required)</span></label>
                <input 
                    id="readingTime" 
                    v-model.number="formData.readingTime" 
                    type="number" 
                    min="1" 
                    required
                    :aria-invalid="formErrors.readingTime ? 'true' : 'false'"
                    :aria-describedby="`readingTimeHint ${formErrors.readingTime ? 'readingTime-error' : ''}`"
                    aria-required="true">
                <div id="readingTimeHint" class="hint">Estimated time to read this article in minutes</div>
                <div 
                    v-if="formErrors.readingTime" 
                    id="readingTime-error" 
                    class="error-message" 
                    role="alert" 
                    aria-live="assertive">
                    {{ formErrors.readingTime }}
                </div>
            </div>

            <div class="form-group">
                <label for="featureImage">Feature Image URL</label>
                <input 
                    id="featureImage" 
                    v-model="formData.featureImage" 
                    type="url" 
                    placeholder="https://example.com/image.jpg"
                    :aria-invalid="formErrors.featureImage ? 'true' : 'false'"
                    :aria-describedby="formErrors.featureImage ? 'featureImage-error' : undefined"
                    aria-describedby="featureImageHint"
                    inputmode="url">
                <div id="featureImageHint" class="hint">Enter the full URL of the image (e.g., https://example.com/image.jpg)</div>
                <div 
                    v-if="formErrors.featureImage" 
                    id="featureImage-error" 
                    class="error-message" 
                    role="alert"
                    aria-live="assertive">
                    {{ formErrors.featureImage }}
                </div>
            </div>

            <!-- Tags Input Field -->
            <div class="form-group">
                <label for="tags-input">Tags <span class="tag-counter">({{ formData.tags.length }}/5)</span></label>
                <div class="tags-input-container">
                    <!-- Display existing tags -->
                    <div class="tags-display" v-if="formData.tags.length > 0">
                        <span v-for="(tag, index) in formData.tags" :key="tag" class="tag-chip">
                            {{ tag }}
                            <button type="button" @click="removeTag(index)" class="tag-remove"
                                aria-label="Remove tag">&times;</button>
                        </span>
                    </div>

                    <!-- Tag input -->
                    <div class="tag-input-wrapper">
                        <input 
                            v-if="formData.tags.length < 5" 
                            id="tags-input" 
                            ref="tagInput" 
                            v-model="newTag"
                            required
                            @keydown.enter.prevent="handleTagEnter"
                            @focus="handleFocus" 
                            @blur="handleBlur" 
                            @keydown.down.prevent="focusNextSuggestion(1)"
                            @keydown.up.prevent="focusPreviousSuggestion()" 
                            @keydown.esc="isSuggestionsOpen = false"
                            type="text"
                            placeholder="Type a tag and press Enter to add"
                            autocomplete="off"
                            role="combobox"
                            :aria-describedby="`tags-help ${formErrors.tags ? 'tags-error' : ''}`" 
                            aria-autocomplete="list"
                            :aria-expanded="isSuggestionsOpen ? 'true' : 'false'" 
                            aria-haspopup="listbox"
                            :aria-controls="isSuggestionsOpen ? 'tag-suggestions' : undefined"
                            :aria-activedescendant="isSuggestionsOpen ? activeSuggestionId : undefined"
                            :aria-invalid="formErrors.tags ? 'true' : 'false'"
                            aria-required="true">
                            <div v-if="formErrors.tags" id="tags-error" class="error-message" role="alert" aria-live="polite">{{ formErrors.tags }}</div>
                        <Transition name="tag-suggestions-fade">
                            <div v-if="isSuggestionsOpen" class="tag-suggestions-container">
                                <ul id="tag-suggestions" class="tag-suggestions" role="listbox"
                                    :aria-label="`${filteredTags.length} suggestions available`">
                                    <li v-for="(tag, index) in filteredTags" :key="tag" :id="`suggestion-${index}`"
                                        @mousedown.prevent="selectTag(tag)" 
                                        @mouseenter="focusedSuggestionIndex = index"
                                        role="option" :aria-selected="focusedSuggestionIndex === index"
                                        :class="['tag-suggestion', { 'focused': focusedSuggestionIndex === index }]">
                                        <div class="tag-suggestion-left">
                                            <span class="tag-suggestion-icon" aria-hidden="true">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M7 7H17M7 12H17M7 17H14" stroke="currentColor"
                                                        stroke-width="2" stroke-linecap="round"
                                                        stroke-linejoin="round" />
                                                </svg>
                                            </span>
                                            <span class="tag-suggestion-label" v-html="highlightMatch(tag)"></span>
                                        </div>
                                        <span class="tag-suggestion-action">
                                            <kbd class="kbd">Enter</kbd>
                                        </span>
                                    </li>
                                </ul>
                                <div class="tag-suggestions-footer">
                                    <span class="tag-suggestions-count">{{ filteredTags.length }} suggestions</span>
                                    <span class="tag-suggestions-hint">
                                        <kbd class="kbd">↑</kbd>
                                    </span>
                                </div>
                            </div>
                        </Transition>
                    </div>

                    <div id="tags-help" class="tag-help-container" role="region" aria-labelledby="tag-help-heading">
                        <div class="tag-help-header">
                            <h4 id="tag-help-heading" class="tag-help-title">
                                <span class="tag-help-title-icon" aria-hidden="true">💡</span>
                                Quick Help
                            </h4>
                        </div>

                        <div class="tag-help-content">
                            <p class="tag-help-summary">
                                <strong>How to add tags:</strong>
                                <span v-if="formData.tags.length < 5">
                                    Type a tag name and press <kbd>Enter</kbd>, or click outside
                                    the
                                    input field.
                                </span>
                                <span v-else>
                                    <mark class="limit-highlight">Tag limit reached (5/5).</mark> <strong>Remove any tag
                                        above</strong> to show the input field again.
                                </span>
                                <strong>Rules:</strong> Maximum 5 tags, each up to 20 characters. Use only letters,
                                numbers, and
                                hyphens.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label for="content">Content (Markdown)</label>
                    <div class="markdown-editor" role="group" aria-labelledby="markdown-editor-label">
                    <span id="markdown-editor-label" class="sr-only">Markdown editor with preview. Use tab to switch between edit and preview modes.</span>

                    <!-- Tab Navigation -->
                    <div class="markdown-tabs" role="tablist" aria-label="Markdown editor modes">
                        <button id="edit-tab" type="button" role="tab" @click="activeTab = 'edit'"
                            :class="['tab-button', { active: activeTab === 'edit' }]" aria-controls="editor-panel"
                            :aria-selected="activeTab === 'edit'"
                            :tabindex="activeTab === 'edit' ? 0 : -1">
                            <span class="icon">✏️</span> Edit
                        </button>
                        <button id="preview-tab" type="button" role="tab" @click="activeTab = 'preview'"
                            :class="['tab-button', { active: activeTab === 'preview' }]" aria-controls="preview-panel"
                            :aria-selected="activeTab === 'preview'"
                            :tabindex="activeTab === 'preview' ? 0 : -1">
                            <span class="icon">👁️</span> Preview
                        </button>
                    </div>

                    <!-- Editor Panel -->
                    <div id="editor-panel" v-show="activeTab === 'edit'" role="tabpanel" aria-labelledby="edit-tab">
                        <!-- Markdown Toolbar -->

                        <MarkdownToolbar @format="handleFormat" />


                        <textarea ref="contentTextarea" id="content" v-model="formData.content"
                            @keydown.tab.exact.prevent="handleTabWrapper"
                            @keydown.shift.tab.exact.prevent="handleShiftTabWrapper"
                            @keydown.enter.exact.prevent="handleEnter1" @keydown.esc="handleEsc"
                            placeholder="Write your post content in markdown..." required
                            :aria-invalid="formErrors.content ? 'true' : 'false'"
                            :aria-describedby="contentDescribedBy" rows="15">
                </textarea>
                        <div v-if="formErrors.content" id="content-error" class="error-message" role="alert"
                            aria-live="polite">
                            {{ formErrors.content }}
                        </div>
                    </div>

                    <!-- Preview Panel -->
                    <div id="preview-panel" class="whitespace-pre-wrap tab-size-4" v-show="activeTab === 'preview'"
                        role="tabpanel" 
                        aria-labelledby="preview-tab" 
                        :aria-hidden="activeTab !== 'preview'"
                        tabindex="0"
                        aria-live="polite">
                        <div class="preview-header">
                            <h2 id="preview-heading" class="text-xl font-semibold mb-2 sr-only">Preview</h2>
                            <article v-html="previewContent" class="preview-content prose lg:prose-lg max-w-none"
                                tabindex="0">

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

        <ConfirmationDialog ref="confirmDialog" message="Discard all changes and return to posts?"
            confirm-text="Discard" cancel-text="Keep Editing" @confirm="navigateToManagePosts" />
    </section>
</template>

<script setup>
import { ref, watch, computed, onMounted, nextTick } from 'vue'
import { normalizeTag, findSimilarTag, TagNormalizer } from '@/utils/tagNormalizer';
import { useRouter, useRoute } from 'vue-router'
import { addPost, updatePost, getPostById, signOut, auth, validateTags } from '@/config/firebase'
import LoadingOverlay from '@/components/UI/LoadingOverlay.vue'
import { renderMarkdown } from '@/utils/markdown';
import Notification from '@/components/UI/Notification.vue'
import { useNotification } from '@/utils/helpers'
import MarkdownToolbar from '../UI/MarkdownToolbar.vue';
import ConfirmationDialog from '@/components/UI/ConfirmationDialog.vue';
import {
    handleTab, handleShiftTab, getListRelationship, getCurrentLineInfo,
    determineListType, shouldInsertNewLine, calculateCursorPosition,
    currentLinesIndention, getNumbersAtIndentationLevel,
    detectListNumber,
    hasOrderedLists
} from '@/utils/textareaHelpers';
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
const confirmDialog = ref(null);
const formData = ref({
    title: '',
    date: new Date().toISOString().split('T')[0],
    readingTime: 5,
    featureImage: '',
    content: '',
    tags: [] // Add tags field
});

const formErrors = ref({
    title: '',
    date: '',
    readingTime: '',
    featureImage: '',
    tags: '',
    content: ''
});


// Tag-related reactive variables
const allTags = ref([]);
const tagInput = ref(null);
const newTag = ref('');
const showTagLimitMessage = ref(false);
const showSuggestions = ref(false);
const isTagInputFocused = ref(false);
const focusedSuggestionIndex = ref(-1);
let blurTimeoutId = null;


const contentTextarea = ref(null);
const orderListCounters = ref({});
// Load post data if in edit mode
onMounted(async () => {

    const normalizer = new TagNormalizer();
    const allUniqueTags = Array.from(normalizer.aliasToCanonical.keys());
    const currentPostId = props.id || route.params.id;

    allTags.value = [...new Set(allUniqueTags)].sort();

    if (currentPostId) {
        isEditMode.value = true;
        postId.value = currentPostId;
        isLoading.value = true;

        try {
            const post = await getPostById(currentPostId);
            if (post) {
                formData.value = {
                    title: post.title || '',
                    date: post.date ? new Date(post.date.seconds * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    readingTime: post.readingTime || 5,
                    featureImage: post.featureImage || '',
                    content: post.content || '',
                    tags: post.tags || [] // Load existing tags
                };
            }
        } catch (error) {
            console.error('Error loading post:', error);
            showNotify('Failed to load post. Please try again.', 'error');
        } finally {
            isLoading.value = false;
        }
    }
});

// Filter tags based on input
const filteredTags = computed(() => {
    if (!newTag.value) return [];
    const searchTerm = newTag.value.toLowerCase();
    const normalizedExistingTags = new Set(formData.value.tags.map(tag => normalizeTag(tag)));
    return allTags.value
        .filter(tag => {
            const lowerTag = tag.toLowerCase();
            const normalizedTag = normalizeTag(tag);
            return lowerTag.includes(searchTerm) &&
                !formData.value.tags.includes(tag) &&
                !normalizedExistingTags.has(normalizedTag);
        })
        .slice(0, 5); // Show max 5 suggestions
});

watch([
    () => newTag.value,
    () => filteredTags.value.length,
    () => isTagInputFocused.value,
    () => formData.value.tags.length
]
    , ([input, suggestionsLength, isFocused, tagCount]) => {
        if (tagCount >= 5) {
            showSuggestions.value = false;
            return;
        }
        const hasInput = input && input.trim().length > 0;

        if (isFocused && hasInput && suggestionsLength > 0) {
            showSuggestions.value = true;
        } else if (!isFocused || !hasInput || suggestionsLength === 0) {
            showSuggestions.value = false;
        }
    });

const escapeHtml = (unsafe) => {
    return unsafe.replace(/[&<>"]+/g, (char) => {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;'
        };
        return map[char] || char;
    });
};

const highlightMatch = (tag) => {
    if (!newTag.value) return escapeHtml(tag);
    const escapedTag = escapeHtml(tag);
    const escapedQuery = escapeHtml(newTag.value.trim());
    if (!escapedQuery) return escapedTag;

    const regex = new RegExp(`(${escapedQuery.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')})`, 'ig');
    return escapedTag.replace(regex, '<mark>$1</mark>');
};

// Add a tag from suggestions
const selectTag = (tag) => {
    if (formData.value.tags.length >= 5) return;

    const normalizedSelectedTag = normalizeTag(tag);
    const existingNormalizedTags = formData.value.tags.map(existingTag => normalizeTag(existingTag));

    if (existingNormalizedTags.includes(normalizedSelectedTag)) {
        showNotify(`Tag '${tag}' is too similar to an existing tag.`, 'error');
        return;
    }

    formData.value.tags.push(tag.toLowerCase());
    newTag.value = '';
    showSuggestions.value = false;
    focusedSuggestionIndex.value = -1;
};
// Focus management for keyboard navigation
const focusNextSuggestion = (increment = 1) => {

    if (!showSuggestions.value || filteredTags.value.length === 0) return;

    const newIndex = focusedSuggestionIndex.value + increment;
    if (newIndex >= 0 && newIndex < filteredTags.value.length) {
        focusedSuggestionIndex.value = newIndex;

    } else if (newIndex >= filteredTags.value.length) {
        // Wrap to first item if at the end
        focusedSuggestionIndex.value = 0;

    }
};

const focusPreviousSuggestion = () => {
    if (!showSuggestions.value || filteredTags.value.length === 0) return;
    
    const newIndex = focusedSuggestionIndex.value - 1;
    if (newIndex >= 0) {
        focusedSuggestionIndex.value = newIndex;
    } else {
        // Wrap to last item if at the beginning
        focusedSuggestionIndex.value = filteredTags.value.length - 1;

    }
};


const isSuggestionsOpen = computed(() => {
    return showSuggestions.value && filteredTags.value.length > 0 && isTagInputFocused.value;
});

const activeSuggestionId = computed(() => {
    if (!isSuggestionsOpen.value) return '';
    const index = focusedSuggestionIndex.value;
    if (index >= 0 && index < filteredTags.value.length) {
        return `suggestion-${index}`;
    }
    return '';
});

const highlightedSuggestion = computed(() => {
    const suggestions = filteredTags.value;
    if (!suggestions.length) return null;

    const typedTag = newTag.value?.trim();
    if (typedTag) {
        const normalizedTypedTag = normalizeTag(typedTag);
        const exactMatch = suggestions.find(tag => normalizeTag(tag) === normalizedTypedTag);
        if (exactMatch) {
            return exactMatch;
        }
    }

    const index = focusedSuggestionIndex.value;
    if (index >= 0 && index < suggestions.length) {
        return suggestions[index];
    }

    return null;
});

const handleTagEnter = () => {
    const suggestions = filteredTags.value;
    if (!suggestions.length) {
        addTag();
        return;
    }

    const typedTag = newTag.value?.trim();
    const highlighted = highlightedSuggestion.value;

    if (highlighted) {
        const normalizedHighlighted = normalizeTag(highlighted);
        const normalizedTyped = typedTag ? normalizeTag(typedTag) : '';

        // If the user typed something matching this suggestion (exact match) or explicitly navigated to it,
        // we should add the suggestion.
        if (normalizedHighlighted === normalizedTyped || focusedSuggestionIndex.value >= 0) {
            selectTag(highlighted);
            return;
        }
    }

    addTag();
};

const resetFormErrors = () => {
    Object.keys(formErrors.value).forEach((key) => {
        formErrors.value[key] = '';
    });
};

const tagsAriaDescribedBy = computed(() => {
    return formErrors.value.tags ? 'tagHelp tags-error' : 'tagHelp';
});

const titleDescribedBy = computed(() => formErrors.value.title ? 'title-error' : undefined);
const dateDescribedBy = computed(() => formErrors.value.date ? 'date-error' : undefined);
const readingTimeDescribedBy = computed(() => formErrors.value.readingTime ? 'readingTimeHint readingTime-error' : 'readingTimeHint');
const featureImageDescribedBy = computed(() => formErrors.value.featureImage ? 'featureImage-error' : undefined);
const contentDescribedBy = computed(() => formErrors.value.content ? 'content-error' : undefined);

const isSubmitting = ref(false);
const isLoading = ref(false);

const previewContent = computed(() => {
    const html = renderMarkdown(formData.value.content || '');
    return html;
});
const buttonText = computed(() => {
    if (isSubmitting.value) {
        return isEditMode.value ? 'Updating...' : 'Publishing...';
    }
    return isEditMode.value ? 'Update Post' : 'Publish Post';
});

const handleFocus = () => {
    if (blurTimeoutId) {
        clearTimeout(blurTimeoutId);
        blurTimeoutId = null;
    }

    isTagInputFocused.value = true;

    if (newTag.value && newTag.value.trim().length > 0 && filteredTags.value.length > 0) {
        showSuggestions.value = true;
    }
};

// Blur handler with delay for better UX
const handleBlur = () => {
    if (blurTimeoutId) {
        clearTimeout(blurTimeoutId);
    }

    blurTimeoutId = setTimeout(() => {
        isTagInputFocused.value = false;
        showSuggestions.value = false;
        blurTimeoutId = null;
    }, 200);
};

/**
 * Wrapper for handleTab utility function that passes the reactive formData object
 * Uses the "pass by reference" pattern where the utility directly modifies formData.content
 * This maintains reactivity since the object properties are mutated, not replaced
 * @param {KeyboardEvent} event - The keyboard event object
 */
const handleTabWrapper = (event) => {
    handleTab(event, formData.value);
};

/**
 * Wrapper for handleShiftTab utility function that passes the reactive formData object
 * Uses the "pass by reference" pattern where the utility directly modifies formData.content
 * Alternative approach would be to return the new text and assign it here:
 * formData.value.content = handleShiftTab(event, formData.value.content);
 * @param {KeyboardEvent} event - The keyboard event object
 */
const handleShiftTabWrapper = (event) => {
    handleShiftTab(event, formData.value);
};



/**
 * Get the next ordered list counter and indentation string
 * @param {string} beforeText - The text before the cursor
 * @returns {Object} - The next counter and indentation information
 */
const getOrderListCounter = (beforeText, afterText) => {


    // Get the current line's indentation
    const indentStr = currentLinesIndention(beforeText);

    // Calculate indentation level based on spaces (4 spaces = 1 level)
    const indentLevel = Math.floor(indentStr.length / 4); // 0 = top level, 1 = 1 tab, etc.


    const parentId = findParentListItem(beforeText, indentLevel);

    // Create composite key using both level and parent
    const compositeKey = `level_${indentLevel}_${parentId}`;

    // Find the previous counter at this level to continue numbering
    let counterValue = 1;


    if (!hasOrderedLists(beforeText)) {
        orderListCounters.value = {};
        counterValue = 1;
    }

    // First, check if we already have a counter for this exact composite key
    if (orderListCounters.value[compositeKey] !== undefined) {
        counterValue = orderListCounters.value[compositeKey] + 1;
    } else {
        // If no exact match, look for any counter at this level with the same parent
        for (const [key, value] of Object.entries(orderListCounters.value)) {
            const keyLevelMatch = key.match(/level_(\d+)_(.*)/);
            if (keyLevelMatch) {
                const keyLevel = parseInt(keyLevelMatch[1], 10);
                const keyParent = keyLevelMatch[2];

                // If we find a counter at the same level with the same parent, continue from it
                if (keyLevel === indentLevel && keyParent === parentId) {
                    counterValue = value + 1;
                    break;
                }
            }
        }
    }

    // Clean up counters that are no longer needed
    const keysToDelete = [];
    for (const key in orderListCounters.value) {
        const keyLevelMatch = key.match(/level_(\d+)_/);
        if (keyLevelMatch) {
            const keyLevel = parseInt(keyLevelMatch[1], 10);

            // Delete counters for any lists nested deeper than the current level
            // But only if we're not in the middle of a sublist
            if (keyLevel > indentLevel && !key.startsWith(`level_${indentLevel + 1}_${parentId}`)) {
                keysToDelete.push(key);
            }

            // Delete counters for lists at the same level with different parents
            if (keyLevel === indentLevel && key !== compositeKey) {
                keysToDelete.push(key);
            }
        }
    }

    // Actually delete the marked keys
    keysToDelete.forEach(key => {
        delete orderListCounters.value[key];
    });

    // Update the counter
    orderListCounters.value[compositeKey] = counterValue;

    return {
        number: orderListCounters.value[compositeKey]
    };
};

/**
 * Helper function to find the parent list item for hierarchical tracking
 * @param {string} textBeforeCursor - The text before the cursor
 * @param {number} currentIndentLevel - The current indentation level
 * @returns {string} - A unique identifier for the parent list item
 */
const findParentListItem = (textBeforeCursor, currentIndentLevel) => {


    if (currentIndentLevel === 0) {
        return 'root';
    }

    const lines = textBeforeCursor.split('\n');

    // Look backwards from the current position to find the parent
    // Start from the line before the current line
    for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i];
        const lineIndent = line.match(/^ */)[0];
        const lineIndentLevel = Math.floor(lineIndent.length / 4);

        // Skip empty lines
        if (!line.trim()) {
            continue;
        }

        // If we find a line with exactly one level less indentation that's a list item
        if (lineIndentLevel === currentIndentLevel - 1) {
            const parentMatch = line.trim().match(/^(\d+\.\s*|[-*+]\s*)/);
            if (parentMatch) {
                // Found a valid parent, create a stable ID
                return `${parentMatch[1]}_${i}`;
            }
        }

        // If we find a line with less indentation than our target parent level,
        // we've gone too far back without finding a parent
        if (lineIndentLevel < currentIndentLevel - 1) {
            break;
        }
    }

    // If no parent is found, create a unique ID based on the current context
    return `orphan_${currentIndentLevel}_${lines.length}`;
};




const handleEnter = (event) => {

    const textarea = event.target;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = formData.value.content;

    // Check if we're in a list item
    const currentLine = value.substring(value.lastIndexOf('\n', start - 1) + 1, start);
    const isInListItem = currentLine.match(/^\s*(\d+\.|[-*+])\s?/);
    if (isInListItem) {
        // Find the next line
        //start searching for \n from start point to find next line
        const nextLineStart = value.indexOf('\n', start) + 1;

        if (nextLineStart === 0) {
            // No next line, create a new list item
            event.preventDefault();
            const beforeText = value.substring(0, start);
            const afterText = value.substring(end);

            // Extract current list marker info
            const listMatch = currentLine.match(/^(\s*)(\d+\.|[-*+])(\s+)/);
            if (!listMatch) return;

            const [_, indent, marker, space] = listMatch;
            let newMarker;

            if (marker.match(/\d+\./)) {
                // For ordered lists, increment the number
                const currentNumber = parseInt(marker, 10);
                newMarker = `${currentNumber + 1}.`;
            } else {
                // For unordered lists, keep the same marker
                newMarker = marker;
            }

            // Create new list item with same indentation
            const newListItem = `\n${indent}${newMarker}${space}`;
            formData.value.content = beforeText + newListItem + afterText;

            // Position cursor after the new list marker
            const newCursorPos = start + newListItem.length;
            nextTick(() => {
                textarea.focus();
                textarea.setSelectionRange(newCursorPos, newCursorPos);
            });
            return;
        }


        // Check if there is a next line and it's a list item
        if (nextLineStart > 0) {
            const nextLineEnd = value.indexOf('\n', nextLineStart);
            const nextLine = nextLineEnd === -1 ?
                value.substring(nextLineStart) :
                value.substring(nextLineStart, nextLineEnd);

            const nextListItemMatch = nextLine.match(/^\s*(\d+\.|[-*+])\s/);

            if (nextListItemMatch) {
                // Just move the cursor to after the list marker
                event.preventDefault();
                const newPosition = nextLineStart + nextListItemMatch[0].length;

                nextTick(() => {
                    textarea.focus();
                    textarea.setSelectionRange(newPosition, newPosition);
                });
                return;
            }
        }
    }

    // Default enter behavior
    event.preventDefault();
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);
    formData.value.content = beforeText + '\n' + afterText;
    // Calculate cursor position after newline: start + 1 (for the '\n' character)
    // This positions the cursor at the beginning of the new line
    const newLineCursorPos = start + 1;
    nextTick(() => {
        textarea.focus();
        textarea.setSelectionRange(newLineCursorPos, newLineCursorPos);
    });
};

const handleFormat = ({ prefix, suffix }) => {
    const textarea = contentTextarea.value;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    // Get current line information using the helper function
    const {
        lineStart: currentLineStart,
        lineText: currentLineText,
        lineIndent: currentLineIndent,
        isLineStart,
        isInListItem
    } = getCurrentLineInfo(formData.value.content, start);

    const selectedText = formData.value.content.substring(start, end);
    let beforeText = formData.value.content.substring(0, start);
    const afterText = formData.value.content.substring(end);

    const { isList: isListMarker, isOrdered, isUnordered } = determineListType(prefix);

    let newCursorPos = start;
    let insertion;
    let { number, shouldJump } = { number: null, shouldJump: false };

    if (isOrdered) {
        ({ number, shouldJump } = getOrderListCounter(beforeText, afterText));

        // If we're jumping, handle cursor positioning after the text is inserted
        if (shouldJump) {
            nextTick(() => {
                if (contentTextarea.value) {
                    const newPosition = contentTextarea.value.value.length;
                    contentTextarea.value.focus();
                    contentTextarea.value.setSelectionRange(newPosition, newPosition);
                }
            });
            return;
        }
    }


    // Find out how this line relates to the previous list item
    const {
        isNewSublist,      // Is this line indented more than the previous?
        isSameLevel,       // Is this line at the same level as the previous?
        isOutdented,       // Is this line outdented compared to the previous?
        prevLineIndent     // The spaces before the previous line
    } = getListRelationship(beforeText, currentLineIndent);



    let indentToUse = currentLineIndent || '';
    const hasManual4Spaces = beforeText.endsWith('    ');

    if (isNewSublist) {
        const targetIndent = prevLineIndent + '    '; // Base 4-space increment

        // Check if user manually entered exactly 4 spaces

        // Always respect manual 4-space indentation
        if (hasManual4Spaces) {
            indentToUse = "";
        }
        // Otherwise apply standard indentation rules
        else if (currentLineIndent.length % 4 !== 0) {
            // Normalize irregular indentation
            indentToUse = targetIndent;
        } else if (currentLineIndent.length < targetIndent.length) {
            // Add indentation if below target level
            indentToUse = targetIndent;
        } else {
            // Keep existing valid indentation
            indentToUse = currentLineIndent;
        }
    } else if (isSameLevel) {
        if (hasManual4Spaces) {
            indentToUse = "";
        } else {
            indentToUse = prevLineIndent;
        }
    }

    // Ensure we never have undefined indentation
    indentToUse = indentToUse || '';

    if (isOrdered) {
        // For ordered lists
        insertion = indentToUse + number + '.' + selectedText + suffix;
    } else if (isUnordered) {
        // For unordered lists - extract just the list marker without spaces
        const listMarker = prefix.trim();
        insertion = indentToUse + listMarker + '' + selectedText + suffix;
    } else {
        // For all other markdown elements
        insertion = prefix + selectedText + suffix;
    }

    // Add newline before list items when needed (edge cases handled in shouldInsertNewLine)
    if (shouldInsertNewLine(beforeText, isListMarker, isLineStart, insertion)) {
        insertion = '\n' + insertion;
    }

    // Calculate the new cursor position using the helper function
    newCursorPos = calculateCursorPosition({
        beforeText,
        selectedText,
        prefix,
        suffix,
        insertion,  // Pass the full insertion string
        isOrdered: !!number,
        isUnordered,
        number
    });
    formData.value.content = beforeText + insertion + afterText;


    // Set cursor position after the inserted text
    nextTick(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
    });
};

const navigateToManagePosts = () => {
    router.push('/admin/manage-posts');
};
const cancelEdit = () => {
    const { title, content, featureImage, date, readingTime, tags } = formData.value;
    const defaultDate = new Date().toISOString().split('T')[0];

    // Check if any field has been modified from its default/empty state
    const hasChanges = title ||
        content ||
        featureImage ||
        date !== defaultDate ||
        readingTime !== 5 ||
        (tags && tags.length > 0); // Check for tags changes

    if (!hasChanges) {
        navigateToManagePosts();
    } else {
        confirmDialog.value?.show();
    }
};

const validateForm = () => {
    let isValid = true;
    resetFormErrors();

    // Title validation
    if (!formData.value.title?.trim()) {
        formErrors.value.title = 'Title is required';
        isValid = false;
    } else if (!/[a-z0-9]/i.test(formData.value.title)) {
        formErrors.value.title = 'Please include at least one letter or number in the title.';
        isValid = false;
    }

    // Date validation
    if (!formData.value.date) {
        formErrors.value.date = 'Date is required';
        isValid = false;
    }

    console.log('tags on submit', formData.value.tags.length);
    // Tags validation
    if (!formData.value.tags?.length) {
        formErrors.value.tags = 'At least one tag is required';
        isValid = false;
    }
    // Content validation
    if (!formData.value.content?.trim()) {
        formErrors.value.content = 'Content is required';
        isValid = false;
    }

    return isValid;
};

// Tag management is now handled by the tagNormalizer utility

const addTag = () => {
    if (!newTag.value.trim()) return;

    // Check tag limit BEFORE any processing
    if (formData.value.tags.length >= 5) {
        showNotify('Maximum 5 tags reached. Remove a tag to add a new one.', 'error');
        return; // Stop here - don't process the tag
    }

    try {
        const inputTag = newTag.value.trim();
        const normalizedInputTag = normalizeTag(inputTag);
        // Check for exact duplicates first
        const existingNormalizedTags = formData.value.tags.map(tag => normalizeTag(tag));
        if (existingNormalizedTags.includes(normalizedInputTag)) {
            showNotify(`Tag '${inputTag}' already exists (case-insensitive)`, 'error');
            return;
        }

        // Check for similar tags
        const similarTag = findSimilarTag(inputTag, formData.value.tags);
        if (similarTag) {
            showNotify(`Tag '${inputTag}' is too similar to existing tag '${similarTag}'. Please use a more specific tag.`, 'error');
            return;
        }

        // Validate the tag using our backend validation
        const validatedTag = [inputTag];

        // Use validateTags to check the new tag
        validateTags([...formData.value.tags, ...validatedTag]);

        // If validation passes, add the tag
        formData.value.tags.push(inputTag.toLowerCase());
        newTag.value = '';

        // Show limit message when reaching 5 tags, auto-hide after 5 seconds
        if (formData.value.tags.length === 5) {
            showTagLimitMessage.value = true;
            setTimeout(() => {
                showTagLimitMessage.value = false;
            }, 5000); // 5 seconds
        }

        // Focus back to input for next tag
        nextTick(() => {
            tagInput.value?.focus();
        });

    } catch (error) {
        showNotify(error.message, 'error');
        // Keep focus on input for correction
        nextTick(() => {
            tagInput.value?.focus();
        });
    }
};

const removeTag = (index) => {
    formData.value.tags.splice(index, 1);

    // Focus back to input
    nextTick(() => {
        tagInput.value?.focus();
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
                content: '',
                tags: [] // Reset tags
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
    list-style-type: disc;
    /* Default bullet points for unordered lists */
    padding-left: 1.5rem;
}

:deep(.prose ol) {
    list-style-type: decimal;
    /* Numbers for ordered lists */
    padding-left: 1.5rem;
}

:deep(.prose ul),
:deep(.prose ol) {
    padding-left: 2rem;
    /* Increased base padding */
    margin-top: 0.25rem;
}

/* Different list markers for nested levels */
:deep(.prose ul ul) {
    list-style-type: circle;
}

:deep(.prose ol ol) {
    list-style-type: lower-alpha;
}

:deep(.prose ol ol ol) {
    list-style-type: lower-roman;
}

:deep(.prose blockquote) {
    border-left: 4px solid #e5e7eb;
    /* Light gray border on the left */
    padding-left: 1rem;
    margin: 1.5rem 0;
    color: #4b5563;
    /* Slightly darker text */
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
    /* preserve whitespace */
    white-space: pre;
    tab-size: 4;
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
    color: #c53030; /* Darker red for better contrast (4.6:1 on white) */
    font-size: 0.875rem;
    margin-top: 0.25rem;
    font-weight: 500; /* Slightly bolder for better readability */
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

/* Tag Input Styles */
.tags-input-container {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.tags-display {
    display: flex;
    flex-wrap: wrap;
    gap: clamp(0.375rem, 1.2vw + 0.1rem, 0.75rem);
    margin-bottom: 0.5rem;
}

.tag-chip {
    display: inline-flex;
    align-items: center;
    background: #5b28a7;
    color: white;
    padding: clamp(0.2rem, 1vw + 0.05rem, 0.3rem) clamp(0.4rem, 1.6vw + 0.1rem, 0.6rem);
    border-radius: 16px;
    font-size: clamp(0.8rem, 0.8vw + 0.6rem, 0.9rem);
    font-weight: 500;
    border: none;
    gap: clamp(0.375rem, 0.9vw + 0.15rem, 0.5rem);
}

.tag-remove {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 1.2rem;
    line-height: 1;
    padding: 0;
    margin-left: 0.25rem;
    opacity: 0.8;
    transition: opacity 0.2s;
}

.tag-remove:hover {
    opacity: 1;
}

.tag-input-wrapper {
    position: relative;
    margin-bottom: 4px;
    z-index: 1;
}

.tag-input-wrapper input {
    width: 100%;
    padding: clamp(0.625rem, 0.9vw + 0.45rem, 0.85rem);
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.2s;
}

.tag-input-wrapper input:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
}

.tag-input-wrapper input:disabled {
    background-color: #f7fafc;
    cursor: not-allowed;
    opacity: 0.6;
}

.tag-counter {
    color: #4c1d95;
    font-weight: 600;
    font-size: 0.875rem;
}

/* Tag Suggestions Container */
.tag-suggestions-container {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    z-index: 50;
    overflow: hidden;
    transform-origin: top;
    transition: all 0.2s ease-out;
}

/* Tag Suggestions List */
.tag-suggestions {
    max-height: 240px;
    overflow-y: auto;
    padding: 4px 0;
    margin: 0;
    list-style: none;
}

/* Individual Suggestion Item */
.tag-suggestion {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    margin: 0 4px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s ease;
    color: #1e293b;
}

.tag-suggestion:hover,
.tag-suggestion.focused {
    background-color: #f8fafc;
    color: #4f46e5;
}

.tag-suggestion:active {
    background-color: #f1f5f9;
    transform: translateY(1px);
}

/* Suggestion Content */
.tag-suggestion-left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
}

.tag-suggestion-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    flex-shrink: 0;
}

.tag-suggestion-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.tag-suggestion-label mark {
    background-color: #e0e7ff;
    color: #4f46e5;
    padding: 0 2px;
    border-radius: 3px;
}

.tag-suggestion-action {
    font-size: 0.75rem;
    color: #94a3b8;
    margin-left: 12px;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 4px;
}

/* Suggestions Footer */
.tag-suggestions-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    border-top: 1px solid #f1f5f9;
    background-color: #f8fafc;
    font-size: 0.75rem;
    color: #64748b;
}

.tag-suggestions-count {
    font-weight: 500;
}

.tag-suggestions-hint {
    display: flex;
    align-items: center;
    gap: 4px;
}

/* Keyboard Key Styling */
.kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 4px;
    font-family: 'Fira Code', 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    font-size: 0.7rem;
    font-weight: 600;
    line-height: 1;
    color: #334155;
    background-color: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

/* Animations */
.tag-suggestions-fade-enter-active,
.tag-suggestions-fade-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.tag-suggestions-fade-enter-from,
.tag-suggestions-fade-leave-to {
    opacity: 0;
    transform: translateY(-5px);
}

/* Scrollbar Styling */
.tag-suggestions::-webkit-scrollbar {
    width: 6px;
}

.tag-suggestions::-webkit-scrollbar-track {
    background: #f8fafc;
}

.tag-suggestions::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 3px;
}

.tag-suggestions::-webkit-scrollbar-thumb:hover {
    background-color: #94a3b8;
}

/* Dark Mode Support */
.dark .tag-suggestions-container {
    background: #1e293b;
    border-color: #334155;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
}

.dark .tag-suggestion {
    color: #e2e8f0;
}

.dark .tag-suggestion:hover,
.dark .tag-suggestion.focused {
    background-color: #334155;
    color: #818cf8;
}

.dark .tag-suggestion:active {
    background-color: #475569;
}

.dark .tag-suggestion-icon {
    color: #64748b;
}

.dark .tag-suggestion-label mark {
    background-color: #3730a3;
    color: #a5b4fc;
}

.dark .tag-suggestions-footer {
    background-color: #1e293b;
    border-color: #334155;
    color: #94a3b8;
}

.dark .kbd {
    background-color: #334155;
    border-color: #475569;
    color: #e2e8f0;
}

.tag-counter.warning {
    color: #dd6b20;
}

.tag-counter.error {
    color: #e53e3e;
}

/* Enhanced Tag Help Styles */
.tag-help-container {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: clamp(1rem, 1vw + 0.8rem, 1.25rem);
    margin-top: clamp(0.5rem, 0.8vw + 0.3rem, 0.75rem);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    position: relative;
    overflow: hidden;
}

.tag-help-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #4c1d95 0%, #7c3aed 50%, #a855f7 100%);
    border-radius: 12px 12px 0 0;
}

.tag-help-header {
    margin-bottom: clamp(0.75rem, 0.9vw + 0.5rem, 1rem);
    padding-bottom: clamp(0.5rem, 0.8vw + 0.3rem, 0.75rem);
    border-bottom: 1px solid #f1f5f9;
}

.tag-help-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: clamp(0.8rem, 0.8vw + 0.6rem, 0.9rem);
    font-weight: 600;
    color: #4c1d95;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.tag-help-title-icon {
    font-size: 1rem;
}

.tag-help-list {
    display: flex;
    flex-direction: column;
    gap: clamp(0.5rem, 1vw + 0.25rem, 0.75rem);
    margin: 0;
}

.tag-help-item {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
}

.tag-help-term {
    display: flex;
    align-items: center;
    gap: clamp(0.4rem, 0.7vw + 0.2rem, 0.5rem);
    font-size: clamp(0.8rem, 0.7vw + 0.55rem, 0.85rem);
    font-weight: 600;
    color: #2d3748;
    margin: 0;
}

.tag-help-description {
    font-size: clamp(0.8rem, 0.7vw + 0.55rem, 0.85rem);
    color: #4a5568;
    font-weight: 500;
    line-height: 1.5;
    margin: 0 clamp(0.1rem, 0.4vw, 0.25rem) 0 clamp(1.5rem, 1.8vw + 0.8rem, 2rem);
    padding: 0.125rem clamp(0.25rem, 0.7vw, 0.5rem);
}

/* Simplified tag help content */
.tag-help-content {
    padding: 0.5rem 0;
}

.tag-limit-message {
    margin-top: 0.75rem;
    padding: 0.5rem;
    background-color: #fef3c7;
    border: 1px solid #f59e0b;
    border-radius: 4px;
    color: #92400e;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.dark .tag-limit-message {
    background-color: #451a03;
    border-color: #d97706;
    color: #fbbf24;
}

.tag-help-icon {
    font-size: clamp(1rem, 0.6vw + 0.85rem, 1.25rem);
    width: clamp(1.25rem, 1vw + 0.9rem, 1.5rem);
    height: clamp(1.25rem, 1vw + 0.9rem, 1.5rem);
}

/* Disabled input message styling */
.tag-input-disabled-message {
    padding: clamp(0.5rem, 0.8vw + 0.3rem, 0.75rem);
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    color: #64748b;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

.dark .tag-input-disabled-message {
    background-color: #1e293b;
    border-color: #334155;
    color: #94a3b8;
}

.tag-help-text kbd {
    background: #e2e8f0;
    border: 1px solid #cbd5e0;
    border-radius: 3px;
    box-shadow: 0 1px 0 rgba(0, 0, 0, .2);
    color: #374151;
    display: inline-block;
    font-family: 'Fira Code', Monaco, 'Cascadia Code', monospace;
    font-size: 0.75rem;
    font-weight: bold;
    line-height: 1;
    padding: 0.125rem 0.375rem;
    margin: 0 0.125rem;
}

.dark .tag-limit-message {
    background-color: #451a03;
    border-color: #d97706;
    color: #fbbf24;
}


/* Highlighted text for limit reached */
.limit-highlight {
    background-color: #fef3c7;
    color: #92400e;
    padding: 0.125rem 0.25rem;
    border-radius: 3px;
    font-weight: 600;
}

.dark .limit-highlight {
    background-color: #451a03;
    color: #fbbf24;
}
</style>