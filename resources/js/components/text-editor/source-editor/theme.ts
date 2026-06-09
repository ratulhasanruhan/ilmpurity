import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { tags as t } from '@lezer/highlight';

export const themeConfig = EditorView.theme({
    '&': {
        color: 'inherit',
        fontSize: '90%',
        backgroundColor: 'inherit',
        outline: 'none !important',
        display: 'block !important',
        width: '100%',
        minHeight: 'inherit',
        cursor: 'text',
        height: '100%',
    },
    '.cm-content': {
        lineHeight: 1.75,
        fontFamily: 'var(--font-mono)',
        // Ensure caret is visible against dark backgrounds
        caretColor: 'hsl(var(--foreground, 0 0% 100%))',
        padding: '10px 0',
    },
    '.cm-scroller': {
        minHeight: 'inherit',
        height: '100%',
    },
    // Make caret and selections visible in dark mode
    '.cm-cursor': {
        borderLeftColor: 'inherit',
    },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': {
        backgroundColor: 'rgba(59, 130, 246, 0.25)', // blue-500/25
    },
    '.cm-gutters': {
        color: 'inherit',
        backgroundColor: 'inherit',
        borderRight: 'unset',
    },
    '.cm-lineNumbers .cm-gutterElement': {
        paddingRight: '24px',
        opacity: '75%',
    },
    '.cm-lineWrapping ': {
        wordBreak: 'break-all !important',
    },
    // Autocomplete tooltip styling that adapts to app theme tokens
    '.cm-tooltip': {
        backgroundColor: 'hsl(var(--popover, 0 0% 10%))',
        color: 'hsl(var(--popover-foreground, 0 0% 98%))',
        border: '1px solid hsl(var(--border, 0 0% 25%))',
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        zIndex: 60,
    },
    '.cm-tooltip-autocomplete': {
        '& > ul': { maxHeight: '240px', overflow: 'auto' },
    },
    '.cm-tooltip-autocomplete ul li': {
        padding: '6px 8px',
    },
    '.cm-tooltip-autocomplete ul li[aria-selected]': {
        backgroundColor: 'hsl(var(--accent, 0 0% 20%))',
        color: 'hsl(var(--accent-foreground, 0 0% 98%))',
    },
    // Highlight of matching text in the autocomplete suggestion list
    '.cm-completionMatchedText': {
        color: '#60a5fa', // tailwind sky-400
        fontWeight: 600,
        textDecoration: 'none',
    },
});

// Inline colors to avoid requiring external CSS
export const highlightStyle = HighlightStyle.define([
    { tag: [t.comment], color: '#64748b' }, // slate-500
    { tag: [t.keyword, t.typeName, t.typeOperator], color: '#7c3aed', fontWeight: '500' }, // violet-600
    { tag: [t.string, t.meta, t.regexp], color: '#16a34a' }, // green-600
    { tag: [t.number, t.bool], color: '#ea580c' }, // orange-600
    { tag: [t.operator, t.name], color: '#0ea5e9' }, // sky-500
    { tag: [t.variableName, t.attributeName, t.propertyName], color: '#0ea5e9' },
    { tag: [t.className], color: '#22d3ee' }, // cyan-400
    { tag: [t.tagName], color: '#e11d48' }, // rose-600
    { tag: [t.heading, t.strong], color: '#111827', fontWeight: 'bold' },
    { tag: [t.emphasis], color: '#111827', fontStyle: 'italic' },
    { tag: [t.link], textDecoration: 'underline' },
    { tag: [t.strikethrough], textDecoration: 'line-through' },
    { tag: [t.invalid], color: '#ef4444' }, // red-500
]);

export const theme: Extension = [themeConfig, syntaxHighlighting(highlightStyle)];
