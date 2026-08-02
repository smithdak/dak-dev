import type { ThemeRegistration } from 'shiki';

/**
 * Ink-and-patina syntax theme for the editorial design system.
 *
 * Shiki supports arbitrary CSS color values, so the renderer emits the same
 * tokens defined in globals.css instead of maintaining a second palette here.
 * The single dark code plate is deliberate in both reading themes.
 */
export const editorialCodeTheme: ThemeRegistration = {
  name: 'dakota-editorial-ink',
  type: 'dark',
  colors: {
    'editor.background': 'var(--color-code-canvas)',
    'editor.foreground': 'var(--color-code-foreground)',
    'editorLineNumber.foreground': 'var(--color-code-muted)',
    'editorLineNumber.activeForeground': 'var(--color-code-foreground)',
    'editor.selectionBackground': 'var(--color-code-selection)',
    'editor.lineHighlightBackground': 'var(--color-code-line-highlight)',
    'activityBar.background': 'var(--color-code-canvas)',
    'sideBar.background': 'var(--color-code-canvas)',
    'terminal.background': 'var(--color-code-canvas)',
  },
  tokenColors: [
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: {
        foreground: 'var(--color-code-muted)',
        fontStyle: 'italic',
      },
    },
    {
      scope: ['string', 'string.quoted'],
      settings: {
        foreground: 'var(--color-code-string)',
      },
    },
    {
      scope: ['constant.numeric', 'constant.language', 'constant.character'],
      settings: {
        foreground: 'var(--color-code-number)',
      },
    },
    {
      scope: ['keyword', 'storage.type', 'storage.modifier'],
      settings: {
        foreground: 'var(--color-code-keyword)',
        fontStyle: 'bold',
      },
    },
    {
      scope: ['keyword.control', 'keyword.operator'],
      settings: {
        foreground: 'var(--color-code-keyword)',
      },
    },
    {
      scope: ['entity.name.function', 'support.function'],
      settings: {
        foreground: 'var(--color-code-function)',
      },
    },
    {
      scope: ['entity.name.type', 'entity.name.class', 'support.class'],
      settings: {
        foreground: 'var(--color-code-type)',
      },
    },
    {
      scope: ['variable', 'variable.parameter'],
      settings: {
        foreground: 'var(--color-code-foreground)',
      },
    },
    {
      scope: ['variable.language'],
      settings: {
        foreground: 'var(--color-code-special)',
        fontStyle: 'italic',
      },
    },
    {
      scope: ['entity.name.tag'],
      settings: {
        foreground: 'var(--color-code-function)',
      },
    },
    {
      scope: ['entity.other.attribute-name'],
      settings: {
        foreground: 'var(--color-code-string)',
      },
    },
    {
      scope: ['markup.heading'],
      settings: {
        foreground: 'var(--color-code-type)',
        fontStyle: 'bold',
      },
    },
    {
      scope: ['markup.bold'],
      settings: {
        foreground: 'var(--color-code-number)',
        fontStyle: 'bold',
      },
    },
    {
      scope: ['markup.italic'],
      settings: {
        foreground: 'var(--color-code-foreground)',
        fontStyle: 'italic',
      },
    },
    {
      scope: ['markup.inline.raw', 'markup.fenced_code'],
      settings: {
        foreground: 'var(--color-code-string)',
      },
    },
    {
      scope: ['punctuation'],
      settings: {
        foreground: 'var(--color-code-punctuation)',
      },
    },
    {
      scope: ['invalid'],
      settings: {
        foreground: 'var(--color-code-invalid)',
        fontStyle: 'bold',
      },
    },
  ],
};
