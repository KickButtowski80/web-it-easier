import { nextTick } from 'vue';

/**
 * Handles Tab key in textarea, adding spaces to align to next tab stop
 * @param {Event} event - The keydown event
 * @param {Object} formData - Reactive form data containing content
 */
export const handleTab = (e, formData) => {
    e.preventDefault();
    const textarea = e.target;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = formData.content;

    // Get the current line up to cursor
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const lineUpToCursor = value.substring(lineStart, start);

    // Calculate spaces to next tab stop (4 spaces per tab)
    const spacesToAdd = 4 - (lineUpToCursor.length % 4);

    // Check if there's a space immediately after the cursor
    const skipNextChar = (start < value.length && value[start] === ' ') ? 1 : 0;

    // Insert spaces, replacing the next character if it's a space
    const newText = value.substring(0, start) +
        ' '.repeat(spacesToAdd) +
        value.substring(start + skipNextChar);

    formData.content = newText;

    // Set cursor position after inserted spaces
    nextTick(() => {
        textarea.selectionStart = textarea.selectionEnd = start + spacesToAdd;
    });
};

/**
 * Handles Shift+Tab key in textarea, removing spaces to align to previous tab stop
 * @param {Event} event - The keydown event
 * @param {Object} formData - Reactive form data containing content
 */

export const handleShiftTab = (e, formData) => {
    e.preventDefault();

    const textarea = e.target;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = formData.content;

    // Get the current line
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = value.indexOf('\n', start);
    const line = value.substring(lineStart, lineEnd === -1 ? value.length : lineEnd);

    // Find leading spaces
    const leadingSpaces = line.match(/^ +/);
    if (!leadingSpaces) return; // No spaces to remove

    // Calculate spaces to remove based on tab stops
    const currentIndent = leadingSpaces[0].length;
    const spacesToRemove = currentIndent % 4 === 0 ? 4 : currentIndent % 4;
    const newLine = line.substring(spacesToRemove);

    // Create new text with outdented line
    const newText = value.substring(0, lineStart) +
        newLine +
        value.substring(lineEnd === -1 ? value.length : lineEnd);

    formData.content = newText;

    nextTick(() => {
        const newPos = Math.max(start - spacesToRemove, lineStart);
        textarea.selectionStart = textarea.selectionEnd = newPos;
    });
};