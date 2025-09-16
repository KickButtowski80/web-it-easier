/**
 * Utility functions for finding related blog posts
 * These functions help improve internal linking by identifying content relationships
 */

/**
 * Extract keywords from title and content
 * @param {string} title - Post title
 * @param {string} content - Post content
 * @returns {Object} - Object with keywords as keys and frequencies as values
 */
export function extractKeywords(title, content) {
  // Combine title and content, giving title more weight (3x)
  const text = `${title} ${title} ${title} ${content}`.toLowerCase();
  
  // Common stop words to filter out
  const stopWords = [
    'the', 'and', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'with', 
    'by', 'of', 'is', 'are', 'was', 'were', 'be', 'this', 'that', 'it',
    'as', 'from', 'has', 'have', 'had', 'not', 'but', 'or', 'if', 'then'
  ];
  
  const words = text
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(/\s+/) // Split by whitespace
    .filter(word => word.length > 2 && !stopWords.includes(word)); // Filter out stop words and short words
  
  // Count word frequencies
  const wordCounts = {};
  words.forEach(word => {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });
  
  return wordCounts;
}

/**
 * Calculate similarity score between two keyword sets
 * @param {Object} keywords1 - First set of keywords with frequencies
 * @param {Object} keywords2 - Second set of keywords with frequencies
 * @returns {number} - Similarity score
 */
export function calculateSimilarityScore(keywords1, keywords2) {
  let score = 0;
  
  // For each keyword in the first set
  Object.keys(keywords1).forEach(keyword => {
    // If the second set also has this keyword
    if (keywords2[keyword]) {
      // Add to score based on frequency in both sets
      score += keywords1[keyword] * keywords2[keyword];
    }
  });
  
  return score;
}

/**
 * Find related posts based on content similarity
 * @param {Object} currentPost - The current post object
 * @param {Array} allPosts - Array of all available posts
 * @param {number} limit - Maximum number of related posts to return (default: 3)
 * @returns {Array} - Array of related posts sorted by relevance
 */
export function findRelatedPosts(currentPost, allPosts, limit = 3) {
  if (!currentPost || !allPosts || allPosts.length === 0) {
    return [];
  }
  
  // Filter out the current post
  const otherPosts = allPosts.filter(post => post.id !== currentPost.id);
  
  if (otherPosts.length === 0) {
    return [];
  }
  
  // Extract keywords from current post
  const currentPostKeywords = extractKeywords(currentPost.title, currentPost.content);
  
  // Score other posts based on keyword matches
  const scoredPosts = otherPosts.map(post => {
    const postKeywords = extractKeywords(post.title, post.content || '');
    const score = calculateSimilarityScore(currentPostKeywords, postKeywords);
    return { ...post, score };
  });
  
  // Sort by score (highest first) and take top N
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Find popular posts based on a simple algorithm
 * This can be enhanced later with actual view counts or other metrics
 * @param {Array} allPosts - Array of all available posts
 * @param {number} limit - Maximum number of popular posts to return (default: 5)
 * @returns {Array} - Array of popular posts
 */
export function findPopularPosts(allPosts, limit = 5) {
  if (!allPosts || allPosts.length === 0) {
    return [];
  }
  
  // For now, we'll use content length as a simple proxy for "popularity"
  // This should be replaced with actual metrics when available
  const scoredPosts = allPosts.map(post => {
    // Score based on content length (longer content might be more comprehensive)
    const contentScore = post.content ? post.content.length / 1000 : 0;
    
    // Add some randomness to avoid always showing the same posts
    // This can be removed once real metrics are available
    const randomFactor = Math.random() * 0.3;
    
    return {
      ...post,
      score: contentScore + randomFactor
    };
  });
  
  // Sort by score and take top N
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
