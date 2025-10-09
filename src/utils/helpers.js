import { ref } from 'vue';
/**
 * Normalize various date representations into a native `Date` instance.
 *
 * ### Supported inputs
 * - Native `Date` objects (`new Date('2025-06-22')`)
 * - Firestore `Timestamp` objects (`{ seconds: 1733548800, nanoseconds: 0 }`)
 * - Values exposing `toDate()` (e.g., Firestore Timestamp class)
 * - UNIX epoch **seconds** (e.g., `1733548800`)
 * - UNIX epoch **milliseconds** (e.g., `1733548800000`)
 * - ISO 8601 strings (`'2025-06-22T00:00:00Z'`)
 * - Numeric strings (`'1733548800'`, `'1733548800000'`)
 *
 * ### Return value
 * - Returns a valid `Date` when the input can be parsed
 * - Returns `null` if the input is falsy or cannot be interpreted as a date
 *
 * @example
 * toDate('2025-06-22');            // -> Date('2025-06-22T00:00:00Z')
 * toDate(1733548800);              // -> Date('2025-12-07T00:00:00Z') (seconds -> ms)
 * toDate({ seconds: 1733548800 }); // -> Date('2025-12-07T00:00:00Z')
 * toDate(firestoreTimestamp);      // -> Date instance via timestamp.toDate()
 * toDate('not-a-date');            // -> null
 *
 * @param {unknown} value - Date-like input to normalize
 * @returns {Date|null} A valid `Date` or null when the value cannot be parsed
 */
const toDate = (value) => {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'number') {
    const normalized = value < 1e12 ? value * 1000 : value;
    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const numeric = Number(trimmed);
    if (!Number.isNaN(numeric)) {
      return toDate(numeric);
    }

    const date = new Date(trimmed);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === 'object') {
    if (typeof value.toDate === 'function') {
      return toDate(value.toDate());
    }

    if ('seconds' in value || 'nanoseconds' in value) {
      const seconds = Number(value.seconds ?? 0);
      const nanos = Number(value.nanoseconds ?? 0);
      return toDate(seconds * 1000 + nanos / 1e6);
    }
  }

  return null;
};

/**
 * Format a date-like value consistently across the application.
 * Accepts Date objects, strings, numbers (ms or seconds), and Firestore timestamps.
 *
 * @param {unknown} value - The date-like value to format
 * @param {Intl.DateTimeFormatOptions} [options] - Override default formatting
 * @returns {string} Formatted date string or 'Invalid date' when parsing fails
 */
const formatDate = (value, options = { year: 'numeric', month: 'short', day: 'numeric' }) => {
  const date = toDate(value);
  if (!date) {
    return 'Invalid date';
  }

  try {
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('formatDate failed for value:', value, error);
    return 'Invalid date';
  }
};
  


const formatDateISO = (dateString) => {
  const date = toDate(dateString);
  return date ? date.toISOString().split('T')[0] : '';
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
  export { formatDate, formatDateISO, titleToSlug, useNotification };