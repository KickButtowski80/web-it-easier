<template>
  <div class="container mx-auto px-4 py-24">
    <div class="max-w-4xl mx-auto">
      <div v-if="post">
        <h1 class="text-4xl font-bold mb-4" v-html="post.title"></h1>
        <div class="text-gray-600 mb-8">
          <span class="mr-4">{{ formatDate(post.date) }}</span>
          <span>{{ post.readingTime }} min read</span>
        </div>

        <!-- Table of Contents -->
        <nav id="table-of-contents" class="mb-8 toc-bedazzled" v-if="toc.length > 0">
          <h2 class="text-lg font-semibold mb-2">Table of Contents</h2>
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

        <div class="prose prose-lg max-w-none" v-html="renderedContent"></div>
      </div>
      <div v-else class="text-center py-12">
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { marked } from "marked";
import { gfmHeadingId } from "marked-gfm-heading-id";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import { getPost } from "../config/firebase";
import DOMPurify from "dompurify";

// Props
const props = defineProps({
  slug: {
    type: String,
    required: false,
  },
});

const post = ref(null);

onMounted(async () => {
  const title = deslugify(props.slug);
  post.value = await getPost(title);
});

function deslugify(slug) {
  return slug.replace(/-/g, ' ');
}
// Computed properties
const renderedContent = computed(() => {
  if (!post.value || !post.value.content) return "";
  // Configure marked to use highlight.js for code blocks
  marked.setOptions({
    highlight: function (code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return hljs.highlightAuto(code).value;
    },
    breaks: true,
    gfm: true,
    langPrefix: "language-none",
  });
  marked.use(gfmHeadingId());
  return DOMPurify.sanitize(marked(post.value.content));
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

.prose code {
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
    linear-gradient(135deg, rgba(255,255,255,0.85) 70%, rgba(199,210,254,0.7) 100%);
  background-blend-mode: overlay;
  border-radius: 1rem;
  border: 2px solid #a5b4fc;
  box-shadow: 0 8px 24px 0 rgba(59,130,246,0.09);
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
  background: rgba(255,255,255,0.4);
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
