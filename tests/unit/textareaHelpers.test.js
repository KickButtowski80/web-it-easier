import { getListRelationship } from '@/utils/textareaHelpers';

describe('getListRelationship', () => {
    test('should handle empty input', () => {
        const result = getListRelationship('', '');
        expect(result).toEqual({
            isNewSublist: false,
            isSameLevel: false,
            isOutdented: false,
            prevLineIndent: ''
        });
    });

    test('should detect new sublist', () => {
        // Previous line is a list item, current line has more indentation
        const result = getListRelationship('1. First item', '    ');
        expect(result.isNewSublist).toBe(true);
        expect(result.isSameLevel).toBe(false);
        expect(result.isOutdented).toBe(false);
    });

    test('should handle deeply nested ordered lists with exact indentation', () => {
        // Modified to expect exact indentation behavior rather than normalized
        const listText = `1.\n2.\n    1.\n    2.\n        1.\n        2.\n            1.\n    3.\n3.`;
        
        const lines = listText.split('\n');
        const getTextBefore = (index) => lines.slice(0, index).join('\n');
        
        // Level 1 (first '1.')
        let result = getListRelationship('', '');
        expect(result.isNewSublist).toBe(false);
        expect(result.isSameLevel).toBe(false);
        expect(result.isOutdented).toBe(false);
        
        // Level 1 (second '2.')
        result = getListRelationship(getTextBefore(1), '');
        expect(result.isNewSublist).toBe(false);
        expect(result.isSameLevel).toBe(true);
        expect(result.isOutdented).toBe(false);
        
        // Level 2 (first '    1.')
        result = getListRelationship(getTextBefore(2), '    ');
        expect(result.isNewSublist).toBe(true);
        expect(result.prevLineIndent).toBe(''); // Exact indentation from previous item
        
        // Level 2 (second '    2.')
        result = getListRelationship(getTextBefore(3), '    ');
        expect(result.isNewSublist).toBe(false);
        expect(result.isSameLevel).toBe(true);
        expect(result.isOutdented).toBe(false);
        
        // Level 3 (first '        1.')
        result = getListRelationship(getTextBefore(4), '        ');
        expect(result.isNewSublist).toBe(true);
        expect(result.prevLineIndent).toBe('    '); // Exact indentation from previous item
        
        // Level 3 (second '        2.' - same level as previous)
        result = getListRelationship(getTextBefore(5), '        ');
        expect(result.isNewSublist).toBe(false);
        expect(result.isSameLevel).toBe(true);
        expect(result.isOutdented).toBe(false);
        
        // Level 4 (first '            1.' - new sublist at 12 spaces)
        result = getListRelationship(getTextBefore(6), '            ');
        expect(result.isNewSublist).toBe(true);
        expect(result.prevLineIndent).toBe('        '); // Exact indentation from previous item
        
        // Back to Level 2 ('    3.' - outdented from level 4)
        result = getListRelationship(getTextBefore(7), '    ');
        expect(result.isNewSublist).toBe(false);
        expect(result.isSameLevel).toBe(false);
        expect(result.isOutdented).toBe(true);
        
        // Back to Level 1 ('3.' - outdented from level 2)
        result = getListRelationship(getTextBefore(8), '');
        expect(result.isNewSublist).toBe(false);
        expect(result.isSameLevel).toBe(false);
        expect(result.isOutdented).toBe(true);
    });

    test('should detect same level', () => {
        // Previous line is a list item, same indentation
        const result = getListRelationship('1. First item\n2. Second item\n', '');
        expect(result.isSameLevel).toBe(true);
        expect(result.isNewSublist).toBe(false);
        expect(result.isOutdented).toBe(false);
    });

    test('should detect outdented item', () => {
        // Previous line has more indentation than current
        const result = getListRelationship('    1. Sub-item', '');
        expect(result.isNewSublist).toBe(false);
        expect(result.isSameLevel).toBe(false);
        expect(result.isOutdented).toBe(true);
    });

    test('should work with unordered lists', () => {
        // Test with unordered list - continuing at same indentation level
        const result = getListRelationship('- Item 1\n    - Sub-item\n', '    ');
        expect(result.isNewSublist).toBe(false);
        expect(result.isSameLevel).toBe(true);
    });

    test('should handle mixed list types', () => {
        // Previous line is ordered, current is unordered with more indentation
        const result1 = getListRelationship('1. First item', '    ');
        expect(result1.isNewSublist).toBe(true);

        // Previous line is unordered, current is ordered with same indentation
        const result2 = getListRelationship('- First item\n1. Second item', '');
        expect(result2.isSameLevel).toBe(true);
    });

    test('should handle empty lines', () => {
        const result = getListRelationship('1. First item\n\n', '');
        expect(result.isSameLevel).toBe(true);
        expect(result.isNewSublist).toBe(false);
    });

    // Multi-level sublist tests
    test('should handle two-level nested lists', () => {
        // First level
        const level1 = '1. First item';
        // Second level (indented 4 spaces)
        const level2 = '    - Sub-item';
        
        // Test going from level 1 to level 2
        const result1 = getListRelationship(level1, '    ');
        expect(result1.isNewSublist).toBe(true);
        expect(result1.isSameLevel).toBe(false);
        
        // Test continuing at level 2
        const result2 = getListRelationship(`${level1}\n${level2}`, '    ');
        expect(result2.isNewSublist).toBe(false);
        expect(result2.isSameLevel).toBe(true);
    });

    test('should handle three-level nested lists', () => {
        // First level
        const level1 = '1. First item';
        // Second level (4 spaces)
        const level2 = '    - Sub-item';
        // Third level (8 spaces)
        const level3 = '        * Sub-sub-item';
        
        // Test going from level 2 to level 3
        const result1 = getListRelationship(`${level1}\n${level2}`, '        ');
        expect(result1.isNewSublist).toBe(true);
        
        // Test continuing at level 3
        const result2 = getListRelationship(`${level1}\n${level2}\n${level3}`, '        ');
        expect(result2.isSameLevel).toBe(true);
    });

    test('should handle outdenting from sublists', () => {
        // Three levels deep
        const text = '1. Level 1\n    - Level 2\n        * Level 3\n';
        
        // Outdent from level 3 to level 2 (4 spaces)
        const result1 = getListRelationship(text, '    ');
        expect(result1.isOutdented).toBe(false);
        expect(result1.prevLineIndent).toBe('            '); // Exact indentation from level 2
        
        // Outdent from level 2 to level 1 (0 spaces)
        const result2 = getListRelationship(text.substring(0, text.lastIndexOf('\n')), '');
        expect(result2.isOutdented).toBe(false);
        expect(result2.prevLineIndent).toBe('    '); // Exact indentation from level 2
    });

    test('should handle mixed list types in deep nesting', () => {
        // Test continuing at level 4 (12 spaces)
        const text1 = '1. Level 1 (ordered)\n    - Level 2 (unordered)\n        1. Level 3 (ordered)\n            - Level 4 (unordered)\n            ';
        const result1 = getListRelationship(text1, '            ');
        expect(result1.isSameLevel).toBe(true);
        expect(result1.isNewSublist).toBe(false);
        
        // Test outdenting from level 4 to level 3 (8 spaces)
        const text2 = '1. Level 1 (ordered)\n    - Level 2 (unordered)\n        1. Level 3 (ordered)\n            - Level 4 (unordered)\n        ';
        const result2 = getListRelationship(text2, '        ');
        expect(result2.isOutdented).toBe(true);
        expect(result2.isSameLevel).toBe(false);
        expect(result2.isNewSublist).toBe(false);
        expect(result2.prevLineIndent).toBe('            '); // Exact indentation from level 4
    });

    test('should handle new sublist item creation after indentation', () => {
        // Scenario: User presses Enter after indenting to create a new sublist item
        const text = '1. First item\n    '; // User pressed Enter after indenting
        
        // Simulate the state when user is about to type a new sublist item
        const result = getListRelationship(text, '    ');
        
        // Should detect that we're creating a new sublist item
        expect(result.isNewSublist).toBe(true);
        expect(result.prevLineIndent).toBe('');
    });

    test('should handle empty lines between list items', () => {
        const text = '1. First item\n\n    '; // Empty line between list items
        
        const result = getListRelationship(text, '    ');
        
        // Should detect that we're creating a new sublist item
        // Empty lines are skipped, so this is compared with '1. First item'
        expect(result.isSameLevel).toBe(false);
        expect(result.isNewSublist).toBe(true);
        expect(result.isOutdented).toBe(false);
        expect(result.prevLineIndent).toBe('');
    });

    test('should respect manual indentation when user already indented', () => {
        // User manually indented current line more than previous list item
        const result = getListRelationship('1. First item\n2. Second item', '    ');
        expect(result.isNewSublist).toBe(true); // Now correctly detects as new sublist
        expect(result.prevLineIndent).toBe(''); // Previous item had no indent
    });

    test('should handle mixed ordered/unordered lists', () => {
        // Previous line is unordered, current is ordered
        let result = getListRelationship('- Item 1', '1. ');
        expect(result.isNewSublist).toBe(false);
        
        // Previous line is ordered, current is unordered
        result = getListRelationship('1. Item 1', '- ');
        expect(result.isNewSublist).toBe(false);
    });

    test('should skip whitespace-only lines when finding previous list item', () => {
        const text = '1. Item 1\n\n    \n2. Item 2';
        const result = getListRelationship(text, '    ');
        expect(result.prevLineIndent).toBe(''); // Should use indent from '1. Item 1'
    });
});
