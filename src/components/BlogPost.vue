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
        <nav id="table-of-contents" class="mb-8" v-if="toc.length > 0">
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

/* nav li {
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;
}

nav li.ml-4 {
  margin-left: 1rem;
  position: relative;
}

nav li.ml-8 {
  margin-left: 2rem;
  position: relative;
}

nav li.ml-4::before {
  content: "";
  position: absolute;
  left: -1rem;
  top: 0.7rem;
  width: 0.5rem;
  height: 1px;
  background-color: #d1d5db;
}

nav li.ml-8::before {
  content: "****";
  position: absolute;
  left: -1rem;
  top: 0.7rem;
  width: 0.5rem;
  height: 1px;
  background-color: #d1d5db;
} */

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
</style>
