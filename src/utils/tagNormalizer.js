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
const stripNumericSuffix = (value) => value.replace(/\d+$/, '');

class TagNormalizer {
  constructor() {
    // Cache for storing normalized tags to avoid redundant processing
    this.normalizedTagCache = new Map();

    // Single source of truth: canonical → aliases (including canonical)
    const canonicalToAliases = new Map([

      // Core Web Technologies
      ['html', ['html', 'html5']],
      ['css', ['css', 'css3']],

      // Programming Languages
      ['javascript', ['js', 'javascript', 'es6', 'ecmascript']],
      ['typescript', ['ts', 'typescript']],
      ['python', ['py', 'python', 'python3']],
      ['ruby', ['rb', 'ruby']],
      ['php', ['php']],
      ['java', ['java', 'jdk']],
      ['csharp', ['cs', 'c#', 'csharp']],
      ['cpp', ['cpp', 'c++']],
      ['golang', ['go', 'golang']],
      ['rust', ['rust']],

      // Web Frameworks
      ['react', ['react', 'reactjs', 'react.js']],
      ['vue', ['vue', 'vuejs', 'vue.js']],
      ['angular', ['angular', 'angularjs']],
      ['svelte', ['svelte']],
      ['nextjs', ['next', 'nextjs', 'next.js']],
      ['nuxtjs', ['nuxt', 'nuxtjs', 'nuxt.js']],

      // Backend Frameworks
      ['nodejs', ['node', 'nodejs']],
      ['express', ['express', 'expressjs']],
      ['django', ['django']],
      ['flask', ['flask']],
      ['rails', ['rails', 'rubyonrails']],
      ['spring', ['spring', 'springboot']],

      // CSS Frameworks
      ['tailwindcss', ['tailwind', 'tailwindcss']],
      ['bootstrap', ['bootstrap']],
      ['materialui', ['materialui', 'mui']],

      // Databases
      ['postgresql', ['postgres', 'postgresql', 'pg']],
      ['mongodb', ['mongo', 'mongodb']],
      ['mysql', ['mysql']],
      ['sqlite', ['sqlite']],
      ['redis', ['redis']],

      // Cloud & DevOps
      ['aws', ['aws', 'amazonwebservices']],
      ['gcp', ['gcp', 'googlecloud']],
      ['azure', ['azure', 'microsoftazure']],
      ['docker', ['docker']],
      ['kubernetes', ['k8s', 'kubernetes']],
      ['terraform', ['terraform']],

      // Mobile
      ['reactnative', ['reactnative', 'react-native']],
      ['flutter', ['flutter']],

      // Tools
      ['vscode', ['vscode', 'vsc']],
      ['git', ['git']],
      ['github', ['github']],
      ['gitlab', ['gitlab']],

      // Categories
      ['frontend', ['frontend', 'front-end']],
      ['backend', ['backend', 'back-end']],
      ['fullstack', ['fullstack', 'full-stack']],
      ['devops', ['devops']],
      ['webdevelopment', ['webdev', 'web-development']],
      ['mobile', ['mobile', 'mobiledev']],
      ['database', ['db', 'database']],
      ['roi', ['roi', 'returnoninvestment', 'return-on-investment']],

      ['artificialintelligence', ['ai', 'artificialintelligence', 'artificial-intelligence']],

      // Computer Science
      ['computerscience', ['cs', 'computerscience', 'computer-science', 'compsci']],
      ['algorithm', ['algorithm', 'algorithms', 'algo']],
      ['datastructure', ['datastructure', 'datastructures', 'data-structure', 'ds']],
      ['computability', ['computability', 'computation', 'computable']],
      ['complexity', ['complexity', 'computationalcomplexity', 'complexitytheory']],
      ['turingmachine', ['turingmachine', 'turing-machine', 'turing']],
      ['functional', ['functional', 'functionalprogramming', 'fp']],
      ['objectoriented', ['oop', 'objectoriented', 'object-oriented']],
      ['imperative', ['imperative', 'procedural']],
      ['declarative', ['declarative']],
      ['cryptography', ['crypto', 'cryptography', 'encryption']],
      ['networking', ['networking', 'networks', 'network']],
      ['operatingsystem', ['os', 'operatingsystem', 'operating-system']],
      ['compiler', ['compiler', 'compilers', 'compilation']],
      ['parallelcomputing', ['parallel', 'parallelcomputing', 'concurrency']],
      ['alanturing', ['alanturing', 'alan-turing', 'turing']],
      ['turingtest', ['turingtest', 'turing-test']],
      ['churchturing', ['churchturing', 'church-turing']],

      // Data Structures & Algorithms
      ['array', ['array', 'arrays']],
      ['hash', ['hash', 'hashtable', 'hashmap', 'hash-table', 'hash-map']],
      ['linkedlist', ['linkedlist', 'linked-list', 'llist']],
      ['queue', ['queue', 'queues']],
      ['stack', ['stack', 'stacks']],
      ['tree', ['tree', 'trees', 'binarytree']],
      ['graph', ['graph', 'graphs']],
      ['sorting', ['sorting', 'sort', 'sorts']],
      ['searching', ['searching', 'search', 'searches']],
      ['recursion', ['recursion', 'recursive']],
      ['dynamicprogramming', ['dp', 'dynamicprogramming', 'dynamic-programming']]
    ]);

    // Store the source of truth
    this.canonicalToAliases = canonicalToAliases;

    // Build alias → canonical lookup map for fast normalization
    this.aliasToCanonical = new Map();
    for (const [canonical, aliases] of canonicalToAliases) {
      // Add all aliases pointing to their canonical form
      aliases.forEach(alias => {
        this.aliasToCanonical.set(alias, canonical);
      });
      // Ensure canonical form is also in the map pointing to itself
      this.aliasToCanonical.set(canonical, canonical);
    }

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
   * Retrieve all aliases known for a canonical tag
   * @param {string} canonicalTag - Canonical tag identifier
   * @returns {string[]} Alias list (empty if unknown)
   * @example
   * getAliases('react'); // ['react', 'reactjs', 'react.js']
   */
  getAliases(canonicalTag) {
    if (!canonicalTag) return [];
    const aliases = this.canonicalToAliases.get(canonicalTag);
    return aliases ? [...aliases] : [];
  }


  /**
   * Normalize arbitrary tag input into the canonical string stored in Firestore.
   *
   * The normalization pipeline:
   * - lowercases and trims the input;
   * - strips unsupported characters while preserving dots for versions (`node.js` → `nodejs`);
   * - resolves direct aliases via `aliasToCanonical` (`js` → `javascript`);
   * - applies pattern-based fallbacks such as removing trailing ".js" (`react.js` → `react`);
   * - caches the result so repeated lookups are O(1).
   *
   * @param {string} tag - Raw tag text from user input or seeded data.
   * @returns {string} Canonical tag identifier used throughout the app.
   * @example
   * normalize('React.js'); // 'react'
   * normalize('Python3.9'); // 'python'
   * normalize('js'); // 'javascript'
   * normalize('   Tailwind CSS   '); // 'tailwindcss'
   */
  normalize(tag) {
    // Early return for invalid inputs (null, undefined, non-strings)
    if (!tag || typeof tag !== 'string') {
      return '';
    }
    
    // Cache check - skip processing if we've seen this exact input before
    // Uses lowercase version as key for case-insensitive matching
    const normalizedCacheKey = tag.toLowerCase();
    if (this.normalizedTagCache.has(normalizedCacheKey)) {
      return this.normalizedTagCache.get(normalizedCacheKey);
    }

    // Step 1: Initial cleaning and normalization
    let normalized = tag
      .toLowerCase()    // Convert to lowercase for case-insensitive comparison
      .trim()           // Remove leading/trailing whitespace
      // Keep only alphanumeric and dot characters (for version numbers)
      // Example: 'Node.js' -> 'node.js', 'C++' -> 'c'
      .replace(/[^a-z0-9.]+/g, '');

    // Step 2: Direct alias lookup (fast path for exact matches)
    // Example: 'js' → 'javascript', 'ts' → 'typescript'
    if (this.aliasToCanonical.has(normalized)) {
      const result = this.aliasToCanonical.get(normalized);
      this.normalizedTagCache.set(normalizedCacheKey, result);
      return result;
    }

    // Step 3: Apply pattern-based transformations
    // Handles cases like 'react.js' → 'react' → (lookup 'react')
    for (const pattern of this.patterns) {
      const match = normalized.match(pattern.regex);
      if (match) {
        // Apply the pattern transformation (e.g., remove '.js' suffix)
        const candidate = normalized.replace(pattern.regex, pattern.replacement);
        
        // If the transformed version exists in our aliases, use it
        if (this.aliasToCanonical.has(candidate)) {
          const result = this.aliasToCanonical.get(candidate);
          this.normalizedTagCache.set(normalizedCacheKey, result);
          return result;
        }
        // Update normalized for potential further processing
        normalized = candidate;
        break; // Stop after first matching pattern
      }
    }

    // Step 4: Final cleanup of any remaining special characters
    // Example: 'node.js!' → 'node.js'
    normalized = normalized.replace(/[^a-z0-9.]/g, '');

    // Step 5: Normalize dots (handle multiple or malformed dots)
    normalized = normalized
      .replace(/\.+/g, '.')     // Collapse multiple dots into one
      .replace(/^\.|\.$/g, ''); // Remove leading/trailing dots

    // Step 6: Return final result with caching
    // Fallback to basic alphanumeric if normalization resulted in empty string
    const result = normalized || tag.toLowerCase().replace(/[^a-z0-9]/g, '');
    this.normalizedTagCache.set(normalizedCacheKey, result);
    return result;
  }

  /**
   * Get all variations for a canonical tag
   * @param {string} canonicalTag - The canonical tag to find variations for
   * @returns {string[]} Array of variant tags
   */
  getVariations(canonicalTag) {
    // This is an inefficient way to get variations. A better approach is to use canonicalToAliases.
    // However, to keep the logic simple and based on the existing structure, we will use it.
    // A more performant version would be to return this.canonicalToAliases.get(canonicalTag)
    const variations = [];
    for (const [alias, canonical] of this.aliasToCanonical.entries()) {
      if (canonical === canonicalTag) {
        variations.push(alias);
      }
    }
    return variations;
  }

  /**
   * Check if a tag is already in its canonical form
   * @param {string} tag - The tag to check
   * @returns {boolean} True if the tag is canonical
   * @example
   * isCanonical('react'); // true
   * isCanonical('React.js'); // false
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
   * @example
   * isSimilar('javascript', 'javascript'); // true (handled earlier)
   * isSimilar('web', 'webd'); // true (length difference 1, substring match)
   * isSimilar('react', 'reactnative'); // false
   */
  isSimilar(a, b) {
    // Quick check for common typos (1-2 character differences)
    const lengthDifference = Math.abs(a.length - b.length);

    const baseA = stripNumericSuffix(a);
    const baseB = stripNumericSuffix(b);
    const shareNumericSuffixBase = (baseA !== a || baseB !== b) && baseA === baseB;
    if (shareNumericSuffixBase) {
      return false;
    }

    // Treat very short tokens as distinct unless they are almost identical (e.g. 'js' vs 'jsx')
    if (a.length <= 3 || b.length <= 3) {
      return lengthDifference <= 1 && (a.includes(b) || b.includes(a));
    }

    // Only consider substring matches similar when lengths are close (prevents css vs tailwindcss)
    if (lengthDifference <= 2) {
      return a.includes(b) || b.includes(a);
    }

    // Prefix relationship implies similarity only when the strings share comparable length
    return lengthDifference <= 2 && (a.startsWith(b) || b.startsWith(a));
  }

  /**
   * Find a similar tag in a list of existing tags
   * @param {string} newTag - The new tag to check
   * @param {string[]} existingTags - Array of existing tags to check against
   * @returns {string|null} The first similar tag found, or null if none
   * @example
   * findSimilarTag('webd', ['web', 'javascript']); // 'web'
   * findSimilarTag('svelte', ['react', 'vue']); // null
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

export const getAliasesForCanonical = (canonicalTag) =>
  tagNormalizer.getAliases(canonicalTag);

// Export the class for advanced usage
export { TagNormalizer };

// For testing and debugging
// if (import.meta.hot) {
//   // Example usage in development
//   console.log('Tag Normalizer Examples:');
//   console.log("normalizeTag('Vue.js')", "→", normalizeTag('Vue.js'));
//   console.log("normalizeTag('Python3.9')", "→", normalizeTag('Python3.9'));
//   console.log("normalizeTag('k8s')", "→", normalizeTag('k8s'));
//   console.log("normalizeTag('React Native')", "→", normalizeTag('React Native'));
// }
