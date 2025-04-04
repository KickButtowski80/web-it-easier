<template>
  <div class="container mx-auto px-4 py-28">
    <h1 class="text-4xl font-bold mb-8">Blog</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="post in posts" :key="post.slug" class="bg-white rounded-lg shadow-md overflow-hidden">
        <router-link :to="`/blog/${post.slug}`" class="block">
          <div class="p-6">
            <h2 class="text-2xl font-semibold mb-2" v-html="post.title"></h2>
            <p class="text-gray-600 mb-4">{{ formatDate(post.date) }}</p>
            <p class="text-gray-700">{{ post.excerpt }}</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Blog',
  data() {
    return {
      posts: [
        // This will be replaced with actual data later
        {
          slug: 'first-post',
          title: 'First Blog Post',
          date: '2025-04-02',
          excerpt: 'This is the first blog post excerpt',
          content: ''
        }
      ]
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
