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
 * Convert Markdown callout prefix format to raw HTML callouts.
 * Supports blocks like:
 * > [!INFO]\n
 * > paragraph...
 *
 * Types: INFO, WARNING, TIP, STATS (case-insensitive). Unknown types are left untouched.
 */
/**
 * Preprocess Markdown text to convert callout-style blockquotes into
 * semantic HTML <blockquote> elements with callout classes.
 *
 * Input pattern (in Markdown):
 *   > [!TYPE]\n
 *   > body line 1\n
 *   > body line 2
 *
 * Where TYPE is a word like INFO, WARNING, TIP, STATS, etc. The marker line must
 * appear alone (i.e., no trailing text after the closing "]").
 *
 * What we output back into the Markdown stream (still a string, not DOM):
 *   <blockquote class="callout <mapped-type>">\n
 *   body line 1\n
 *   body line 2\n
 *   </blockquote>
 *
 * Why we do it here:
 * - We keep authoring simple and portable; writers use familiar blockquote syntax.
 * - We avoid complex renderer overrides or DOM post-processing.
 * - CSS in `src/views/BlogPost.vue` targets `.callout.*` to provide visuals.
 *
 * Parsing rules and edge cases:
 * - Marker detection is strict: we only match a line that looks like
 *   /^\s*>\s*\[!\s*([A-Za-z]+)\s*\]\s*$/ (blockquote, [!TYPE], nothing else).
 *   This prevents accidental matches in normal quotes.
 * - TYPE is case-insensitive and mapped through `typeMap` for aliases
 *   (e.g., NOTE → info, CAUTION → warning, STAT → stats).
 * - After a marker, we consume subsequent lines that still start with '>' or '> '
 *   as the callout body. We strip a single leading '>' and one optional space so
 *   the inner text remains valid Markdown when Marked runs later.
 * - If TYPE is unknown, we treat the marker line as a normal line (no transformation).
 * - Sanitization is NOT done here; DOMPurify runs after Marked renders the HTML.
 *
 * Example:
 *   Input:
 *     > [!TIP]\n> Do the smallest thing first.\n> Profit.\n\nParagraph
 *   Output:
 *     <blockquote class="callout tip">\nDo the smallest thing first.\nProfit.\n</blockquote>\n\nParagraph
 *
 * @param {string} src - Raw Markdown source.
 * @returns {string} A Markdown string with callout blocks replaced by HTML blockquotes.
 */
function preprocessCallouts(src) {
  const lines = src.split(/\r?\n/);
  const out = [];
  // Canonicalize incoming TYPE tokens to the CSS class we use for styling.
  // Left side are accepted author keywords; right side is the class modifier.
  const typeMap = { info: 'info', warning: 'warning', tip: 'tip', stats: 'stats', stat: 'stats', note: 'info', caution: 'warning', important: 'warning' };

  let i = 0;
  while (i < lines.length) {
    // Detect a standalone callout marker line like:
    //   > [!INFO]
    // Capture group 1 is the TYPE token.
    const m = lines[i].match(/^\s*>\s*\[!\s*([A-Za-z]+)\s*\]\s*$/);
    if (!m) {
      out.push(lines[i]);
      i++;
      continue;
    }

    // Normalize the TYPE to lowercase and map aliases (e.g., note → info).
    const t = (m[1] || '').toLowerCase();
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

    // Convert the collected body back to a single string and wrap in a
    // blockquote element with the appropriate callout type for CSS styling.
    const inner = body.join('\n');
    // Structured markup for stable layout and accessibility
    out.push(`<blockquote class="callout ${mapped}">`);
    out.push(`<span class="callout-icon" aria-hidden="true"></span>`);
    out.push(`<div class="callout-body">`);
    out.push(inner);
    out.push(`</div>`);
    out.push('</blockquote>');
  }

  return out.join('\n');
}
