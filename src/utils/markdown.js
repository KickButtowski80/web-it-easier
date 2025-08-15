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
  const preprocessed = preprocessCallouts(markdown);
  return DOMPurify.sanitize(marked(preprocessed));
}

export default marked;

/**
 * Convert Markdown blockquotes into styled callouts or quote blocks.
 * 
 * Supports two formats:
 * 1. Callout blocks with type indicators:
 *    > [!INFO]
 *    > This is an info callout
 *
 * 2. Regular blockquotes (automatically styled as quotes):
 *    > This is a regular quote that will be styled
 *
 * Supported Callout Types (case-insensitive):
 * - INFO/NOTE: Informational callout
 * - WARNING/CAUTION/IMPORTANT: Warning callout
 * - TIP: Tip/advice callout
 * - STATS/STAT: Statistics/data callout
 * - QUOTE: Explicit quote styling (also used automatically for regular blockquotes)
 *
 * All callouts are wrapped in a <blockquote> with appropriate classes and include
 * an icon for better visual distinction.
 */

/**
 * Preprocess Markdown text to convert blockquotes into styled callouts or quotes.
 *
 * Input patterns (in Markdown):
 *   1. Callout with type indicator:
 *      > [!TYPE]
 *      > Callout content line 1
 *      > Callout content line 2
 *
 *   2. Regular blockquote (automatically styled as quote):
 *      > This is a regular quote
 *      > that spans multiple lines
 *
 * Output (HTML structure for both types):
 *   <blockquote class="callout <type>">
 *     <div class="callout-body">
 *       <span class="callout-icon" aria-hidden="true"></span>
 *       <div class="callout-content">
 *         Content here with preserved Markdown
 *       </div>
 *     </div>
 *   </blockquote>
 *
 * Features:
 * - Automatic detection of callout types via [!TYPE] marker
 * - Regular blockquotes are automatically styled as quotes
 * - Preserves all inner Markdown formatting
 * - Accessible with proper ARIA attributes
 * - Responsive design with hover effects
 *
 * Styling:
 * - Uses CSS variables for theming (--badge-bg, --badge-border)
 * - Icons are embedded as data URIs for performance
 * - Dark mode support included
 *
 * Example:
 *   Input:
 *     > [!TIP]
 *     > Always measure before optimizing.
 *     > 
 *     > This is a multi-line tip with **bold** text.
 *
 *   Output:
 *     <blockquote class="callout tip">
 *       <div class="callout-body">
 *         <span class="callout-icon" aria-hidden="true"></span>
 *         <div class="callout-content">
 *           Always measure before optimizing.
 *           
 *           This is a multi-line tip with <strong>bold</strong> text.
 *         </div>
 *       </div>
 *     </blockquote>
 *
 * @param {string} src - Raw Markdown source text
 * @returns {string} Processed Markdown with HTML callouts
 */
// NOTE ABOUT RAW HTML AND MARKED
// --------------------------------
// Marked (and CommonMark) treat a sequence of lines beginning with an HTML
// block tag as a "raw HTML block" only when the opening tag starts at column 0
// (no leading indentation). If these tags are indented, Marked may treat them
// as part of a paragraph and emit wrapping <p> or insert <br> when `breaks: true`
// is enabled. This is why we intentionally emit the callout HTML with NO leading
// spaces below. Keeping tags left-aligned guarantees the block is parsed as raw
// HTML and is not wrapped, which prevents stray <p></p> and <br> in the output.
//
// Additionally, when `breaks: true` is set:
// - Single newlines or trailing spaces at the end of a line can produce <br>.
// - A trailing blank line in the callout body can produce an empty <p>.
// Authoring tip: avoid leaving a quoted blank line ("> ") at the very end of
// a callout body and avoid trailing spaces on the final content line. If needed,
// consider trimming `inner` before emitting.
/**
 * Generates HTML for a callout/quote block
 * @param {string} content - The content of the callout/quote
 * @param {string} type - The type of callout (e.g., 'info', 'warning', 'quote')
 * @returns {string} HTML string for the callout
 */
function generateCalloutHTML(content, type) {
  return [
    `<blockquote class="callout ${type}">`,
    '  <div class="callout-body">',
    '    <span class="callout-icon" aria-hidden="true"></span>',
    '    <div class="callout-content">',
    `      ${content}`,
    '    </div>',
    '  </div>',
    '</blockquote>'
  ].join('\n');
}

function preprocessCallouts(src) {
  const lines = src.split(/\r?\n/);
  const out = [];
  // Canonicalize incoming TYPE tokens to the CSS class we use for styling.
  // Left side are accepted author keywords; right side is the class modifier.
  const typeMap = { 
    info: 'info', 
    warning: 'warning', 
    tip: 'tip', 
    stats: 'stats', 
    stat: 'stats', 
    note: 'info', 
    caution: 'warning', 
    important: 'warning',
    quote: 'quote' // Add quote type for regular blockquotes
  };

  let i = 0;
  while (i < lines.length) {
    // Check if this is a callout marker line like: > [!INFO]
    const calloutMatch = lines[i].match(/^\s*>\s*\[!\s*([A-Za-z]+)\s*\]\s*$/);
    const isRegularBlockquote = /^\s*>(?!\s*\[!\s*[A-Za-z]+\s*\])(.*)$/.test(lines[i]);
    
    // If it's a regular blockquote, wrap it with quote styling
    if (isRegularBlockquote) {
      const content = lines[i].replace(/^\s*>\s*/, '');
      out.push(generateCalloutHTML(content, 'quote'));
      i++;
      continue;
    }
    
    // If it's not a callout marker, just pass it through
    if (!calloutMatch) {
      out.push(lines[i]);
      i++;
      continue;
    }

    // Normalize the TYPE to lowercase and map aliases (e.g., note → info).
    const t = (calloutMatch[1] || '').toLowerCase();
    const mapped = typeMap[t];
    if (!mapped) {
      // Unknown type: treat as normal line
      out.push(lines[i]);
      i++;
      continue;
    }

    // Collect subsequent quote lines (including empty quote lines '>') as the callout body.
    i++; // move past the marker line
    const body = [];
    while (i < lines.length) {
      const ln = lines[i];
      if (/^\s*>\s?/.test(ln)) {
        // Strip a single leading '>' and one optional space so the inner content
        // remains valid Markdown for Marked/DOMPurify downstream.
        body.push(ln.replace(/^\s*>\s?/, ''));
        i++;
      } else {
        break;
      }
    }

    /**
     * Convert markdown callout to HTML structure
     * 
     * Example Input:
     * > **Note:** This is a callout
     * > with multiple lines
     * 
     * Generates HTML:
     * <blockquote class="callout note">
     *   <div class="callout-body">
     *     <span class="callout-icon" aria-hidden="true"></span>
     *     <div class="callout-content">
     *       <strong>Note:</strong> This is a callout<br>with multiple lines
     *     </div>
     *   </div>
     * </blockquote>
     * 
     * Callout types: info, warning, tip, stats (defaults to info)
     */
    const inner = body.join('\n');
    // IMPORTANT: The generated HTML must be left-aligned (no leading spaces)
    // so Marked recognizes it as a raw HTML block and doesn't wrap it with <p> or <br> tags
    out.push(generateCalloutHTML(inner, mapped));
  }

  return out.join('\n');
}
