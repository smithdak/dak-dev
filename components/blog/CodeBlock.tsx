'use client';

import { useState } from 'react';
import * as m from 'framer-motion/m';

export interface CodeBlockProps {
  children: string;
  className?: string;
  highlightedHtml?: string;
  language?: string;
  highlightLines?: number[];
  isDiff?: boolean;
  showLineNumbers?: boolean;
}

/**
 * Advanced code block component with the editorial code-plate styling.
 * Features: line numbers, copy button, diff support, line highlighting
 */
export function CodeBlock({
  children,
  className = '',
  highlightedHtml,
  language = 'text',
  highlightLines = [],
  isDiff = false,
  showLineNumbers = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // Extract language from className (e.g., "language-javascript")
  const langMatch = className.match(/language-(\w+)/);
  const displayLang = langMatch ? langMatch[1] : language;

  // Get clean code content for copying
  const codeContent = typeof children === 'string' ? children.trim() : '';

  const handleCopy = async () => {
    try {
      // Remove diff markers and get clean code
      const cleanCode = codeContent
        .split('\n')
        .map((line) => {
          // Remove leading +/- if in diff mode
          if (isDiff && (line.startsWith('+') || line.startsWith('-'))) {
            return line.slice(1);
          }
          return line;
        })
        .join('\n');

      await navigator.clipboard.writeText(cleanCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      void error;
    }
  };

  // Split code into lines for processing
  const lines = codeContent.split('\n');

  return (
    <div className="relative group my-6">
      {/* Language badge and copy button */}
      <div className="flex items-center justify-between px-4 py-2 bg-surface border-2 border-b-0 border-text">
        <span className="text-xs font-semibold text-text uppercase tracking-wider">
          {displayLang}
        </span>
        <m.button
          onClick={handleCopy}
          aria-label={copied ? 'Code copied' : 'Copy code to clipboard'}
          className={`px-3 py-1 text-xs font-semibold border-2 border-background
                     focus:outline-none focus:ring-2 focus:ring-text focus:ring-offset-2
                     focus:ring-offset-surface transition-colors ${
                       copied
                         ? 'bg-accent text-background'
                         : 'bg-text text-background hover:bg-muted'
                     }`}
          animate={copied ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 0.2 }}
        >
          {copied ? 'COPIED!' : 'COPY'}
        </m.button>
      </div>

      {/* Code container */}
      <div className="relative overflow-hidden border border-code-rule bg-code-canvas text-code-foreground">
        <div className="overflow-x-auto">
          {highlightedHtml ? (
            // Use pre-highlighted HTML from Shiki
            <div dangerouslySetInnerHTML={{ __html: highlightedHtml }} className="shiki-wrapper" />
          ) : (
            // Fallback rendering
            <div className="flex">
              {/* Line numbers gutter */}
              {showLineNumbers && (
                <div
                  className="flex-shrink-0 select-none border-r border-code-rule px-4 py-4 text-right"
                  aria-hidden="true"
                >
                  {lines.map((_, i) => {
                    const lineNum = i + 1;
                    const isHighlighted = highlightLines.includes(lineNum);
                    return (
                      <div
                        key={lineNum}
                        className={`font-mono text-xs leading-6 ${
                          isHighlighted ? 'font-bold text-code-foreground' : 'text-code-muted'
                        }`}
                      >
                        {lineNum}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Code content */}
              <div className="flex-1 px-4 py-4">
                <pre className="font-mono text-sm leading-6">
                  <code className="text-code-foreground">
                    {lines.map((line, i) => {
                      const lineNum = i + 1;
                      const isHighlighted = highlightLines.includes(lineNum);
                      const isDiffLine = isDiff && (line.startsWith('+') || line.startsWith('-'));
                      const isAddition = line.startsWith('+');
                      return (
                        <div
                          key={i}
                          className={`${
                            isHighlighted
                              ? 'bg-code-highlight/10 border-l-2 border-code-highlight pl-2 -ml-2'
                              : ''
                          } ${
                            isDiffLine
                              ? isAddition
                                ? 'bg-code-add/10 border-l-2 border-code-add pl-2 -ml-2'
                                : 'bg-code-remove/10 border-l-2 border-code-remove pl-2 -ml-2'
                              : ''
                          }`}
                        >
                          {isDiffLine && (
                            <span
                              className={`inline-block w-4 ${isAddition ? 'text-code-add' : 'text-code-remove'}`}
                              aria-label={isAddition ? 'Added line' : 'Removed line'}
                            >
                              {isAddition ? '+' : '-'}
                            </span>
                          )}
                          <span>{isDiffLine ? line.slice(1) : line}</span>
                        </div>
                      );
                    })}
                  </code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
