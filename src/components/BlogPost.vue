<template>
  <div class="container mx-auto px-4 py-24">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-4" v-html="post.title"></h1>
      <div class="text-gray-600 mb-8">
        <span class="mr-4">{{ formatDate(post.date) }}</span>
        <span>{{ post.readingTime }} min read</span>
      </div>

      <!-- Table of Contents -->
      <nav id="table-of-contents" class="mb-8" v-if="toc.length > 0">
        <h2 class="text-lg font-semibold mb-2">Table of Contents</h2>
        <ul class="space-y-1">
          <li v-for="(item, index) in toc" :key="index" 
          :class="{'ml-4': item.level === 'h3',
           'ml-8': item.level === 'h4'}">
            <a 
              :href="`#${item.id}`" 
              class="text-gray-600 hover:text-gray-900 transition-colors"
              :class="{
                'font-semibold': item.level === 'h2',
                'text-sm': item.level === 'h3',
                'text-xs': item.level === 'h4'
              }"
              @click="scrollToSection(item.id)"
            >
              <span v-if="item.level === 'h3'">→ </span>
              <span v-if="item.level === 'h4'">⟶ </span>
              {{ item.text }}
            </a>
          </li>
        </ul>
      </nav>

      <div class="prose prose-lg max-w-none" v-html="renderedContent"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { marked } from "marked";
import { gfmHeadingId, getHeadingList } from "marked-gfm-heading-id";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

// Props
const props = defineProps({
  slug: {
    type: String,
    required: false,
    default: "the-business-impact-of-website-speed",
  },
});

// State
const post = ref({
  title: "The Business Impact of Website Speed",
  date: new Date("2025-04-01"),
  readingTime: 6,
  content: `In today's fast-paced digital world, how quickly your website loads isn't just a technical detail—it directly affects your business success. Let's explore why speed matters and how it can impact your bottom line.

## Why Speed Matters (Free Content)

### Customer Expectations

Today's online visitors are impatient. Research shows that:

- Nearly half of all users expect a webpage to load in 2 seconds or less
- 40% will leave a site that takes more than 3 seconds to load
- For every 1-second delay in loading time, you lose 7% of potential sales

### How Speed Affects Sales

Think of your website speed as the digital equivalent of a store's front door:

\`\`\`
Faster Websites → Better Visitor Experience
                → Visitors Stay Longer
                → More People Buy
\`\`\`

Real-world example: When Walmart made their website faster by just 1 second, they saw a 2% increase in sales.

### Search Engine Rankings

Google and other search engines prefer faster websites. When two websites have similar content, the faster one typically appears higher in search results:

\`\`\`
Faster Website = Higher in Search Results = More Visitors
\`\`\`

### Mobile Users

Most people now browse on phones rather than computers, and mobile users are even more impatient:

- Over half of mobile users leave websites that take more than 3 seconds to load
- Mobile users are 5 times more likely to leave a slow website

## How Slow Websites Cost You Money

Let's look at a simple example:

\`\`\`
If your website gets 10,000 visitors per day
And 2% of them make a purchase (200 people)
With an average purchase of $50
Your daily revenue is $10,000

If your site is just 1 second slower:
Only 1.86% make a purchase (186 people)
Your daily revenue drops to $9,300
That's $700 lost every day
Or $255,500 lost every year
\`\`\`

### Customer Loyalty

Speed doesn't just affect immediate sales—it affects whether customers come back:

- 8 out of 10 shoppers who have a bad experience with website speed say they're less likely to buy from that site again
- Nearly half of all users say waiting for pages to load is their biggest frustration when shopping online

## Simple Ways to Measure Your Website Speed

You don't need to be technical to check your website speed. Use these free tools:

1. Google PageSpeed Insights
2. GTmetrix
3. Pingdom Website Speed Test

These tools will give you a score and suggestions for improvement.

## Our Website Speed Optimization Service (Premium Content)

### What We Offer

Our team of experts can dramatically improve your website's loading speed with our comprehensive optimization service:

#### Standard Development (Included in All Projects)
- Mobile-first responsive design
- Core performance optimizations
- Basic image optimization
- Semantic HTML structure
- Accessibility fundamentals

#### **Performance Packages (Optional Upgrades)**

1. **Essential Optimization** ($299)
   - Advanced image compression
   - Lazy loading implementation
   - Browser caching setup
   - Basic performance audit

2. **Professional Boost** ($599)
   - Everything in Essential
   - CDN configuration
   - Advanced caching strategies
   - Mobile-specific tuning
   - Performance monitoring (30 days)

3. **Enterprise Grade** ($999)
   - Everything in Professional
   - Custom server optimizations
   - Database performance tuning
   - Ongoing speed maintenance
   - Quarterly optimization reviews

### Client Success Stories

Our clients typically see:
- 40-60% reduction in page load times
- 15-30% increase in conversion rates
- 10-25% improvement in search engine rankings

## Conclusion

Website speed isn't just a technical issue—it's a business essential that directly impacts your sales, customer satisfaction, and search rankings. Whether you choose to optimize your site yourself or work with our expert team, improving your website's speed is one of the most cost-effective ways to boost your online business.

*Stay tuned for our next article where we'll discuss common challenges businesses face when scaling their web presence and how to overcome them.*`,
});

// Computed properties
const renderedContent = computed(() => {
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
  return marked(post.value.content);
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
    element.scrollIntoView({ behavior: "smooth" });
  }
}
</script>

<style >
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
pre > code {
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
</style>
