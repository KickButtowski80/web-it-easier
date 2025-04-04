<template>
  <div class="container mx-auto px-4 py-28">
    <h1 class="text-4xl font-bold mb-8">Blog</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="post in posts" :key="post.slug" 
      class="bg-white rounded-lg shadow-2xl overflow-hidden post-preview">
        <router-link :to="`/blog/${post.slug}`" class="block post-link">
          <div class="p-6">
            <h2 class="text-2xl font-semibold mb-2" v-html="post.title"></h2>
            <p class="text-gray-600 mb-4 post-date">{{ formatDate(post.date) }}</p>
            <p class="text-gray-700 post-excerpt">{{ post.excerpt }}</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    // Sample data - will be replaced with actual data later
    const posts = ref([
      {
        slug: 'first-post',
        title: 'The Business Impact of Website Speed',
        date: '2025-04-01',
        excerpt: 'In today\'s fast-paced digital world, how quickly your website loads isn\'t just a technical detail—it directly affects your business success. Let\'s explore why speed matters and how it can impact your bottom line.'
      }
    ]);

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

