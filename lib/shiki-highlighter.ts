import { createHighlighter, type Highlighter } from 'shiki';
import { editorialCodeTheme } from './shiki-theme';

const globalForShiki = globalThis as unknown as {
  __shikiHighlighter?: Promise<Highlighter>;
};

export function getHighlighterInstance(): Promise<Highlighter> {
  if (!globalForShiki.__shikiHighlighter) {
    globalForShiki.__shikiHighlighter = createHighlighter({
      themes: [editorialCodeTheme],
      langs: [
        'typescript',
        'javascript',
        'jsx',
        'tsx',
        'json',
        'bash',
        'shell',
        'css',
        'html',
        'markdown',
        'yaml',
        'python',
        'plaintext',
      ],
    });
  }
  return globalForShiki.__shikiHighlighter;
}
