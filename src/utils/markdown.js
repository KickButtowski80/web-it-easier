/**
 * Markdown Processing Utility
 * 
 * This module provides centralized markdown processing with syntax highlighting and sanitization.
 * It configures marked.js and provides a simple interface for rendering markdown to HTML.
 * 
 * Key Concepts:
 * 1. marked.setOptions() - Used to set the default configuration options for marked.
 *    - Completely replaces previous options
 *    - Best for initial setup of core rendering behavior
 * 
 * 2. marked.use() - Used to extend marked with plugins or custom renderers.
 *    - Merges new options with existing ones
 *    - Can be called multiple times to add multiple extensions
 *    - Required for adding plugins like gfmHeadingId
 * 
 * 3. DOMPurify - Used to sanitize the output HTML for security
 */

import { marked } from 'marked';
import hljs from 'highlight.js';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import DOMPurify from 'dompurify';
import 'highlight.js/styles/github.css';

// Configure marked with default options for rendering behavior
marked.setOptions({
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
  gfm: true,
  pedantic: false,
  smartLists: true,
  smartypants: true
});

// Apply GFM heading ID extension using marked.use()
// This adds the ability to generate GitHub-style heading IDs
marked.use(gfmHeadingId());

/**
 * Renders markdown to sanitized HTML
 * @param {string} markdown - The markdown content to render
 * @returns {string} Sanitized HTML
 */
export function renderMarkdown(markdown) {
  if (!markdown) return '';
  return DOMPurify.sanitize(marked(markdown));
}

export default marked;
