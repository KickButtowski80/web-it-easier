
/**
 * Helper function to format dates consistently throughout the application
 * 
 * @param {Date} date - JavaScript Date object to format
 * @returns {string} Formatted date string (e.g., "May 20, 2025")
 */
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  /**
   * Helper function to create consistent URL slugs from text
   * Used for blog post URLs and other user-facing slugs
   * 
   * @param {string} text - Text to convert to a slug
   * @returns {string} URL-friendly slug
   */
  const titleToSlug = (text) => {
    if (!text) return '';
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
  
function showNotify(message, type = 'info', icon = '') {
  notificationMessage.value = message
  notificationType.value = type
  notificationIcon.value = icon
  showNotification.value = true
}
  // Export utility functions for use in other modules
  export { formatDate, titleToSlug, showNotify };