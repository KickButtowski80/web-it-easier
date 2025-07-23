<template>

    <div class="markdown-toolbar">
        <button type="button" class="toolbar-btn" title="Heading 1" @click="insertMarkdown('# ', '')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 12h16"></path>
                <path d="M4 18h16"></path>
                <path d="M4 6h16"></path>
            </svg>
            <span>H1</span>
        </button>
        <button type="button" class="toolbar-btn" title="Heading 2" @click="insertMarkdown('## ', '')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 12h16"></path>
                <path d="M4 18h16"></path>
                <path d="M4 6h16"></path>
            </svg>
            <span>H2</span>
        </button>
        <div class="toolbar-divider"></div>
        <button type="button" class="toolbar-btn" title="Bold" @click="insertMarkdown('**', '**')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
            </svg>
        </button>
        <button type="button" class="toolbar-btn" title="Italic" @click="insertMarkdown('*', '*')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="4" x2="10" y2="4"></line>
                <line x1="14" y1="20" x2="5" y2="20"></line>
                <line x1="15" y1="4" x2="9" y2="20"></line>
            </svg>
        </button>
        <button type="button" class="toolbar-btn" title="Code" @click="insertMarkdown('`', '`')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
        </button>
        <div class="toolbar-divider"></div>
        <button type="button" class="toolbar-btn" title="Bulleted List" @click="insertMarkdown('- ', '')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
        </button>
        <button type="button" class="toolbar-btn" title="Add Numbered List Item"
            @click="insertMarkdown('1. ', '')">
            <span style="margin-right: 4px;">+</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="10" y1="6" x2="21" y2="6"></line>
                <line x1="10" y1="12" x2="21" y2="12"></line>
                <line x1="10" y1="18" x2="21" y2="18"></line>
                <path d="M4 6h1v4"></path>
                <path d="M4 10h2"></path>
                <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
            </svg>
        </button>
        <div class="toolbar-divider"></div>
        <button type="button" class="toolbar-btn" title="Link" @click="insertMarkdown('[', '](url)')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
        </button>
        <button type="button" class="toolbar-btn" title="Image" @click="insertMarkdown('![', '](image-url)')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
        </button>
        <button type="button" class="toolbar-btn" title="Blockquote" @click="insertMarkdown('> ', '')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
        </button>
        <button type="button" class="toolbar-btn" title="Code Block" @click="insertMarkdown('```\n', '\n```')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            <span>{ }</span>
        </button>
        <div class="toolbar-divider"></div>
        <button type="button" class="toolbar-btn" title="Strikethrough" @click="insertMarkdown('~~', '~~')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 9V6a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v3"></path>
                <path d="M3 12h18"></path>
                <path d="M17 18v-3a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v3"></path>
            </svg>
        </button>
        <button type="button" class="toolbar-btn" title="Horizontal Rule" @click="insertMarkdown('\n---\n', '')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
        </button>

        <button type="button" class="toolbar-btn" title="Table" @click="insertMarkdown('| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |\n', '')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="3" y1="15" x2="21" y2="15"></line>
                <line x1="9" y1="3" x2="9" y2="21"></line>
                <line x1="15" y1="3" x2="15" y2="21"></line>
            </svg>
        </button>
    </div>
</template>

<script setup>


// Define emits for parent component communication
const emit = defineEmits(['format']);

// Function to handle markdown toolbar button clicks
const insertMarkdown = (prefix, suffix) => {  
    emit('format', { prefix, suffix });
};

</script>

<style scoped>
/* Markdown Toolbar */
.markdown-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    padding: 0.5rem;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 6px 6px 0 0;
    margin-bottom: -1px;
}

.toolbar-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    padding: 0.4rem 0.6rem;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    color: #4a5568;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.15s ease;
}

.toolbar-btn:hover {
    background: #f8fafc;
    border-color: #cbd5e0;
    color: #4c1d95;
}

.toolbar-btn:active {
    background: #edf2f7;
    transform: translateY(1px);
}

.toolbar-btn svg {
    width: 16px;
    height: 16px;
}

.toolbar-divider {
    width: 1px;
    height: 24px;
    background: #e2e8f0;
    margin: 0 0.25rem;
}

@media (max-width: 767px) {
    .markdown-editor {
        display: flex;
        flex-direction: column;
    }

    .markdown-toolbar {
        overflow-x: auto;
        padding-bottom: 0.75rem;
    }
}
</style>