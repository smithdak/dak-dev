import { codeToHtml, BundledLanguage } from 'shiki';
import { editorialCodeTheme } from './shiki-theme';

// Cache for Shiki highlighter to avoid re-initialization
let highlighterPromise: Promise<void> | null = null;

/**
 * Initialize Shiki (called once at build time)
 */
async function initHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = Promise.resolve();
  }
  return highlighterPromise;
}

/**
 * Parse metadata from code fence info string
 * Examples:
 *   js {1,3-5}
 *   typescript diff
 *   python {2-4} diff
 */
export interface CodeMetadata {
  language: string;
  highlightLines: number[];
  isDiff: boolean;
}

export function parseCodeMetadata(metastring: string = ''): CodeMetadata {
  const parts = metastring.trim().split(/\s+/);
  const language = parts[0] || 'text';
  const isDiff = parts.includes('diff');

  // Find highlight range like {1,3-5}
  const rangeMatch = metastring.match(/\{([0-9,-]+)\}/);
  const highlightLines: number[] = [];

  if (rangeMatch) {
    const ranges = rangeMatch[1].split(',');
    ranges.forEach((range) => {
      if (range.includes('-')) {
        const [start, end] = range.split('-').map(Number);
        for (let i = start; i <= end; i++) {
          highlightLines.push(i);
        }
      } else {
        highlightLines.push(Number(range));
      }
    });
  }

  return { language, highlightLines, isDiff };
}

/**
 * Highlight code with Shiki at build time
 */
export async function highlightCode(
  code: string,
  language: string = 'text',
  options: {
    highlightLines?: number[];
    isDiff?: boolean;
  } = {}
): Promise<string> {
  await initHighlighter();

  try {
    // Validate language - fallback to text if unsupported
    const validLanguage = language as BundledLanguage;

    const html = await codeToHtml(code, {
      lang: validLanguage,
      theme: editorialCodeTheme,
      defaultColor: false,
    });

    return html;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Failed to highlight code for language "${language}":`, error);
    }
    // Fallback to plain text if language is not supported
    return await codeToHtml(code, {
      lang: 'text',
      theme: editorialCodeTheme,
      defaultColor: false,
    });
  }
}

/**
 * Get all supported languages
 */
export const supportedLanguages = [
  'javascript',
  'typescript',
  'jsx',
  'tsx',
  'python',
  'rust',
  'go',
  'java',
  'c',
  'cpp',
  'csharp',
  'php',
  'ruby',
  'swift',
  'kotlin',
  'bash',
  'shell',
  'json',
  'yaml',
  'markdown',
  'html',
  'css',
  'scss',
  'sql',
  'graphql',
] as const;
