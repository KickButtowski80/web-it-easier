/**
 * Tag Normalizer Utility
 * 
 * Provides consistent tag normalization with support for:
 * - Common abbreviations (e.g., 'js' → 'javascript')
 * - Framework variations (e.g., 'nextjs' → 'nextjs')
 * - Version number stripping (e.g., 'python3.9' → 'python')
 * - Pattern-based normalization (e.g., 'vue.js' → 'vue')
 */

/**
 * TagNormalizer - Normalizes and standardizes tags
 */
class TagNormalizer {
  constructor() {
    // Cache for storing normalized tags to avoid redundant processing
    this.normalizedTagCache = new Map();
    
    // Maps tag aliases to their canonical forms, organized by categories for easier maintenance
    this.tagAliasMap = new Map([
      // Programming Languages
      ['js', 'javascript'],
      ['ts', 'typescript'],
      ['py', 'python'],
      ['rb', 'ruby'],
      ['cs', 'csharp'],
      ['c#', 'csharp'],
      ['cpp', 'cpp'],
      ['c++', 'cpp'],
      ['go', 'golang'],
      
      // Web Frameworks
      ['vuejs', 'vue'],
      ['reactjs', 'react'],
      ['nextjs', 'nextjs'],
      ['nuxtjs', 'nuxtjs'],
      ['angularjs', 'angular'],
      
      // Backend Frameworks
      ['node', 'nodejs'],
      ['expressjs', 'express'],
      ['djangoproject', 'django'],
      ['rubyonrails', 'rails'],
      ['springboot', 'spring'],
      
      // CSS Frameworks
      ['tailwind', 'tailwindcss'],
      ['bulma', 'bulma'],
      ['materialize', 'materialize'],
      
      // Databases
      ['postgres', 'postgresql'],
      ['mongo', 'mongodb'],
      ['mysql', 'mysql'],
      ['sqlite', 'sqlite'],
      
      // Cloud & DevOps
      ['k8s', 'kubernetes'],
      ['googlecloud', 'gcp'],
      ['amazonwebservices', 'aws'],
      ['microsoftazure', 'azure'],
      
      // Mobile
      ['reactnative', 'reactnative'],
      ['ionic', 'ionic'],
      ['xamarin', 'xamarin'],
      
      // Tools & Platforms
      ['vscode', 'vscode'],
      ['visualstudio', 'visualstudio'],
      ['intellij', 'intellij'],
      
      // Categories (consolidated)
      ['webdev', 'webdevelopment'],
      ['mobiledev', 'mobiledevelopment'],
      ['ml', 'machinelearning'],
      ['ai', 'artificialintelligence'],
      ['rest', 'restapi'],
    ]);

    // Common patterns for regex-based normalization
    this.patterns = [
      // Handle "X.js" pattern: "vue.js" -> "vue", "node.js" -> "node"
      { regex: /^(\w+)\.js$/, replacement: '$1' },
      // Handle common suffixes
      { regex: /^(\w+)(?:lang|language)$/, replacement: '$1' },
    ];
    
    // Note: Version numbers are preserved (e.g., 'vue2' and 'vue3' remain distinct)
  }

  /**
   * Normalize a tag to its canonical form
   * @param {string} tag - The tag to normalize
   * @returns {string} The normalized tag
   */
  normalize(tag) {
    if (!tag || typeof tag !== 'string') {
      return '';
    }

    // Check normalizedTagCache first
    const normalizedCacheKey = tag.toLowerCase();
    if (this.normalizedTagCache.has(normalizedCacheKey)) {
      return this.normalizedTagCache.get(normalizedCacheKey);
    }

    // Step 1: Clean and normalize input
    let normalized = tag
      .toLowerCase()
      .trim()
      // Preserve dots, remove other special characters
      .replace(/[^a-z0-9.]+/g, '');

    // Step 2: Direct mapping lookup (most efficient)
    if (this.tagAliasMap.has(normalized)) {
      const result = this.tagAliasMap.get(normalized);
      this.normalizedTagCache.set(normalizedCacheKey, result);
      return result;
    }

    // Step 3: Pattern matching for dynamic cases
    for (const pattern of this.patterns) {
      const match = normalized.match(pattern.regex);
      if (match) {
        const candidate = normalized.replace(pattern.regex, pattern.replacement);
        // Check if the pattern result has a mapping
        if (this.tagAliasMap.has(candidate)) {
          const result = this.tagAliasMap.get(candidate);
          this.normalizedTagCache.set(normalizedCacheKey, result);
          return result;
        }
        normalized = candidate;
        break;
      }
    }

    // Step 4: Final cleanup - keep only alphanumeric and dots in version numbers
    normalized = normalized.replace(/[^a-z0-9.]/g, '');
    
    // Step 5: Handle multiple consecutive dots
    normalized = normalized.replace(/\.+/g, '.');
    
    // Remove leading/trailing dots
    normalized = normalized.replace(/^\.|\.$/g, '');
    
    // Step 6: Return normalized or original if cleanup failed
    const result = normalized || tag.toLowerCase().replace(/[^a-z0-9]/g, '');
    this.normalizedTagCache.set(normalizedCacheKey, result);
    return result;
  }

  /**
   * Add new mappings dynamically
   * @param {string|string[]} from - Tag or array of tags to map from
   * @param {string} to - The canonical form to map to
   */
  addMapping(from, to) {
    if (Array.isArray(from)) {
      from.forEach(variant => {
        this.tagAliasMap.set(variant, to);
        // Clear cache as we've updated mappings
        this.normalizedTagCache.clear();
      });
    } else {
      this.tagAliasMap.set(from, to);
      this.normalizedTagCache.clear();
    }
  }

  /**
   * Get all variations for a canonical tag
   * @param {string} canonicalTag - The canonical tag to find variations for
   * @returns {string[]} Array of variant tags
   */
  getVariations(canonicalTag) {
    const variations = [];
    for (const [variant, canonical] of this.tagAliasMap.entries()) {
      if (canonical === canonicalTag) {
        variations.push(variant);
      }
    }
    return variations;
  }

  /**
   * Check if a tag is already in its canonical form
   * @param {string} tag - The tag to check
   * @returns {boolean} True if the tag is canonical
   */
  isCanonical(tag) {
    const normalized = this.normalize(tag);
    return normalized === tag.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  /**
   * Check if two normalized tags are similar
   * @param {string} a - First normalized tag
   * @param {string} b - Second normalized tag
   * @returns {boolean} True if tags are similar
   * @private
   */
  isSimilar(a, b) {
    // Quick check for common typos (1-2 character differences)
    if (a.includes(b) || b.includes(a)) return true;
    
    // Check if one is a prefix of the other (e.g., 'js' and 'javascript')
    return a.length > 3 && b.length > 3 && 
           (a.startsWith(b) || b.startsWith(a));
  }

  /**
   * Find a similar tag in a list of existing tags
   * @param {string} newTag - The new tag to check
   * @param {string[]} existingTags - Array of existing tags
   * @returns {string|null} The first similar tag found, or null if none
   */
  findSimilarTag(newTag, existingTags) {
    if (!newTag || !existingTags?.length) return null;
    
    const normalizedNewTag = this.normalize(newTag);
    
    for (const tag of existingTags) {
      const normalizedExisting = this.normalize(tag);

      // Skip if already handled by exact match check
      if (normalizedExisting === normalizedNewTag) continue;

      // Use the simpler similarity check
      if (this.isSimilar(normalizedNewTag, normalizedExisting)) {
        return tag; // Return the original tag for better UX
      }
    }
    
    return null; // No similar tag found
  }
}

// Create singleton instance
const tagNormalizer = new TagNormalizer();

// Simple function export that matches the previous API
export const normalizeTag = (tag) => tagNormalizer.normalize(tag);

export const findSimilarTag = (newTag, existingTags) => 
  tagNormalizer.findSimilarTag(newTag, existingTags);

// Export the class for advanced usage
export { TagNormalizer };

// For testing and debugging
if (import.meta.hot) {
  // Example usage in development
  console.log('Tag Normalizer Examples:');
  console.log("normalizeTag('Vue.js')", "→", normalizeTag('Vue.js'));
  console.log("normalizeTag('Python3.9')", "→", normalizeTag('Python3.9'));
  console.log("normalizeTag('k8s')", "→", normalizeTag('k8s'));
  console.log("normalizeTag('React Native')", "→", normalizeTag('React Native'));
}
