import { nextTick } from 'vue';

/**
 * Extracts information about the current line where the cursor is positioned
 * @param {string} content - The full text content
 * @param {number} cursorPosition - The current cursor position
 * @returns {Object} - An object containing:
 *   - lineStart: number - Start position of the current line
 *   - lineText: string - Full text of the current line
 *   - lineIndent: string - The indentation (spaces) at the start of the line
 *   - isLineStart: boolean - Whether the cursor is at the start of the line
 *   - isInListItem: boolean - Whether the current line is a list item (starts with - * or 1.)
 */
export const getCurrentLineInfo = (content, cursorPosition) => {
    const lineStart = content.lastIndexOf('\n', cursorPosition - 1) + 1;
    const lineEnd = content.indexOf('\n', cursorPosition);
    const lineText = content.substring(
        lineStart,
        lineEnd === -1 ? content.length : lineEnd
    );
    const lineIndent = (lineText.match(/^ */) || [''])[0];
    const isLineStart = cursorPosition === 0 || content.charAt(cursorPosition - 1) === '\n';
    const isInListItem = lineText.match(/^\s*(\d+\.|[-*+])\s/) !== null;

    return {
        lineStart,
        lineText,
        lineIndent,
        isLineStart,
        isInListItem
    };
};

/**
 * Handles Tab key in textarea with smart indentation for lists
 * @param {Event} e - The keydown event
 * @param {Object} formData - Reactive form data containing content
 */
const TAB_SIZE = 4; // Consistent 4-space tabs

export const handleTab = (e, formData) => {
    e.preventDefault();
    const textarea = e.target;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = formData.content;

    // Get the current line
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = value.indexOf('\n', start);
    const currentLine = value.substring(lineStart, lineEnd === -1 ? value.length : lineEnd);

    // Check if we're in a list item (using explicit spaces)
    const isListItem = /^[ ]*[\d+.]\s+.*$/.test(currentLine) || /^[ ]*[-*+]\s+.*$/.test(currentLine);
    const isAtStartOfLine = start === lineStart;

    // If at start of line or in a list item, add TAB_SIZE spaces
    if (isAtStartOfLine || isListItem) {
        const newText = value.substring(0, start) + ' '.repeat(TAB_SIZE) + value.substring(start);
        formData.content = newText;
        nextTick(() => {
            textarea.selectionStart = textarea.selectionEnd = start + TAB_SIZE;
        });
    } else {
        // Standard tab behavior - align to next tab stop
        const lineUpToCursor = value.substring(lineStart, start);
        const spacesToAdd = TAB_SIZE - (lineUpToCursor.length % TAB_SIZE);
        const newText = value.substring(0, start) + ' '.repeat(spacesToAdd) + value.substring(start);
        formData.content = newText;
        nextTick(() => {
            textarea.selectionStart = textarea.selectionEnd = start + spacesToAdd;
        });
    }
};

/**
 * Handles Shift+Tab key in textarea with smart outdentation for lists
 * @param {Event} e - The keydown event
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

    // Check if we're in a list item
    const isListItem = /^\s*[\d+.]\s+.*$/.test(line) || /^\s*[-*+]\s+.*$/.test(line);

    // Calculate spaces to remove
    let spacesToRemove;
    if (isListItem) {
        // For list items, always remove 4 spaces or go to start of line
        spacesToRemove = Math.min(4, leadingSpaces[0].length);
    } else {
        // For regular text, remove to previous tab stop
        const currentIndent = leadingSpaces[0].length;
        spacesToRemove = currentIndent % 4 === 0 ? 4 : currentIndent % 4;
    }

    // Create new line with reduced indentation
    const newLine = line.substring(spacesToRemove);
    const newText = value.substring(0, lineStart) + newLine +
        value.substring(lineEnd === -1 ? value.length : lineEnd);

    formData.content = newText;

    // Update cursor position
    nextTick(() => {
        const newPos = Math.max(start - spacesToRemove, lineStart);
        textarea.selectionStart = textarea.selectionEnd = newPos;
    });
};

/**
 * Determines the relationship between the current list item and the previous one
 * based on their indentation levels.
 * @param {string} textBeforeCursor - The text before the cursor
 * @param {string} currentLineIndent - The indentation of the current line
 * @returns {Object} - An object containing:
 *   - isNewSublist: boolean - true if this is a new sublist
 *   - isSameLevel: boolean - true if this is at the same level as the previous item
 *   - isOutdented: boolean - true if this is outdented from the previous item
 *   - prevLineIndent: string - the ACTUAL indentation of the previous list item
 */
export const getListRelationship = (textBeforeCursor, currentLineIndent) => {
    // Split text into lines and remove the current line (which is incomplete)
    const allLines = textBeforeCursor.split('\n');
    const listPattern = /^\s*\d+\.\s*|^\s*[-*+]\s*/;

    // Skip the current line which is the last one in the array
    // We're only interested in complete previous lines

    let actualPrevLine = '';
    let actualPrevLineIndent = '';
    let lastListItemLine = '';
    let lastListItemIndent = '';
    let foundListItem = false;

    const previousLines = allLines.slice(0, -1);
    // Scan backwards through previous lines only
    for (let i = previousLines.length - 1; i >= 0; i--) {
        const line = previousLines[i];

        // Skip completely empty lines
        if (line.length === 0) continue;

        // Record non-empty lines as we find them
        if (line.trim() !== '') {
            actualPrevLine = line;
            actualPrevLineIndent = line.match(/^ */)[0];
        }

        // Look for the most recent list item for context
        if (line && listPattern.test(line)) {
            lastListItemLine = line;
            lastListItemIndent = line.match(/^ */)[0];
            foundListItem = true;
            break; // Found what we need
        }
    }

    // If no lines found at all
    if (!actualPrevLine) {
        return {
            isNewSublist: false,
            isSameLevel: false,
            isOutdented: false,
            prevLineIndent: actualPrevLineIndent
        };
    }



    // If no list items found, return basic relationship
    if (!foundListItem) {
        return {
            isNewSublist: false,
            isSameLevel: false,
            isOutdented: false,
            prevLineIndent: actualPrevLineIndent
        };
    }

    // Compare actual indentation lengths (preserve exact spacing)
    const currentIndent = currentLineIndent ?? '';
    const currentLevel = currentIndent.length;
    const prevLevel = lastListItemIndent.length;

    // Determine relationships based on actual indentation
    const isNewSublist = foundListItem && currentLevel > prevLevel;
    const isSameLevel = foundListItem && currentLevel === prevLevel;
    const isOutdented = currentLevel < prevLevel;

    return {
        isNewSublist,
        isSameLevel,
        isOutdented,
        prevLineIndent: lastListItemIndent // Return ACTUAL indentation, not normalized
    };
};

/**
 * Determines if a prefix is a list marker and its type
 * @param {string} prefix - The prefix to check
 * @returns {Object} - An object containing:
 *   - isList: boolean - Whether the prefix is a list marker
 *   - isOrdered: boolean - Whether it's an ordered list
 *   - isUnordered: boolean - Whether it's an unordered list
 */
export const determineListType = (prefix) => {
    const isOrdered = /^\s*\d+\.\s+$/.test(prefix);
    const isUnordered = /^\s*[-*+]\s+$/.test(prefix);
    return {
        isList: isOrdered || isUnordered,
        isOrdered,
        isUnordered
    };
};


/**
 * Determines if a newline should be inserted before a list marker.
 * Handles edge cases to prevent double newlines or incorrect line breaks.
 * 
 * @param {string} beforeText - The text content before the cursor position
 * @param {boolean} isListMarker - Whether the current formatting action is for a list item
 * @param {boolean} isLineStart - Whether the cursor is at the start of a line
 * @param {string} insertion - The text being inserted
 * @returns {boolean} True if a newline should be inserted, false otherwise
 * 
 * @example
 * // Returns false - not a list item
 * shouldInsertNewLine('Some text', false, false);
 * 
 * @example
 * // Returns false - already at line start
 * shouldInsertNewLine('\n', true, true);
 * 
 * @example
 * // Returns true - needs newline before list item
 * shouldInsertNewLine('Some text', true, false);
 */
/**
 * Determines if a newline should be inserted before a list marker
 * @param {string} beforeText - Text before the cursor
 * @param {boolean} isListMarker - If the current action is a list marker
 * @param {boolean} isLineStart - If cursor is at line start
 * @param {string} [insertion=''] - The text being inserted
 * @returns {boolean} True if newline should be inserted
 */
export function shouldInsertNewLine(beforeText, isListMarker, isLineStart, insertion) {
    // Early exit conditions
    if (!isListMarker || isLineStart) return false;
    if (!beforeText.length) return false; // start of document
    // Detect if there's a newline before the trailing spaces
    const hasTerminalNewline = /\n\s*$/.test(beforeText);
    if (hasTerminalNewline) {
        return false;
    }
    // Get the current line's content
    const lastNewline = beforeText.lastIndexOf('\n') + 1;
    const lastLine = beforeText.slice(lastNewline);



    // Never insert newline if the last line is empty (already has a newline)
    if (beforeText.replace(/[ ]+$/, '').endsWith('\n')) {
        return false;
    }

    // Check if current line has a list marker (ordered or unordered)
    const hasListMarker = /^\s*\d+\.\s*/.test(lastLine) || // Matches "1. " or "  1. "
        /^\s*[-*+]\s+/.test(lastLine);     // Matches "- ", "* ", "+ "

    // Check if we're inserting a sub-list (indented list)
    const isSubList = /^\s{4,}(?:\d+\.|[-*+])\s/.test(insertion);

    // Insert newline if:
    // 1. Current line has a list marker, or
    // 2. We're inserting a sub-list, or
    // 3. Current line has content and we're not at line start
    return hasListMarker || isSubList || (lastLine.trim().length > 0 && !isLineStart);
}



/**
 * Calculates the new cursor position after text insertion
 * @param {Object} options - Position calculation options
 * @param {string} options.beforeText - Text before the cursor
 * @param {string} options.selectedText - Currently selected text
 * @param {string} options.prefix - Text being inserted before selection
 * @param {string} options.suffix - Text being inserted after selection
 * @param {string} [options.insertion] - The complete text being inserted (including prefix and any formatting)
 * @param {boolean} options.isOrdered - If the current format is an ordered list
 * @param {boolean} options.isUnordered - If the current format is an unordered list
 * @param {number} [options.number] - The list number (for ordered lists)
 * @returns {number} The new cursor position
 */
export const calculateCursorPosition = ({ beforeText, selectedText, prefix, suffix, insertion, isOrdered, isUnordered, number }) => {
    // For links and images, position cursor inside the URL
    if ((prefix === '[' && suffix === '](url)') || (prefix === '![' && suffix === '](image-url)')) {
        return beforeText.length + prefix.length;
    }

    // For code blocks, position inside the block
    if (prefix === '```\n' && suffix === '\n```') {
        return beforeText.length + prefix.length;
    }

    // For ordered lists, use the insertion text if available for more accurate positioning
    if (isOrdered && number !== undefined) {

        if (insertion) {
            // Find the position after the dot in the insertion
            const dotIndex = insertion.indexOf('.');
            if (dotIndex !== -1) {
                return beforeText.length + dotIndex + 1; // Position after the dot
            }
        }
        // Fallback to the original calculation if no insertion or no dot found
        const numberLength = number.toString().length;
        return beforeText.length + numberLength + 1; // Position after the dot
    }

    // For unordered lists, use the insertion text if available
    if (isUnordered) {     
        if (insertion) {
            // Position after the list marker and space
            const markerEnd = insertion.match(/^\s*[-*+]\s?/);
            if (markerEnd) {
                return beforeText.length + markerEnd[0].length;
            }
        }
        // Fallback to the original calculation
        return beforeText.length + prefix.trim().length + 1; // +1 for space after marker
    }

    // Default case: position after the inserted prefix
    return beforeText.length + prefix.length + selectedText.length;
};