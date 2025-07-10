import { nextTick } from 'vue';

/**
 * Handles Tab key in textarea with smart indentation for lists
 * @param {Event} e - The keydown event
 * @param {Object} formData - Reactive form data containing content
 */
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
    
    // Check if we're in a list item
    const isListItem = /^\s*[\d+.]\s+.*$/.test(currentLine) || /^\s*[-*+]\s+.*$/.test(currentLine);
    const isAtStartOfLine = start === lineStart;
    
    // If at start of line or in a list item, add 4 spaces
    if (isAtStartOfLine || isListItem) {
        const newText = value.substring(0, start) + '    ' + value.substring(start);
        formData.content = newText;
        nextTick(() => {
            textarea.selectionStart = textarea.selectionEnd = start + 4;
        });
    } else {
        // Standard tab behavior - align to next tab stop
        const lineUpToCursor = value.substring(lineStart, start);
        const spacesToAdd = 4 - (lineUpToCursor.length % 4);
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
    const listPattern = /^\s*\d+\.\s*|^\s*[-*+]\s+/;
    
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
            prevLineIndent: ''
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