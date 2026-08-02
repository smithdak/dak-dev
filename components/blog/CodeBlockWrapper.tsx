'use client';

import { useEffect, useRef } from 'react';

export function CodeBlockWrapper({ children }: { children: React.ReactNode }) {
  const preRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Find all pre elements and add copy buttons
    if (!preRef.current) return;

    const preElements = preRef.current.querySelectorAll('pre');

    preElements.forEach((pre) => {
      // Skip if already wrapped in a code-block-container
      if (pre.closest('.code-block-container')) return;

      // Extract language from data attribute or class
      const code = pre.querySelector('code');
      const language =
        pre.getAttribute('data-language') ||
        code?.getAttribute('data-language') ||
        code?.className?.match(/language-(\w+)/)?.[1] ||
        'text';

      // Create container wrapper
      const container = document.createElement('div');
      container.className = 'code-block-container';

      // Create wrapper for language badge and copy button
      const wrapper = document.createElement('div');
      wrapper.className = 'copy-button-wrapper';
      wrapper.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem 1rem;
        background-color: var(--color-surface);
        border-bottom: 1px solid var(--color-rule);
      `;

      // Language badge
      const badge = document.createElement('span');
      badge.textContent = language.toUpperCase();
      badge.style.cssText = `
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--color-text);
        letter-spacing: 0.05em;
        font-family: var(--font-sans);
      `;

      // Copy button
      const button = document.createElement('button');
      button.textContent = 'COPY';
      button.className = 'copy-code-button';
      button.setAttribute('aria-label', 'Copy code to clipboard');
      button.style.cssText = `
        padding: 0.25rem 0.75rem;
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--color-text);
        background-color: transparent;
        border: 0;
        border-bottom: 1px solid var(--color-text);
        cursor: pointer;
        transition: background-color 0.2s;
        font-family: var(--font-sans);
      `;

      button.addEventListener('mouseenter', () => {
        button.style.color = 'var(--color-accent)';
      });

      button.addEventListener('mouseleave', () => {
        if (button.textContent !== 'COPIED!') {
          button.style.color = 'var(--color-text)';
        }
      });

      button.addEventListener('click', async () => {
        const codeElement = pre.querySelector('code');
        if (!codeElement) return;

        // Get text content, excluding line numbers and other UI elements
        const codeText = codeElement.textContent || '';

        try {
          await navigator.clipboard.writeText(codeText);
          button.textContent = 'COPIED!';
          button.style.color = 'var(--color-accent)';
          setTimeout(() => {
            button.textContent = 'COPY';
            button.style.color = 'var(--color-text)';
          }, 2000);
        } catch (error) {
          void error;
        }
      });

      wrapper.appendChild(badge);
      wrapper.appendChild(button);

      // Wrap the pre in the container: insert container before pre, then move pre inside
      pre.parentNode?.insertBefore(container, pre);
      container.appendChild(wrapper);
      container.appendChild(pre);
    });
  }, [children]);

  return <div ref={preRef}>{children}</div>;
}
