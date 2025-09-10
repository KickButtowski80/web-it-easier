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
        <div :id="'post-meta-' + post.id" class="text-gray-700 dark:text-gray-400 mb-8 text-base">
          <time :datetime="new Date(post.date).toISOString()" class="mr-4">
            {{ formatDate(post.date) }}
          </time>
          <span>{{ post.readingTime }} min read</span>
        </div>

        <!-- Table of Contents -->
        <nav id="table-of-contents" :class="['mb-8 toc-bedazzled', { 'toc-open': tocOpen }]" v-if="toc.length > 0"
          aria-label="Table of Contents" @keydown.arrow-up.prevent="handleTocNav($event, 'up')"
          @keydown.arrow-down.prevent="handleTocNav($event, 'down')"
          @keydown.home.prevent="handleTocNav($event, 'home')" @keydown.end.prevent="handleTocNav($event, 'end')"
          @keydown.esc="toggleToc">

          <h2 id="toc-heading" class="text-lg font-semibold mb-2 text-gray-900
           dark:text-gray-200 flex justify-center sm:justify-start">
            <button type="button" class="cursor-pointer select-none inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                     bg-indigo-800 text-white shadow-sm transition-colors transition-shadow duration-200
                     hover:bg-indigo-900 hover:shadow-md
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                     focus-visible:ring-indigo-600 focus-visible:ring-offset-white
                     dark:focus-visible:ring-offset-slate-900" :aria-expanded="tocOpen" aria-controls="toc-body"
              @click="toggleToc" @keydown.space.enter.prevent="toggleToc"
              :aria-label="tocOpen ? 'Collapse table of contents' : 'Expand table of contents'">
              Table of Contents
              <span class="ml-1 text-sm transition-transform duration-200 inline-block"
                :class="{ 'transform rotate-180': tocOpen }" aria-hidden="true">
                ▼
              </span>
            </button>
          </h2>

          <transition name="toc-slide">
            <ul id="toc-body" class="space-y-1 toc-body" v-show="tocOpen" aria-label="Sections">

              <li v-for="(item, index) in toc" :key="index" :class="{
                'ml-4': item.level === 'h3',
                'ml-8': item.level === 'h4'
              }">

                <a :id="'toc-item-' + item.id" :href="'#' + item.id" @click="handleTocClick"
                  class="toc-link block py-1 px-2 -mx-2 rounded-md" :class="{
                    'font-semibold': item.level === 'h2',
                    'text-base': item.level === 'h3',
                    'text-sm': item.level === 'h4',
                    'pl-3': item.level === 'h2',
                    'pl-2': item.level === 'h3',
                    'pl-1': item.level === 'h4',
                    'toc-link--active': activeId === item.id
                  }" :aria-label="'Jump to ' + item.text + ' section'"
                  :aria-current="activeId === item.id ? 'location' : undefined" :tabindex="tocOpen ? 0 : -1">

                  <span v-if="item.level === 'h3'" aria-hidden="true">→ </span>
                  <span v-else-if="item.level === 'h4'" aria-hidden="true">⟶ </span>
                  {{ item.text }}

                  <span v-if="activeId === item.id" class="sr-only">(current section)</span>

                </a>
              </li>
            </ul>
          </transition>
        </nav>

        <!-- Main content container with prose styling
          - Uses direct CSS selectors (no :deep) because:
            1. v-html content renders as direct children
            2. No component boundaries to cross
            3. Styles apply directly to rendered markdown
          - ID 'post-content' provides styling hook
          - 'prose' class applies Tailwind typography
          - 'whitespace-pre-wrap' preserves formatting
        -->
        <div id="post-content" class="prose prose-lg dark:prose-invert max-w-none whitespace-pre-wrap tab-size-4"
          v-html="renderedContent">
        </div>
      </article>
      <div v-else class="text-center py-12" role="status" aria-live="polite" aria-busy="true" aria-atomic="true">
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
import { ref, computed, onMounted, onUnmounted, onBeforeUnmount, nextTick, watch } from 'vue';
import { getPost } from '@/config/firebase';
import {
  injectBlogPostStructuredData,
  removeStructuredData,
  injectTocJsonLd
} from '@/utils/json-ld-structured-data';
import { titleToSlug, useNotification } from '@/utils/helpers';
import { renderMarkdown } from '@/utils/markdown';
import { updateCanonicalUrl, restoreCanonical } from '@/utils/seo-update-canonical-url';
import Notification from '@/components/UI/Notification.vue';
import { formatDate } from '@/utils/helpers';
import "highlight.js/styles/github.css";
import { updateMetaDescriptions, updateMetaSocialTags } from '@/utils/seo-update-description';
import useScrollSpy from '@/composables/useScrollSpy';

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
const hasScrolledToHash = ref(false);
const post = ref(null);
const defaultCanonical = ref(null);
// Store default meta descriptions to restore on unmount
const defaultMetaDescriptions = ref({
  description: null,
  og: null,
  twitter: null,
});

// Mobile TOC drawer state (no visual change)
const tocOpen = ref(false);
const toggleToc = () => {
  const wasOpen = tocOpen.value;
  tocOpen.value = !wasOpen;

  nextTick(() => {
    if (tocOpen.value) {
      // Focus first item when opening
      const firstItem = document.querySelector('#toc-body a[tabindex="0"]');
      if (firstItem) firstItem.focus();
    } else if (wasOpen) {
      // Focus toggle button when closing
      const toggleButton = document.querySelector('#toc-heading button');
      if (toggleButton) toggleButton.focus();
    }
  });
};


// Handle keyboard navigation in TOC
const handleTocNav = (event, direction) => {
  if (!tocOpen.value) return;

  const items = Array.from(document.querySelectorAll('#toc-body a[tabindex="0"]'));
  if (!items.length) return;

  // Only proceed if we have an activeId that exists in the TOC
  if (!activeId.value) return;
  // Find current active element by activeId
  const currentItem =
    items.find(item => item.getAttribute('href') === `#${activeId.value}`)


  const currentIndex = currentItem ? items.indexOf(currentItem) : 0;
  let nextIndex = currentIndex;

  switch (direction) {
    case 'up':
      nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      break;
    case 'down':
      nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      break;
    case 'home':
      nextIndex = 0;
      break;
    case 'end':
      nextIndex = items.length - 1;
      break;
  }

  if (nextIndex >= 0 && nextIndex < items.length) {
    const id = items[nextIndex].getAttribute('href')?.substring(1);
    if (id) activeId.value = id;
    items[nextIndex].focus();

  }
};
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

    // Update the canonical URL using the shared utility with our generated URL
    console.log('Calling updateCanonicalUrl() with URL:', canonicalUrl.value);
    const result = updateCanonicalUrl(canonicalUrl.value);

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
/**
 * Calculates the vertical scroll position needed to properly align an element
 * below fixed navigation elements (header and table of contents).
 * 
 * @param {HTMLElement} element - The target DOM element to scroll into view
 * @returns {number} The vertical scroll position (in pixels) that will position the element
 *                   below fixed headers with appropriate spacing
 * 
 * @example
 * // Scroll to a section when clicking a TOC item
 * const section = document.getElementById('section-1');
 * const offset = calculateScrollOffset(section);
 * window.scrollTo({ top: offset, behavior: 'smooth' });
 * 
 * @note This function accounts for:
 * - Fixed header/navbar height
 * - Table of contents height (if present)
 * - Additional 20px padding for visual spacing
 */
const calculateScrollOffset = (element) => {
  const isMobile = window.innerWidth < 768;
  const elements = [];
  let totalOffset = 0;

  // 1. Check for the main header (matching TopMenu.vue)
  const header = document.querySelector('section.fixed.top-0');
  if (header) {
    const style = window.getComputedStyle(header);
    const position = style.position;
    const height = header.offsetHeight;
    if ((position === 'fixed' || position === 'sticky') && height > 0) {
      elements.push({ name: 'header', height });
      totalOffset += height;
    }
  }

  // 2. Check for the Table of Contents
  const toc = document.getElementById('table-of-contents');
  if (toc) {
    const tocStyle = window.getComputedStyle(toc);
    const position = tocStyle.position;
    const height = toc.offsetHeight;
    if ((position === 'fixed' || position === 'sticky') && height > 0) {
      elements.push({ name: 'toc', height });
      totalOffset += height;
    }
  }

  // 3. Calculate positions
  const elementPosition = element.getBoundingClientRect().top + window.scrollY;
  const padding = isMobile ? 10 : 20;
  return elementPosition - totalOffset - padding;

};


onMounted(async () => {
  // Initialize default canonical URL
  const defaultCanonicalEl = document.querySelector('link[rel="canonical"]');
  if (defaultCanonicalEl) {
    defaultCanonical.value = defaultCanonicalEl.outerHTML;
  }

  // Capture current meta descriptions to restore later
  const descTag = document.querySelector('meta[name="description"]');
  const ogDescTag = document.querySelector('meta[property="og:description"]');
  const twDescTag = document.querySelector('meta[property="twitter:description"]');
  defaultMetaDescriptions.value.description = descTag?.getAttribute('content') || null;
  defaultMetaDescriptions.value.og = ogDescTag?.getAttribute('content') || null;
  defaultMetaDescriptions.value.twitter = twDescTag?.getAttribute('content') || null;

  const title = deslugify(props.slug);
  try {
    const postData = await getPost(title);
    if (postData) {
      post.value = postData;
      // Set dynamic page title based on post content (SEO)
      if (post.value?.title) {
        const pageTitle = `${post.value.title} | Web It Easier`;
        document.title = pageTitle;
      } else {
        document.title = "Blog Post | Web It Easier";
      }
      await updateCanonicalTag();

      // Update OG/Twitter meta title and URL to match the page
      updateMetaSocialTags(
        post.value?.title ? `${post.value.title} | Web It Easier` : document.title,
        canonicalUrl.value || window.location.href,
        'article', // Use 'article' type for blog posts
        post.value?.description || '' // Pass description or empty string
      );

      // Initialize structured data after content is loaded
      updateStructuredData();

      // Generate and apply per-post meta description (no UI summary)
      const description = (() => {
        // Prefer explicit description if provided
        if (post.value?.description && typeof post.value.description === 'string') {
          return post.value.description.trim();
        }
        // Fallback: derive from first paragraph of raw markdown (faster, no DOM parsing)
        try {
          const md = String(post.value?.content || '');
          // First non-empty block (split by blank lines)
          const firstBlock = (md.split(/\n\s*\n/).find(b => b.trim().length) || md).trim();
          // Strip common markdown syntax
          let text = firstBlock
            .replace(/^```[\s\S]*?```/gm, '')        // fenced code blocks
            .replace(/`[^`]*`/g, '')                   // inline code
            .replace(/^#+\s+/gm, '')                  // headings
            .replace(/!\[[^\]]*\]\([^)]*\)/g, '')  // images
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1') // links -> keep link text
            .replace(/^[>\-*+\s]+/gm, '')            // blockquotes/lists markers
            .replace(/\[!\w+\]/gi, '')               // callout labels like [!INFO], [!WARNING], etc.
            .replace(/[*_~#]/g, '')                    // emphasis markers
            .replace(/\s+/g, ' ')                     // collapse whitespace
            .trim();
          if (!text) return '';
          // Limit to ~160-180 chars, avoid cutting words
          const limit = 180;
          if (text.length > limit) {
            let slice = text.slice(0, limit);
            const lastSpace = slice.lastIndexOf(' ');
            slice = (lastSpace > 120 ? slice.slice(0, lastSpace) : slice).trim();
            text = slice + '…';
          }
          return text;
        } catch (e) {
          return '';
        }
      })();

      if (description) {
        updateMetaDescriptions(description);
      }

      // Inject Article JSON-LD structured data for the blog post
      injectBlogPostStructuredData(
        {
          title: post.value?.title,
          excerpt: description,
          publishedAt: post.value?.date,
          dateModified: post.value?.date,
        },
        canonicalUrl.value
      );

      // Start scroll spy with hash navigation enabled
      startScrollSpy();
      
      // Handle initial hash scroll after content is rendered
      if (window.location.hash && !hasScrolledToHash.value) {
        scrollToHash();
        hasScrolledToHash.value = true;
      }
    }
  } catch (error) {
    console.error('Error fetching post:', error);
    showNotify('Failed to load post. Please try again.', 'error');
  }
});

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

const updateStructuredData = () => {
  if (toc.value?.length) {
    injectTocJsonLd(toc.value);
  }
}

const programmaticScrollTo = (id) => {
  const el = document.getElementById(id);
  if (!el) return;

  // Update URL hash without scrolling
  window.history.replaceState({}, '', `#${id}`);

  // Update active ID immediately
  activeId.value = id;

  // Calculate the offset position
  const offsetPosition = calculateScrollOffset(el);

  // Scroll to the calculated position
  window.scrollTo({
    top: Math.max(0, offsetPosition), // Ensure we don't get negative values
    behavior: 'smooth'
  });
};

const handleTocClick = async (e) => {
  // Prevent default immediately to avoid any native behavior
  e.preventDefault();
  e.stopPropagation();

  // Get the href and extract the ID
  const href = e.currentTarget.getAttribute('href');
  if (!href || !href.startsWith('#')) {
    console.error('Invalid href on TOC link:', href);
    return;
  }

  const id = href.slice(1);

  // Close the TOC drawer first (for mobile)
  if (tocOpen.value) {
    tocOpen.value = false;
    // Small delay to allow the TOC to start closing
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  // Then scroll to the section
  programmaticScrollTo(id);

  // Ensure focus is set to the target element for accessibility
  const targetElement = document.getElementById(id);
  if (targetElement) {
    targetElement.setAttribute('tabindex', '-1');
    targetElement.focus({ preventScroll: true });
  }
};

const scrollToHash = () => {
  const hash = window.location.hash.slice(1);
  if (hash) {
    programmaticScrollTo(hash);
  }
};


// Watch toc changes and update structured data
watch(toc, (newToc) => {
  console.log('TOC items:', newToc.map(item => ({
    id: item.id,
    text: item.text,
    level: item.level
  })))
  if (newToc?.length) {
    injectTocJsonLd(newToc);
  }
})

// // Global flag to prevent scroll spy updates during programmatic scrolling
// let isProgrammaticScroll = false;

// Initialize scroll spy for TOC
const scrollSpy = useScrollSpy({
  contentRoot: '#post-content',
  headingSelector: 'h2, h3, h4',
  offset: 96,
  autoStart: false
});

const { activeId, start: startScrollSpy, stop: stopScrollSpy } = scrollSpy;

 


// Clean up canonical tag when component is unmounted
onUnmounted(() => {
  // Remove all JSON-LD structured data
  removeStructuredData('all');

  // Restore canonical URL using utility function
  restoreCanonical(defaultCanonical.value);

  // Restore original meta descriptions
  try {
    const ensureTag = (selector, attrs) => {
      let el = document.head.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        Object.entries(attrs).forEach(([k, v]) => (el.setAttribute(k, v)));
        document.head.appendChild(el);
      }
      return el;
    };
    if (defaultMetaDescriptions.value.description !== null) {
      const el = ensureTag('meta[name="description"]', { name: 'description' });
      el.setAttribute('content', defaultMetaDescriptions.value.description);
    }
    if (defaultMetaDescriptions.value.og !== null) {
      const el = ensureTag('meta[property="og:description"]', { property: 'og:description' });
      el.setAttribute('content', defaultMetaDescriptions.value.og);
    }
    if (defaultMetaDescriptions.value.twitter !== null) {
      const el = ensureTag('meta[property="twitter:description"]', { property: 'twitter:description' });
      el.setAttribute('content', defaultMetaDescriptions.value.twitter);
    }
  } catch (e) {
    // noop
  }
});

function deslugify(slug) {
  return slug.replace(/-/g, ' ');
}

</script>
<!-- Externalized styles -->
<style src="@/styles/toc.css"></style>
<style src="@/styles/callouts.css"></style>
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
  margin: 2rem 0 1rem;
  padding: 1.5rem 1.5rem 3rem;
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

#post-content h2+h3 {
  margin-top: 2.5rem;
}


#post-content h3 {
  font-size: clamp(1.5rem, 4vw, 1.5rem);
  font-weight: 700;
  color: #1e40af;
  margin: 1.75rem 0 0.9rem;
  padding: 1.5rem 1rem 2rem;
  display: inline-block;
  box-sizing: border-box;
  position: relative;
  background-color: rgba(37, 99, 235, 0.05);
  border-left: 4px solid #3b82f6;
  border-radius: 0 4px 4px 0;
  width: 100%;
  max-width: 100%;

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

#post-content p {
  margin: 1.25em 0;
  line-height: 1.7;
  color: #2d3748;
  font-size: 1.125rem;
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

/* Prevent cascading resets to child elements */
#post-content.prose blockquote p * {
  all: revert;
}

#post-content.prose blockquote cite {
  display: block;
  margin-top: 0.75rem;
  font-size: 0.9em;
  color: #6b7280;
  font-style: normal;
  font-weight: 500;
}

#post-content.prose blockquote cite::before {
  content: '\2014\00A0';
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
  transition: transform 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
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
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  transform: translateY(-2px);
}

#post-content blockquote p {
  position: relative;
  margin: 0.5rem 0;
  font-size: 1.1em;
  font-weight: 450;
  line-height: 1.6;
  color: #1f2937;
  z-index: 2;
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

/* Dark mode support */
.dark #post-content blockquote {
  background: #1e293b;
  color: #e2e8f0;
  border-left-color: #60a5fa;
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
  padding: 1.25rem 1.5rem 0.75rem 3rem;
  /* Increased padding for custom marker */
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
#post-content h4:has(+ ol)::before {
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
  left: 0.8rem;
  /* Slight adjustment to compensate for rotation */
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
#post-content p+ul,
#post-content p+ol,
#post-content h4+ul,
#post-content h4+ol {
  margin-top: 0;
  padding: 0.25rem 1.5rem 1.25rem 3rem;
  background: rgba(249, 250, 251, 0.9);
  border-radius: 0 0 0.5rem 0.5rem;
  border-left: 3px solid #3b82f6;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* Table Styling */
#post-content {
  margin: 2rem 0;
  max-width: 100%;
  width: 100%;
}

/* Images: auto-center and constrain width */
#post-content img {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 1.25rem auto;
  /* centers and adds vertical rhythm */
}

/* Ensure linked images are still centered (common in Markdown) */
#post-content a>img {
  display: block;
}

/* Mobile-first: Card layout */
#post-content table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95em;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  margin: 0 auto;
  display: block;
}

/* Default table styles for larger screens */
@media (min-width: 768px) {
  #post-content table {
    display: table;
    border-collapse: separate;
    border-spacing: 0;
  }
}

/* Mobile card layout */
@media (max-width: 767px) {

  #post-content table,
  #post-content thead,
  #post-content tbody,
  #post-content th,
  #post-content td,
  #post-content tr {
    display: block;
  }

  #post-content thead,
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  #post-content tr {
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    padding: 0.5rem;
  }

  #post-content td {
    border: none;
    border-bottom: 1px solid #e2e8f0;
    position: relative;
    padding-left: 50%;
    white-space: normal;
    text-align: left;
  }

  #post-content td::before {
    content: attr(data-label);
    position: absolute;
    left: 0.5rem;
    width: 45%;
    padding-right: 1rem;
    white-space: nowrap;
    font-weight: 600;
    color: #4a5568;
  }

  #post-content td:last-child {
    border-bottom: 0;
  }
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
.dark #post-content p+ul,
.dark #post-content p+ol,
.dark #post-content h4+ul,
.dark #post-content h4+ol {
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

/* Improve syntax readability in dark mode (override light GitHub theme tokens) */
.dark #post-content pre {
  background-color: #0b1220;
  /* deeper dark for contrast */
  color: #e5e7eb;
  /* base foreground */
}

.dark #post-content pre .hljs {
  background: transparent;
  color: #e5e7eb;
  /* default text */
}

/* Token colors tuned for dark background */
.dark #post-content pre .hljs-comment,
.dark #post-content pre .hljs-quote {
  color: #9ca3af;
  /* gray-400 */
  font-style: italic;
}

.dark #post-content pre .hljs-keyword,
.dark #post-content pre .hljs-selector-tag,
.dark #post-content pre .hljs-literal,
.dark #post-content pre .hljs-built_in,
.dark #post-content pre .hljs-type {
  color: #93c5fd;
  /* blue-300 */
}

.dark #post-content pre .hljs-string,
.dark #post-content pre .hljs-symbol,
.dark #post-content pre .hljs-bullet,
.dark #post-content pre .hljs-addition {
  color: #86efac;
  /* green-300 */
}

.dark #post-content pre .hljs-number,
.dark #post-content pre .hljs-attr,
.dark #post-content pre .hljs-attribute,
.dark #post-content pre .hljs-template-variable,
.dark #post-content pre .hljs-variable {
  color: #fde68a;
  /* amber-200 */
}

.dark #post-content pre .hljs-title,
.dark #post-content pre .hljs-section,
.dark #post-content pre .hljs-selector-id,
.dark #post-content pre .hljs-selector-class {
  color: #c4b5fd;
  /* violet-300 */
}

.dark #post-content pre .hljs-name,
.dark #post-content pre .hljs-tag,
.dark #post-content pre .hljs-meta {
  color: #fca5a5;
  /* red-300 */
}

/* Selection inside code blocks in dark mode */
.dark #post-content pre ::selection {
  background: rgba(96, 165, 250, 0.25);
  /* blue-400/25 */
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
  padding: 1rem 0 1.5rem 1.5rem;
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
  padding: 0.15em 0.35em;
  display: inline;
  vertical-align: baseline;
  font-family: 'Fira Code', 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: clamp(0.9em, 0.6vw + 0.85em, 1em);
  border-radius: 0.25rem;
  line-height: inherit;
  word-break: break-word;
}


@media (hover: none) {
  .prose code {
    padding: 0.2em 0.45em;
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

/* Dark mode overrides for stronger contrast */
@media (prefers-color-scheme: dark) {
  .prose h1 {
    color: #1a1818;
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
    background-color: rgba(59, 130, 246, 0.18);
    /* slightly stronger for dark */
  }

  /* Blockquote contrast in dark mode */
  #post-content.prose blockquote {
    border-left: 4px solid #374151;
    /* gray-700 */
    color: #d1d5db;
    /* gray-300 */
  }

  /* Inline code contrast in dark mode */
  #post-content.prose code {
    color: #93c5fd;
    /* blue-300 */
    background-color: rgba(59, 130, 246, 0.18);
    border-color: rgba(59, 130, 246, 0.35);
  }

  /* Base code block background lift for dark mode (keep hljs theme intact) */
  pre {
    background-color: rgba(17, 24, 39, 0.6);
    /* gray-900 w/ translucency */
  }
}

/* Navigation styles - keeping only essential nav styles */
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
  text-decoration: none;
}

/* Base heading styles */
h2,
h3 {
  margin-top: 2rem;
  margin-bottom: 1rem;
}

/* Navbar height variable for consistent offsets across TOC sticky and anchor landing */
:root {
  --navbar-height: 3rem;
}

@media (min-width: 768px) {
  :root {
    --navbar-height: 6rem;
  }
}

/* Make sure the TOC content doesn't cause horizontal scroll */
.toc-body {
  max-width: 100%;
  overflow-x: hidden;
}

/* Ensure TOC links don't break layout */
#table-of-contents a {
  word-break: break-word;
  overflow-wrap: break-word;
}
</style>
