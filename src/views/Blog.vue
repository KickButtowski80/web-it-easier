<template>
  <div class="container mx-auto px-4 py-28">
    <h1 class="text-4xl font-bold mb-8">Blog</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="post in posts" :key="post.slug">
      <router-link 
        :to="'/blog/' + post.slug"
        class="block"
      >
     
        <div class="bg-white rounded-lg shadow-2xl overflow-hidden post-preview hover:shadow-lg transition-shadow
        p-8">
          <h2 class="text-2xl font-bold mb-4" v-html="post.title"></h2>
          <span>{{ post.content.substring(0, 100) }}...</span>
          <div class="text-gray-600 mb-8">
            <span class="mr-4">{{ formatDate(post.date) }}</span>
            <span>{{ post.readingTime }} min read</span>
          </div>
        </div>
        <BlogPost :post="post" />
      </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import BlogPost from '../components/BlogPost.vue';



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
    // Sample data - will be replaced with actual data later
    const posts = ref([{
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
}]);

    // Generate slugs for each post
    // posts.value.forEach(post => {
    //   post.slug = slugify(post.title);
    // });

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
