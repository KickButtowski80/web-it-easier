import { ref } from 'vue';
/**
 * Helper function to format dates consistently throughout the application
 * 
 * @param {Date} date - JavaScript Date object to format
 * @returns {string} Formatted date string (e.g., "May 20, 2025")
 */
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    });
  };
  
  const generateSlugFallback = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  };

  /**
   * Helper function to create consistent URL slugs from text.
   * Removes whitespace/non-word characters and falls back to
   * a UUID-derived slug if the sanitized value is empty
   * (e.g., emoji-only titles). Used for blog post URLs and other
   * user-facing slugs.
   * 
   * @param {string} text - Text to convert to a slug
   * @returns {string} URL-friendly slug (or UUID fallback)
   */
  const titleToSlug = (text) => {
    if (!text) return '';
    const base = text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[\W_]+/g, '-')
      .replace(/\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
    return base || generateSlugFallback();
  };
// Add a notification composable
 function useNotification() {
  const showNotification = ref(false);
  const notificationMessage = ref('');
  const notificationType = ref('info');
  const notificationIcon = ref('');
  
  function showNotify(message, type = 'info', icon = '') {
    notificationMessage.value = message;
    notificationType.value = type;
    notificationIcon.value = icon;
    showNotification.value = true;
  }
  
  return {
    showNotification,
    notificationMessage,
    notificationType,
    notificationIcon,
    showNotify
  };
}
  // Export utility functions for use in other modules
  export { formatDate, titleToSlug, useNotification };