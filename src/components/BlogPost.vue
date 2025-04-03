<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-4" v-html="post.title"></h1>
      <div class="text-gray-600 mb-8">
        <span class="mr-4">{{ formatDate(post.date) }}</span>
        <span>{{ post.readingTime }} min read</span>
      </div>
      <div class="prose prose-lg max-w-none" v-html="renderedContent"></div>
    </div>
  </div>
</template>

<script>
// import marked from 'marked'
import hljs from 'highlight.js'

export default {
  name: 'BlogPost',
  props: {
    slug: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      post: {
        title: 'Loading...',
        date: '',
        content: '',
        readingTime: 0
      }
    }
  },
  computed: {
    renderedContent() {
      // Configure marked to use highlight.js for code blocks
      marked.setOptions({
        highlight: function(code, lang) {
          return hljs.highlightAuto(code, [lang]).value
        }
      })
      return this.post.content
      // return marked(this.post.content)
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }
}
</script>
