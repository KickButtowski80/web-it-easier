<template>
  <section class="container mx-auto px-4 py-24">
    <div class="max-w-4xl mx-auto">
      <article v-if="post" :aria-labelledby="'post-title-' + post.id" :aria-describedby="'post-meta-' + post.id">
        <header class="text-center my-8">
          <h1 :id="'post-title-' + post.id"
            class="text-4xl md:text-5xl font-extrabold tracking-tighter leading-wider mb-2">
            <span class="group inline-block w-full max-w-4xl px-8 py-4 rounded-2xl bg-gray-50/40 dark:bg-gray-800/20
             backdrop-blur-sm hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors duration-200">
              <span class="bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 bg-clip-text text-transparent
                         group-hover:opacity-90 transition-opacity duration-200">
                {{ post.title }}
              </span>
            </span>
          </h1>
          <div class="w-16 h-0.5 bg-gray-300 dark:bg-gray-600 mx-auto mt-4" aria-hidden="true"></div>
        </header>
        <div :id="'post-meta-' + post.id" class="text-gray-600 dark:text-gray-500 mb-8 text-base">
          <time :datetime="post.date" class="mr-4">
            {{ formatDate(post.date) }}
          </time>
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
        <div id="post-content" class="prose prose-lg max-w-none whitespace-pre-wrap tab-size-4" role="article"
          aria-label="Blog post content" v-html="renderedContent">
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
/* All of your existing styles are here, adapted for a standalone HTML file. */
body {
  font-family: 'Inter', sans-serif;
  background-color: #f8fafc;
}

#post-content>* {
  margin-bottom: 1.5rem;
}

#post-content h1 {
  font-size: clamp(2rem, 8vw, 3rem);
  font-weight: 900;
  margin: 3rem 0 2rem;
  line-height: 1.1;
  color: #2563eb;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
}

#post-content h2 {
  font-size: clamp(2rem, 6vw, 2rem);
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
  animation: gradientFlow 2s ease forwards;
  background-size: 200% 200%;
}

#post-content h2::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
  border-radius: 2px;
  transform: scaleX(0.4);
  transform-origin: left;
  transition: transform 0.3s ease;
}

#post-content h2:hover::before {
  transform: scaleX(1);
}

#post-content h3 {
  font-size: clamp(1.5rem, 4vw, 1.5rem);
  font-weight: 700;
  color: #1e40af;
  margin: 2.5rem 0 1.5rem;
  padding: 0.75rem 1rem;
  display: inline-block;
  position: relative;
  background-color: rgba(37, 99, 235, 0.05);
  border-left: 4px solid #3b82f6;
  border-radius: 0 4px 4px 0;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  position: relative;
}

#post-content h3::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
  border-radius: 2px;
  transform: scaleX(0.4);
  transform-origin: left;
  transition: transform 0.3s ease;
}

#post-content h3:hover::before {
  transform: scaleX(1);
}

 

/* Paragraph Styling */
#post-content p {
  margin: 1.8em 0;
  line-height: 1.8;
  color: #2d3748;
  font-size: 1.125rem;
  word-wrap: break-word;
  hyphens: auto;
  text-align: justify;
  text-justify: inter-word;
  position: relative;
  padding: 1.5rem 1.75rem;
  background: rgba(249, 250, 251, 0.7);
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
}

/* Hover effect */
#post-content p:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.05);
  background: rgba(249, 250, 251, 0.9);
}

/* First paragraph after headings */
#post-content h2 + p,
#post-content h3 + p,
#post-content h4 + p {
  margin-top: clamp(1.2em, 2vw, 2em);
  font-size: clamp(1rem, 2vw, 1.2rem);
  line-height: 1.9;
  color: #1a202c;
  background: rgba(236, 242, 253, 0.7);
  border-left-color: #2563eb;
}

/* Dark mode support */
.dark #post-content p {
  color: #e2e8f0;
  background: rgba(30, 41, 59, 0.4);
  border-left-color: #60a5fa;
}

.dark #post-content p:hover {
  background: rgba(30, 41, 59, 0.6);
}

.dark #post-content h2 + p,
.dark #post-content h3 + p,
.dark #post-content h4 + p {
  background: rgba(30, 58, 138, 0.3);
  color: #f8fafc;
}

/* Blockquote-like styling for important paragraphs */
#post-content p.important {
  background: rgba(121, 127, 133, 0.7);
  border: 1px solid rgba(37, 99, 235, 0.2);
  border-left: 4px solid #2563eb;
  font-style: italic;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
              border-color 0.3s ease,
              box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

#post-content p.important:hover {
  transform: translateY(-2px);
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

#post-content p.important::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.05), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

#post-content p.important:hover::before {
 
  opacity: 1;
}

.dark #post-content p.important {
  background: rgba(30, 58, 138, 0.2);
  border-color: rgba(96, 165, 250, 0.3);
  border-left-color: #60a5fa;
}

.dark #post-content p.important:hover {
  border-color: #60a5fa;
  box-shadow: 0 4px 12px rgba(96, 165, 250, 0.15);
}

/* Last paragraph in a section */
#post-content p:last-child {
  margin-bottom: 2.5em;
}
 


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
  color: #1e40af;
}

#post-title span {
  transition: transform 0.3s ease;
}

#post-title:hover span {
  transform: scaleX(1);
}

a {
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.2s ease, outline 0.2s ease;
  border-radius: 0.25rem;
  outline: none;
}

a:hover {
  color: #2563eb;
  text-decoration: underline;
}

a:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  color: #2563eb;
  text-decoration: underline;
}

#post-content ul,
#post-content ol {
  padding-left: 1.5rem;
  margin: 1rem 0;
}

#post-content li {
  position: relative;
  margin-bottom: 0.75rem;
  padding: 0.75rem 1rem 0.75rem 2rem;
  background: rgba(249, 250, 251, 0.7);
  border-radius: 0.5rem;
  border-left: 0.1875rem solid #3b82f6;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0.0625rem 0.125rem 0 rgba(0, 0, 0, 0.05);
  outline: none;
}

#post-content li:hover {
  transform: translateX(0.25rem);
  background: rgba(59, 130, 246, 0.05);
  box-shadow: 0 0.25rem 0.375rem -0.0625rem rgba(0, 0, 0, 0.1), 0 0.125rem 0.25rem -0.0625rem rgba(0, 0, 0, 0.06);
}

#post-content li:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Custom bullet point */
#post-content li::before {
  content: '•';
  position: absolute;
  left: 0.75rem;
  color: #3b82f6;
  font-size: 1.25rem;
  line-height: 1.4;
  transition: transform 0.2s ease;
}

#post-content li:hover::before {
  transform: scale(1.5);
  color: #2563eb;
}

/* Dark mode support */
.dark #post-content li {
  background: rgba(30, 41, 59, 0.3);
  border-left-color: #60a5fa;
}

.dark #post-content li:hover {
  background: rgba(59, 130, 246, 0.1);
}

.dark #post-content li::before {
  color: #60a5fa;
}

#post-content blockquote {
  position: relative;
  display: block;
  margin: 1rem 0;
  padding: 1.25rem 1.5rem 1.25rem 2.5rem;
  color: #374151;
  font-style: normal;
  background: #f3f4f6;
  border-radius: 0.5rem;
  border-left: 0.25rem solid #3b82f6;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.03);
  transition-property: background-color, border-color, box-shadow, transform, outline;
  transition-duration: 0.2s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  cursor: default;
  width: 100%;
  box-sizing: border-box;
  outline: none;
}

#post-content blockquote:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  transform: translateY(-1px);
}

#post-content blockquote:hover {
  background: #e5e7eb;
  border-left-color: #2563eb;
  box-shadow: 0 0.25rem 0.375rem -0.0625rem rgba(0, 0, 0, 0.05), 0 0.125rem 0.25rem -0.0625rem rgba(0, 0, 0, 0.03);
  transform: translateY(-0.0625rem);
  p {
    all: unset;
  }
}

#post-content blockquote::before {
  content: '\201C';
  position: absolute;
  top: 0.25rem;
  left: 0.5rem;
  font-size: 3rem;
  line-height: 1;
  color: #5e6b85;
  font-family: Georgia, serif;
  z-index: 1;
  opacity: 0.8;
}




/* Adjust for larger screens */
@media (min-width: 40rem) {
  #post-content blockquote {
    padding: 1.5rem 2rem 1.5rem 3.5rem;
  }
  
  #post-content blockquote::before {
    font-size: 4rem;
    top: 0.5rem;
    left: 0.75rem;
  }
}

#post-content blockquote p {
  position: relative;
  margin: 0.5rem 0;
  font-size: 1.1em;
  font-weight: 450; /* Slightly bolder than normal text */
  line-height: 1.6;
  color: #1f2937;
  z-index: 2;
  /* Reset any unwanted styles from parent elements */
  all: unset;
  display: block;
}

/* Prevent cascading resets to child elements */
#post-content blockquote p * {
  all: revert;
}

#post-content blockquote cite {
  display: block;
  margin-top: 0.75rem;
  font-size: 0.9em;
  color: #6b7280;
  font-style: normal;
  font-weight: 500;
}

#post-content blockquote cite::before {
  content: '\2014\00A0';
}

#post-content blockquote:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-left-color: #2563eb;
}

/* Dark mode support */
.dark #post-content blockquote {
  background: #1f2937;
  color: #e5e7eb;
  border-left-color: #60a5fa;
}

.dark #post-content blockquote::before {
  color: #374151;
}

.dark #post-content blockquote p {
  color: #f3f4f6;
}

.dark #post-content blockquote cite {
  margin: 0;
  padding: 0.5rem 1.5rem 1.5rem;
  background: transparent;
  box-shadow: none;
}

/* Style paragraphs that are immediately followed by a list */
#post-content p:has(+ ul),
#post-content h4:has(+ ul),
#post-content p:has(+ ol),
#post-content h4:has(+ ol),
#post-content p:has(+ h2) {
  position: relative;
  top: 2rem;
  margin-bottom: 0;
  padding: 1.25rem 1.5rem 0.75rem 3rem; /* Increased padding for custom marker */
  background: rgba(249, 250, 251, 0.9);
  border-radius: 0.5rem 0.5rem 0 0;
  border-left: 3px solid #3b82f6;
  font-weight: 500;
  color: #1f2937;
  transition: 
    background-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
  cursor: pointer;
  overflow: hidden;
}

/* Rotating arrow marker */
#post-content p:has(+ ul)::before,
#post-content h4:has(+ ul)::before,
#post-content p:has(+ ol)::before,
#post-content h4:has(+ ol)::before 

{
  content: '›';
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%) rotate(0);
  color: #3b82f6;
  font-size: 1.2em;
  font-weight: bold;
  transition: transform 0.5s ease, scale 0.5s ease;
  opacity: 0.8;
  transform-origin: left center;
}

/* Hover effects */
#post-content p:has(+ ul):hover,
#post-content p:has(+ ol):hover {
  background: rgba(239, 246, 255, 0.9);
  transform: translateX(4px) scale(1.05);
}

#post-content p:has(+ ul):focus-visible,
#post-content p:has(+ ol):focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

#post-content p:has(+ ul):hover::before,
#post-content p:has(+ ol):hover::before,
#post-content h4:has(+ ul):hover::before,
#post-content h4:has(+ ol):hover::before {
  transform: translateY(-50%) rotate(90deg);
  color: #2563eb;
  left: 0.8rem; /* Slight adjustment to compensate for rotation */
}

#post-content p:has(+ ul):hover,
#post-content p:has(+ ol):hover,
#post-content h4:has(+ ul):hover,
#post-content h4:has(+ ol):hover {
  background: rgba(239, 246, 255, 0.9);
  transform: translateX(10px) scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Style the list that follows a paragraph */
#post-content p + ul,
#post-content p + ol,
#post-content h4 + ul,
#post-content h4 + ol {
  margin-top: 0;
  padding: 0.25rem 1.5rem 1.25rem 3rem;
  background: rgba(249, 250, 251, 0.9);
  border-radius: 0 0 0.5rem 0.5rem;
  border-left: 3px solid #3b82f6;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* Table Styling */
#post-content table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 2rem 0;
  font-size: 0.95em;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
}

#post-content table:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

#post-content th,
#post-content td {
  padding: 1rem 1.25rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
  transition: background-color 0.2s ease;
}

#post-content th {
  background-color: #f7fafc;
  font-weight: 600;
  color: #2d3748;
  text-transform: uppercase;
  font-size: 0.8em;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #e2e8f0;
}

#post-content tr:last-child td {
  border-bottom: none;
}

#post-content tbody tr {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), 
              background-color 0.2s ease,
              box-shadow 0.2s ease;
  transform-origin: left center;
}

#post-content tbody tr:hover {
  background-color: #f8fafc;
  transform: scale(1.01);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  position: relative;
  z-index: 1;
}

#post-content tbody tr:last-child {
  border-bottom-left-radius: 0.75rem;
  border-bottom-right-radius: 0.75rem;
  overflow: hidden;
}

/* Striped rows */
#post-content tbody tr:nth-child(even) {
  background-color: #f8fafc;
}

/* Responsive tables */
@media (max-width: 768px) {
  #post-content table {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    border-radius: 0.5rem;
  }
  
  #post-content th,
  #post-content td {
    min-width: 120px;
  }
}

/* Dark mode support */
.dark #post-content p + ul,
.dark #post-content p + ol,
.dark #post-content h4 + ul,
.dark #post-content h4 + ol {
  background: rgba(30, 41, 59, 0.4);
  border-left-color: #60a5fa;
}

/* Dark mode table styles */
.dark #post-content table {
  background: #1e293b;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
}

.dark #post-content th {
  background-color: #1e293b;
  color: #e2e8f0;
  border-bottom-color: #334155;
}

.dark #post-content td {
  border-bottom-color: #334155;
  color: #cbd5e1;
}

.dark #post-content tbody tr:hover {
  background-color: #1e293b;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
}

.dark #post-content tbody tr:nth-child(even) {
  background-color: rgba(30, 41, 59, 0.5);
}

.dark #post-content p:has(+ ul),
.dark #post-content p:has(+ ol) {
  color: #f3f4f6;
}

#post-content hr {
  border: none;
  height: 0.1875rem;
  margin: 2.5rem 0;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #3b82f6);
  background-size: 200% auto;
  border-radius: 0.1875rem;
  animation: gradientFlow 2s ease forwards;
}

@keyframes gradientFlow {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}


#post-content pre {
  background-color: #161b22;
  border-radius: 0.375rem;
  outline: none;
  transition: box-shadow 0.2s ease;
  text-align: center;
  overflow-x: auto;
  margin: 1.5rem 0;
  font-family: 'Fira Code', 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  line-height: 1.6;
  color: #e2e8f0;
  position: relative;
  border-top: 2rem solid #2f55a0;
}

#post-content pre:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}


#post-content pre code {
  white-space: pre-wrap;
  word-wrap: break-word;
  display: block;
  padding: 1rem;
  font-size: 0.875rem;
  line-height: 1.6;
}

.prose {
  max-width: 50rem;
  margin: 2rem auto;
  padding: 1rem;
}

.prose h1 {
  font-size: 2.5rem;
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  border-bottom: 0.125rem solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.prose h2 {
  font-size: 2rem;
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  color: #374151;
  border-left: 0.25rem solid #3b82f6;
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
  list-style: none;
  margin: 1.5rem 0;
  padding: 1.5rem;
  background-color: #e2e8f0;
  border-radius: 0.5rem;
  box-shadow: 0 0.0625rem 0.1875rem 0 rgba(0, 0, 0, 0.1);
}

.prose ul>li {
  position: relative;
  padding: 0.5rem 0.5rem 0.5rem 2rem;
  line-height: 1.6;
  border-radius: 0.25rem;
  transition: transform 0.15s ease, background-color 0.15s ease;
}

.dark .prose ul {
  background-color: #1e293b;
  box-shadow: 0 0.125rem 0.25rem 0 rgba(0, 0, 0, 0.2);
}

.prose ul>li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #3b82f6;
  font-weight: bold;
  font-size: 1.2em;
  line-height: 1.2;
}

.prose ul ul {
  margin: 0.5rem 0 0.5rem 1.5rem;
  padding-left: 1rem;
}

.prose ul ul>li::before {
  content: '◦';
  color: #60a5fa;
}

.prose ul>li:hover {
  transform: translateX(2px);
}

.prose ul+p,
.prose p+ul {
  margin-top: 1.25rem;
}

.prose code {
  background-color: #8b8989;
  color: #0A0A50;
  padding: 0.4em 0.8em;
  display: inline-block;
  font-family: 'Fira Code', 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: clamp(0.85em, 3.5vw + 0.1em, 1em);
  border-radius: 3px;
  line-height: 2.2;
  word-break: break-word;
  min-width: min(2.5em, 100%);
  max-width: 100%;
  overflow-x: auto;
}


@media (hover: none) {
  .prose code {
    padding: 0.3em 0.6em;
  }
}

.prose ul>li {
  position: relative;
  padding-left: 1.75rem;
  text-indent: -0.5rem;
}

.prose ul>li:has(> code:first-child) {
  padding-left: 0.5rem;
  text-indent: 0;
}

.prose ul>li>code:first-child {
  margin-right: 0.25rem;
  margin-left: -0.25rem;
}

@media (max-width: 320px) {
  .prose ul>li:has(> code:first-child) {
    padding-left: 0.25rem;
  }

  .prose ul>li>code:first-child {
    margin-right: 0.15rem;
    margin-left: -0.15rem;
  }
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

h2,
h3 {
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose h2,
.prose h3,
.prose h4 {
  scroll-margin-top: 1.5rem;
}

.toc-bedazzled {
  position: relative;
  overflow: hidden;
  background: url("data:image/svg+xml;utf8,<svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='20' cy='20' r='1.5' fill='%23a5b4fc' opacity='0.6'/><circle cx='10' cy='30' r='1' fill='%23f472b6' opacity='0.4'/><circle cx='30' cy='10' r='1' fill='%23fbbf24' opacity='0.4'/></svg>"),
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
  transform: translateX(-4px);
  font-size: clamp(0.85em, 3.5vw + 0.1em, 1em);
  font-weight: clamp(400, 10vw + 400, 700);
  transition: color 0.2s, transform 0.2s, background-color 0.2s;
}


.toc-bedazzled a:hover {
  transform: translateX(4px);
  background-color: #4f46e5;
  color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toc-bedazzled a.active {
  background: #717ec3;
  color: #1A202C;
  font-weight: bold;
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
  background: url("data:image/svg+xml;utf8,<svg width='320' height='320' viewBox='0 0 64 64' fill='none' xmlns='http://www.w3.org/2000/svg'><rect x='0' y='0' width='32' height='32' fill='%236366f1' fill-opacity='0.6'/><rect x='32' y='32' width='32' height='32' fill='%23fbbf24' fill-opacity='0.5'/><circle cx='48' cy='16' r='10' fill='%23f472b6' fill-opacity='0.3'/><rect x='16' y='48' width='16' height='8' fill='%233b82f6' fill-opacity='0.4'/></svg>") no-repeat center/contain;
}
</style>
