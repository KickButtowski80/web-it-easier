<template>
  <section class="container mx-auto px-4 py-24">
    <div class="max-w-4xl mx-auto">
      <article v-if="post" :aria-labelledby="'post-title-' + post.id" :aria-describedby="'post-meta-' + post.id">
        <header class="text-center mb-8">
          <h1 :id="'post-title-' + post.id" class="text-3xl md:text-4xl font-normal text-gray-800 dark:text-gray-100 mb-2 tracking-tight">
            {{ post.title }}
          </h1>
          <div class="w-16 h-0.5 bg-gray-300 dark:bg-gray-600 mx-auto mt-4" aria-hidden="true"></div>
        </header>
        <div :id="'post-meta-' + post.id" class="text-gray-600 dark:text-gray-400 mb-8 text-sm">
          <time :datetime="post.date" class="mr-4">{{ formatDate(post.date) }}</time>
          <span>{{ post.readingTime }} min read</span>
        </div>

        <!-- Table of Contents -->
        <nav id="table-of-contents" class="mb-8 toc-bedazzled" v-if="toc.length > 0" role="navigation"
          aria-labelledby="toc-heading">
          <h2 id="toc-heading" class="text-lg font-semibold mb-2">Table of Contents</h2>
          <ul class="space-y-1">
            <li v-for="(item, index) in toc" :key="index" :class="{
              'ml-4': item.level === 'h3',
              'ml-8': item.level === 'h4'
            }">
              <a :href="`#${item.id}`" class="text-gray-600 hover:text-gray-900 transition-colors" :class="{
                'font-semibold': item.level === 'h2',
                'text-[1rem]': item.level === 'h3',
                'text-sm': item.level === 'h4'
              }" @click="scrollToSection(item.id)">
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
        <div id="post-content" 
          class="prose prose-lg max-w-none whitespace-pre-wrap tab-size-4"
          role="article"
          aria-label="Blog post content"
          v-html="renderedContent">
        </div>
      </article>
      <div v-else class="text-center py-12" role="status" aria-live="polite" aria-busy="true">
        <div class="animate-pulse" role="presentation">
          <div class="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4" aria-hidden="true"></div>
          <div class="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-8" aria-hidden="true"></div>
          <div class="h-4 bg-gray-200 rounded w-full mb-2" aria-hidden="true"></div>
          <div class="h-4 bg-gray-200 rounded w-full mb-2" aria-hidden="true"></div>
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-8" aria-hidden="true"></div>
        </div>
        <p class="text-gray-500 mt-4">
          <span class="sr-only">Status: </span>
          Loading post...
        </p>
      </div>
    </div>
    <Notification v-model="showNotification" :message="notificationMessage" :type="notificationType"
      :icon="notificationIcon" />
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import Notification from '@/components/UI/Notification.vue'
import { useNotification, titleToSlug } from "../utils/helpers";
import { renderMarkdown } from "../utils/markdown";
import "highlight.js/styles/github.css";
import { getPost } from "../config/firebase";
import { useRoute } from "vue-router";

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
  return new Promise((resolve, reject) => {
    try {
      if (post.value && post.value.title) {
        // Create the canonical URL using the proper slug format
        const slug = titleToSlug(post.value.title);
        const baseUrl = import.meta.env.PROD
          ? 'https://web-it-easier.vercel.app'
          : window.location.origin;
        canonicalUrl.value = `${baseUrl}/blog/${slug}`;

        // Store the default canonical if not already stored
        if (!defaultCanonical.value) {
          const defaultCanonicalEl = document.querySelector('link[rel="canonical"]');
          if (defaultCanonicalEl) {
            defaultCanonical.value = defaultCanonicalEl.outerHTML;
            defaultCanonicalEl.remove();
          }
        }

        // Add the canonical tag to the document head
        const link = document.createElement('link');
        link.rel = 'canonical';
        link.href = canonicalUrl.value;
        // Find the canonical URL comment
        const canonicalComment = Array.from(document.head.childNodes).find(
          node => node.nodeType === Node.COMMENT_NODE &&
            node.textContent.trim() === 'Canonical URL'
        );

        if (canonicalComment) {
          // Insert after the comment
          document.head.insertBefore(link, canonicalComment.nextSibling);
        } else {
          // Fallback to appending if comment not found
          document.head.appendChild(link);
        }
        // Update page title with post title for better SEO
        document.title = `${post.value.title} | Web It Easier`;
      }

      // Always resolve the promise when done
      resolve();
    } catch (error) {
      console.error('Error updating canonical tag:', error);
      reject(error);
    }
  });
};
onMounted(async () => {


  const defaultCanonicalEl = document.querySelector('link[rel="canonical"]');
  if (defaultCanonicalEl) {
    defaultCanonical.value = defaultCanonicalEl.outerHTML;
    defaultCanonicalEl.remove();
  }

  isMounted.value = true;
  const title = deslugify(props.slug);
  try {
    const postData = await getPost(title);
    if (isMounted.value && postData) {
      post.value = postData;
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

  document.title = "Izak's Portfolio";
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

</script>

<style>
/* 
  :deep() is a Vue scoped CSS feature that allows styling child components or dynamic content.
  The selector inside :deep() will be left untouched, allowing it to target nested elements.
  This is particularly useful for styling content that's dynamically inserted into the DOM,
  such as markdown-rendered content.
*/
#post-content[id="post-{{ post.title }}"] {
  /* Target all direct child elements of the post content */
  & > * {
    margin-bottom: 1.5rem;
  }

  /* Heading 1 - 3D Text Effect */
  h1 {
    font-size: 3rem;
    font-weight: 900;
    margin: 3rem 0 2rem;
    line-height: 1.1;
    color: #2563eb;
    text-transform: uppercase;
    letter-spacing: 1px;
    position: relative;

  }

  /* Heading 2 - Gradient Background with Clip Text */
  h2 {
    font-size: 2rem;
    font-weight: 800;
    margin: 3rem 0 1.5rem;
    padding: 0.5rem 1.5rem;
    line-height: 1.3;
    display: inline-block;
    position: relative;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradientFlow 8s ease infinite;
    background-size: 200% 200%;
  }

  h2::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
    border-radius: 2px;
    transform: scaleX(0.8);
    transform-origin: left;
    transition: transform 0.3s ease;
  }

  h2:hover::before {
    transform: scaleX(1);
  }

  /* Heading 3 - Animated Underline */
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e40af;
    margin: 2.5rem 0 1.5rem;
    padding-bottom: 0.5rem;
    display: inline-block;
    position: relative;
    overflow: hidden;
  }

  h3::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    transform: translateX(-100%);
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }

  h3:hover::after {
    transform: translateX(0);
  }

  /* Post Title Styles */
  .title-wrapper {
    padding: 1rem 0;
    margin: 2rem 0;
    position: relative;
  }
  
  #post-title {
    position: relative;
    display: inline-block;
    padding-bottom: 0.5rem;
    transition: color 0.3s ease;
  }
  
  #post-title:hover {
    color: #1e40af; /* Slightly darker blue on hover */
  }
  
  #post-title span {
    transition: transform 0.3s ease;
  }
  
  #post-title:hover span {
    transform: scaleX(1);
  }

  Style links
  a {
    color: #3b82f6;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  a:hover {
    color: #2563eb;
    text-decoration: underline;
  }

  /* Style lists */
  ul, ol {
    padding-left: 1.5rem;
    margin: 1rem 0;
  }

  li {
    margin-bottom: 0.5rem;
  }

  /* Style blockquotes */
  blockquote {
    border-left: 4px solid #e5e7eb;
    padding: 0.5rem 0 0.5rem 1rem;
    margin: 1rem 0;
    color: #4b5563;
    font-style: italic;
  }

  /* Animated Gradient HR */
  hr {
    border: none;
    height: 3px;
    margin: 2.5rem 0;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #3b82f6);
    background-size: 200% auto;
    border-radius: 3px;
    animation: gradientFlow 8s ease infinite;
  }

  @keyframes gradientFlow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  /* Code blocks */
  pre {
    background-color: #1e293b;
    border-radius: 8px;
    padding: 1.25rem;
    overflow-x: auto;
    margin: 1.5rem 0;
    font-family: 'Fira Code', 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    font-size: 0.9em;
    line-height: 1.6;
    color: #e2e8f0;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    position: relative;
  }

  /* Language label for code blocks */
  pre::before {
    content: attr(data-language);
    position: absolute;
    top: 0;
    right: 1rem;
    transform: translateY(-50%);
    background: #3b82f6;
    color: white;
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Inline code */
  code:not(pre code) {
    background-color: rgba(59, 130, 246, 0.1);
    padding: 0.2em 0.4em;
    border-radius: 4px;
    font-family: 'Fira Code', 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    font-size: 0.9em;
    color: #3b82f6;
    transition: all 0.2s ease;
  }
  
  code:not(pre code):hover {
    background-color: rgba(59, 130, 246, 0.15);
  }
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

/* Add scroll margin to headings */
.prose h2,
.prose h3,
.prose h4 {
  scroll-margin-top: 1.5rem;
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

/* TOC specific styles - higher specificity */
#table-of-contents.toc-bedazzled a {
  background: rgba(255, 255, 255, 0.4);
  border-radius: 0.5rem;
  padding: 0.2rem 0.6rem;
  transition: background 0.2s, color 0.2s;
}

#table-of-contents.toc-bedazzled a:hover {
  background: #717ec3;
  /* Changed text color for better contrast and aesthetic */
  color: #1A202C; /* A deep, rich blue/charcoal for improved aesthetic and contrast */
  text-decoration: none;
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
