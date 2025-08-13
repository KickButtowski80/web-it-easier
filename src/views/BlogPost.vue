<template>
  <section class="container mx-auto px-4 py-24">
    <div class="max-w-4xl mx-auto">
      <article v-if="post" id="post-article">
        <h1 id="post-title" class="text-4xl font-bold mb-4" v-html="post.title"></h1>
        <div class="text-gray-600 dark:text-gray-400 mb-8">
          <time class="mr-4" :datetime="new Date(post.date).toISOString().split('T')[0]">{{ formatDate(post.date) }}</time>
          <span>{{ post.readingTime }} min read</span>
        </div>

        <!-- Table of Contents -->
        <nav id="table-of-contents" class="mb-8 toc-bedazzled" v-if="toc.length > 0" role="navigation"
          aria-labelledby="toc-heading">
          <h3 id="toc-heading" class="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-200">Table of Contents</h3>
          <ul class="space-y-1">
            <li v-for="(item, index) in toc" :key="index" :class="{
              'ml-4': item.level === 'h3',
              'ml-8': item.level === 'h4'
            }">
              <a :href="`#${item.id}`" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors" :class="{
                'font-semibold': item.level === 'h2',
                'text-[1rem]': item.level === 'h3',
                'text-sm': item.level === 'h4'
              }">
                <span v-if="item.level === 'h3'">→ </span>
                <span v-if="item.level === 'h4'">⟶ </span>
                {{ item.text }}
              </a>
            </li>
          </ul>
        </nav>

        <!-- 
          Main content container with prose styling
          - Uses direct CSS selectors (no :deep) because:
            1. v-html content renders as direct children
            2. No component boundaries to cross
            3. Styles apply directly to rendered markdown
          - ID 'post-content' provides styling hook
          - 'prose' class applies Tailwind typography
          - 'whitespace-pre-wrap' preserves formatting
        -->
        <div id="post-content" class="prose prose-lg dark:prose-invert max-w-none whitespace-pre-wrap tab-size-4"
          v-html="renderedContent"></div>
      </article>
      <div v-else class="text-center py-12" role="status" aria-live="polite">
        <div class="animate-pulse">
          <div class="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-8"></div>
          <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
        </div>
        <p class="text-gray-500 mt-4">Loading post...</p>
      </div>
    </div>
    <Notification v-model="showNotification" :message="notificationMessage" :type="notificationType"
      :icon="notificationIcon" />
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { getPost } from '@/config/firebase';
import { titleToSlug, useNotification } from '@/utils/helpers';
import { renderMarkdown } from '@/utils/markdown';
import { updateCanonicalUrl } from '@/utils/seo-update-canonical-url';
import Notification from '@/components/UI/Notification.vue';
import "highlight.js/styles/github.css";
 


// Props
const props = defineProps({
  slug: {
    type: String,
    required: false,
  },
});

const {
  showNotification,
  notificationMessage,
  notificationType,
  notificationIcon,
  showNotify
} = useNotification();
const isMounted = ref(true);
const post = ref(null);
const defaultCanonical = ref(null);

// Set up canonical URL management
const canonicalUrl = ref('');

const updateCanonicalTag = async () => {
  console.group('[BlogPost] Updating canonical URL');
  
  if (!post.value?.title) {
    console.warn('Post title not available, cannot generate canonical URL');
    console.groupEnd();
    return null;
  }
  
  try {
    const slug = titleToSlug(post.value.title);
    const baseUrl = import.meta.env.PROD
      ? 'https://web-it-easier.vercel.app'
      : window.location.origin;
    
    // Generate the canonical URL
    canonicalUrl.value = `${baseUrl}/blog/${slug}`;
    console.log('Generated canonical URL:', canonicalUrl.value);
    
    // Update the canonical URL using the shared utility
    console.log('Calling updateCanonicalUrl()...');
    const result = updateCanonicalUrl();
    
    if (result) {
      console.log('✅ Successfully updated canonical URL');
      console.log('Current canonical tag:', document.querySelector('link[rel="canonical"]')?.outerHTML);
    } else {
      console.warn('⚠️ Failed to update canonical URL');
    }
    
    console.groupEnd();
    return result;
  } catch (error) {
    console.error('❌ Error updating canonical tag:', error);
    console.groupEnd();
    return null;
  }
};
onMounted(async () => {
  // Initialize default canonical URL
  const defaultCanonicalEl = document.querySelector('link[rel="canonical"]');
  if (defaultCanonicalEl) {
    defaultCanonical.value = defaultCanonicalEl.outerHTML;
  }

  isMounted.value = true;
  const title = deslugify(props.slug);
  try {
    const postData = await getPost(title);
    if (isMounted.value && postData) {
      post.value = postData;
      // Set dynamic page title based on post content (SEO)
      if (post.value?.title) {
        document.title = `${post.value.title} | Web It Easier`;
      } else {
        document.title = "Blog Post | Web It Easier";
      }
      await updateCanonicalTag();
    }
  } catch (error) {
    console.error('Error fetching post:', error);
    showNotify('Failed to load post. Please try again.', 'error');
  }
});

// Clean up canonical tag when component is unmounted
onUnmounted(() => {
  isMounted.value = false;

  // Remove any existing canonical tag
  const existingCanonical = document.querySelector('link[rel="canonical"]');
  if (existingCanonical) {
    existingCanonical.remove();
  }

  // Restore the default canonical tag after the comment if it exists
  if (defaultCanonical.value) {
    const canonicalComment = Array.from(document.head.childNodes).find(
      node => node.nodeType === Node.COMMENT_NODE &&
        node.textContent.trim() === 'Canonical URL'
    );

    if (canonicalComment) {
      // Create a temporary div to parse the HTML string
      const temp = document.createElement('div');
      temp.innerHTML = defaultCanonical.value;
      const defaultCanonicalEl = temp.firstChild;

      // Insert after the comment
      document.head.insertBefore(defaultCanonicalEl, canonicalComment.nextSibling);
    } else {
      // Fallback to appending if comment not found
      document.head.insertAdjacentHTML('beforeend', defaultCanonical.value);
    }
  }

});

function deslugify(slug) {
  return slug.replace(/-/g, ' ');
}

const renderedContent = computed(() => {
  if (!post.value || !post.value.content) return "";
  const html = renderMarkdown(post.value.content);
  return html;
});

const toc = computed(() => {
  const headings = []
  const parser = new DOMParser()
  const doc = parser.parseFromString(renderedContent.value, 'text/html')

  // Get all h2, h3 and h4 elements
  const headingElements = [...doc.querySelectorAll('h2, h3, h4')]

  headingElements.forEach(heading => {
    const id = heading.id
    const text = heading.textContent
    const level = heading.tagName.toLowerCase()

    if (id && text) {
      headings.push({
        id,
        text,
        level
      })
    }
  })

  return headings
})

// Methods
function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/*
function scrollToSection(id) {
  const element = document.getElementById(id);
  if (element) {
    // Use scrollIntoView with block: "start" and a scroll margin
    element.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}
*/

/*
// Deprecated: relying on native anchor behavior with global scroll padding
function scrollToSection(id) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
*/

</script>

<style>
/* 
  :deep() is a Vue scoped CSS feature that allows styling child components or dynamic content.
  The selector inside :deep() will be left untouched, allowing it to target nested elements.
  In this case, we're styling ordered lists within elements that have the 'prose' class.
*/

#post-content.prose:has(ul) {
  list-style-type: disc;
  padding-left: 2rem;
}

#post-content.prose:has(ol) {
  list-style-type: decimal;
  padding-left: 2rem;
}

/* Nested list styles */
#post-content.prose ul ul {
  list-style-type: circle;
}

#post-content.prose ol ol {
  list-style-type: lower-alpha;
}

#post-content.prose ol ol ol {
  list-style-type: lower-roman;
}

#post-content.prose blockquote {
  border-left: 4px solid #e5e7eb;
  /* Light gray border on the left */
  padding-left: 1rem;
  margin: 1.5rem 0;
  color: #4b5563;
  /* Slightly darker text */
  font-style: italic;
}

/* Base code block styling */
pre {
  background-color: #f6f8fa;
  border-radius: 6px;
  padding: 0.5rem;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: clamp(1rem, 2vw + 0.5rem, 1.1rem);
  font-weight: 500;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
}

/* Code content styling */
pre>code {
  /* all: unset; */
  display: block;
}

#post-content.prose code {
  background-color: rgba(59, 130, 246, 0.1);
  padding: 0.2em 0.6em;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.2);
  margin: 0 2px;
}


/* Add styling for the prose content */


.prose h1 {
  font-size: 2.5rem;
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.prose h2 {
  font-size: 2rem;
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  color: #374151;
  border-left: 4px solid #3b82f6;
  padding-left: 0.75rem;
  position: relative;
}

.prose h3 {
  font-size: 1.75rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: 500;
  color: #4b5563;
  padding-left: 1.25rem;
  position: relative;
}

.prose h4 {
  font-size: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: 500;
  color: #6b7280;
  padding-left: 1.5rem;
  position: relative;
}

.prose p {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.prose ul {
  list-style-type: disc;
  margin-left: 1.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.prose code {
  background-color: rgba(175, 184, 193, 0.2);
  padding: 0.2em 0.4em;
  border-radius: 6px;
}

.prose h2:target {
  color: #3b82f6;
  border-left: 4px solid #3b82f6;
  padding-left: 0.75rem;
  background-color: rgba(59, 130, 246, 0.1);
}

.prose h3:target {
  color: #3b82f6;
  padding-left: 1.25rem;
  background-color: rgba(59, 130, 246, 0.1);
}

.prose h4:target {
  color: #3b82f6;
  padding-left: 1.5rem;
  background-color: rgba(59, 130, 246, 0.1);
}

/* Dark mode overrides for stronger contrast */
@media (prefers-color-scheme: dark) {
  .prose h1 {
    color: #1a1818; /* Pure white for h1 */
    font-weight: 700;
  }
  .prose h2 {
    color: #1a1818;
    font-weight: 600;
  }
  .prose h3 {
    color: #1a1818;
    font-weight: 600;
  }
  .prose h4 {
    color: #1a1818;
    font-weight: 600;
  }

  /* Target highlight on headings in dark mode */
  .prose h2:target,
  .prose h3:target,
  .prose h4:target {
    background-color: rgba(59, 130, 246, 0.18); /* slightly stronger for dark */
  }

  /* Blockquote contrast in dark mode */
  #post-content.prose blockquote {
    border-left: 4px solid #374151; /* gray-700 */
    color: #d1d5db; /* gray-300 */
  }

  /* Inline code contrast in dark mode */
  #post-content.prose code {
    color: #93c5fd; /* blue-300 */
    background-color: rgba(59, 130, 246, 0.18);
    border-color: rgba(59, 130, 246, 0.35);
  }

  /* Base code block background lift for dark mode (keep hljs theme intact) */
  pre {
    background-color: rgba(17, 24, 39, 0.6); /* gray-900 w/ translucency */
  }
}

/* Accessible focus styles for Table of Contents links */
#table-of-contents a {
  display: block;              /* full-row target for easier focus/click */
  padding: 0.125rem 0.25rem;   /* subtle hit-area padding */
  border-radius: 0.375rem;     /* rounded corners */
  outline: none;               /* remove default outline, we add our own */
}

#table-of-contents a:focus-visible {
  outline: 2px solid #2563eb;        /* blue visible outline */
  outline-offset: 2px;               
  background-color: rgba(37, 99, 235, 0.08); /* subtle bg to reinforce focus */
  color: #1f2937; /* ensure strong contrast in light mode */
}

@media (prefers-color-scheme: dark) {
  #table-of-contents a:focus-visible {
    outline-color: #60a5fa; /* lighter blue for dark mode */
    background-color: rgba(96, 165, 250, 0.15);
    color: #f9fafb; /* near-white for contrast */
  }
}

/* Table of Contents Styling */

nav h2 {
  margin-left: -1rem;
  padding-left: 1rem;
  border-left: 2px solid #3b82f6;
}

nav ul {
  list-style: none;
  padding-left: 0;
}



nav a {
  display: block;
  padding: 0.25rem 0;
  transition: color 0.2s ease;
}

nav a.font-semibold {
  color: #1f2937;
}

nav a.text-sm {
  color: #4b5563;
}

nav a.text-xs {
  color: #6b7280;
}

nav a:hover {
  color: #3b82f6;
  text-decoration: none;
}

/* Add some spacing between sections */
h2,
h3 {
  margin-top: 2rem;
  margin-bottom: 1rem;
}

/* Add scroll margin to headings - using CSS variables */
.prose h2,
.prose h3,
.prose h4 {
  scroll-margin-top: 5rem; /* Default for mobile */
}

/* For medium screens and up */
@media (min-width: 768px) {
  .prose h2,
  .prose h3,
  .prose h4 {
    scroll-margin-top: 3rem;
  }
}

.toc-bedazzled {
  position: relative;
  overflow: hidden;
  background:
    /* SVG pattern for subtle sparkle effect */
    url("data:image/svg+xml;utf8,<svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='20' cy='20' r='1.5' fill='%23a5b4fc' opacity='0.6'/><circle cx='10' cy='30' r='1' fill='%23f472b6' opacity='0.4'/><circle cx='30' cy='10' r='1' fill='%23fbbf24' opacity='0.4'/></svg>"),
    linear-gradient(135deg, rgba(255, 255, 255, 0.85) 70%, rgba(199, 210, 254, 0.7) 100%);
  background-blend-mode: overlay;
  border-radius: 1rem;
  border: 2px solid #a5b4fc;
  box-shadow: 0 8px 24px 0 rgba(59, 130, 246, 0.09);
  padding: 2rem 1.5rem;
  transition: box-shadow 0.2s;
  backdrop-filter: blur(2px);
}

.toc-bedazzled h2 {
  color: #6366f1;
  letter-spacing: 0.03em;
}

.toc-bedazzled ul {
  background: transparent;
}

.toc-bedazzled a {
  background: rgba(255, 255, 255, 0.4);
  border-radius: 0.5rem;
  padding: 0.2rem 0.6rem;
  transition: background 0.2s, color 0.2s;
}

.toc-bedazzled a:hover {
  background: #a5b4fc;
  color: #fff;
}

.toc-bedazzled::after {
  content: "";
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  width: 20rem;
  height: 20rem;
  opacity: 0.5;
  pointer-events: none;
  z-index: 1;
  background:
    url("data:image/svg+xml;utf8,<svg width='320' height='320' viewBox='0 0 64 64' fill='none' xmlns='http://www.w3.org/2000/svg'><rect x='0' y='0' width='32' height='32' fill='%236366f1' fill-opacity='0.6'/><rect x='32' y='32' width='32' height='32' fill='%23fbbf24' fill-opacity='0.5'/><circle cx='48' cy='16' r='10' fill='%23f472b6' fill-opacity='0.3'/><rect x='16' y='48' width='16' height='8' fill='%233b82f6' fill-opacity='0.4'/></svg>") no-repeat center/contain;
}
</style>
