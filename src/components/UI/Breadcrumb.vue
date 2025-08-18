<template>
  <!--
    Breadcrumb navigation component
    - Sticky, horizontally scrollable bar for mobile friendliness
    - Includes schema.org BreadcrumbList microdata for SEO
    - Accessible: uses <nav aria-label="Breadcrumb"> and marks current page with aria-current
    Usage example:
      <Breadcrumb
        :items="[
          { name: 'Home', to: '/' },
          { name: 'Blog', to: '/blog' }
        ]"
        current="Post title"
      />
    Rationale:
    - Main reason: current IA has no depth (no multi-level hierarchy), so breadcrumbs add little value.
    - Currently not rendered in the app to reduce UI noise on posts.
    - Kept as a documented, reusable component for future deep navigation (e.g., categories/tags or multi-level pages).
    - Provides schema.org microdata; can be reintroduced quickly or leveraged for JSON-LD-only SEO.
  -->
  <nav
    class="sticky top-[8rem] z-40 w-full bg-white/85 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200/60 dark:border-gray-700/50"
    aria-label="Breadcrumb"
    itemscope
    itemtype="https://schema.org/BreadcrumbList"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ol class="flex items-center gap-2 py-3 text-sm overflow-x-auto whitespace-nowrap">
        <li
          v-for="(item, index) in items"
          :key="item.name"
          class="flex items-center"
          itemprop="itemListElement"
          itemscope
          itemtype="https://schema.org/ListItem"
        >
          <RouterLink
            :to="item.to"
            class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            itemprop="item"
          >
            <span itemprop="name">{{ item.name }}</span>
          </RouterLink>
          <meta itemprop="position" :content="String(index + 1)" />
          <span v-if="index < items.length - 1 || current" class="mx-2 text-gray-400 dark:text-gray-500">/</span>
        </li>
        <li
          v-if="current"
          class="text-gray-900 dark:text-white font-medium truncate max-w-[60vw] md:max-w-md"
          itemprop="itemListElement"
          itemscope
          itemtype="https://schema.org/ListItem"
          aria-current="page"
        >
          <span itemprop="name">{{ current }}</span>
          <meta itemprop="position" :content="String(items.length + 1)" />
        </li>
      </ol>
    </div>
  </nav>
</template>

<script setup>
/**
 * Breadcrumb.vue
 *
 * Purpose
 * - Display hierarchical navigation with SEO-friendly microdata.
 * - Optimized for mobile (sticky + horizontal scroll when overflowing).
 *
 * Props
 * - items: Array<{ name: string; to: string }>
 *   Required. The trail items before the current page.
 * - current: string (optional)
 *   The label of the current page. When provided, it is rendered as the last, non-link crumb with aria-current="page".
 *
 * Example
 * ```vue
 * <Breadcrumb
 *   :items="[
 *     { name: 'Home', to: '/' },
 *     { name: 'Blog', to: '/blog' }
 *   ]"
 *   current="My Post"
 * />
 * ```
 *
 * Rationale
 * - Main reason: current Information Architecture has no depth (no multi-level hierarchy), so breadcrumbs add little value.
 * - Not currently used in UI to keep blog pages focused and uncluttered.
 * - Retained for quick reuse on deeper IA pages and for SEO-friendly structured data.
 * - Safe to remove if the project decides against breadcrumbs entirely.
 *
 * Notes
 * - Renders schema.org BreadcrumbList/ListItem microdata for better snippet eligibility.
 * - Keep the bar near the top to avoid layout shift, and ensure sufficient color contrast in dark mode.
 */
defineProps({
  items: {
    type: Array,
    required: true,
    // [{ name: 'Home', to: '/' }, { name: 'Blog', to: '/blog' }]
  },
  current: {
    type: String,
    required: false,
    default: '',
  },
});
</script>

