<template>
  <div class="container mx-auto px-4 py-28">
    <h1 class="text-4xl font-bold mb-8">Blog</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="post in posts" :key="post.slug">
        <router-link :to="'/blog/' + post.slug" class="block">

          <div class="bg-white rounded-lg shadow-2xl overflow-hidden post-preview hover:shadow-lg transition-shadow
        p-8">
            <h2 class="text-2xl font-bold mb-4" v-html="post.title"></h2>
            <span>{{ post.content.substring(0, 100) }}...</span>
            <div class="text-gray-600 mb-8">
              <span class="mr-4">{{ formatDate(post.date) }}</span>
              <span>{{ post.readingTime }} min read</span>
            </div>
          </div>

        </router-link>
      </div>
    </div>
  </div>
</template>

<script>

import { getPosts } from '../config/firebase'
import { ref, onMounted } from 'vue'
// Helper function to create slugs from titles
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[\W_]+/g, '-') // Replace non-word characters with hyphens
    .replace(/\-+/g, '-') // Replace multiple hyphens with a single hyphen
    .replace(/^-+/, '') // Remove leading hyphens
    .replace(/-+$/, ''); // Remove trailing hyphens
};

export default {
  setup() {
    const posts = ref([])
    onMounted(async () => {
      posts.value = await getPosts()
    })
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    return {
      posts,
      formatDate,
    };
  }
};
</script>
