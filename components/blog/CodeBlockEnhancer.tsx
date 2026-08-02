'use client';

import { useEffect } from 'react';

export function CodeBlockEnhancer({ rootId }: { rootId: string }) {
  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;

    const cleanups: Array<() => void> = [];

    const enhanceCodeBlocks = () => {
      root.querySelectorAll('pre').forEach((pre) => {
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

        const resetTimeouts = new Set<number>();
        const handleMouseEnter = () => {
          button.style.color = 'var(--color-accent)';
        };
        const handleMouseLeave = () => {
          if (button.textContent !== 'COPIED!') {
            button.style.color = 'var(--color-text)';
          }
        };
        const handleClick = async () => {
          const codeElement = pre.querySelector('code');
          if (!codeElement) return;

          // Get text content, excluding line numbers and other UI elements
          const codeText = codeElement.textContent || '';

          try {
            await navigator.clipboard.writeText(codeText);
            if (!button.isConnected) return;

            button.textContent = 'COPIED!';
            button.style.color = 'var(--color-accent)';
            const resetTimeout = window.setTimeout(() => {
              resetTimeouts.delete(resetTimeout);
              button.textContent = 'COPY';
              button.style.color = 'var(--color-text)';
            }, 2000);
            resetTimeouts.add(resetTimeout);
          } catch (error) {
            void error;
          }
        };

        button.addEventListener('mouseenter', handleMouseEnter);
        button.addEventListener('mouseleave', handleMouseLeave);
        button.addEventListener('click', handleClick);

        wrapper.appendChild(badge);
        wrapper.appendChild(button);

        // Wrap the pre in the container: insert container before pre, then move pre inside
        pre.parentNode?.insertBefore(container, pre);
        container.appendChild(wrapper);
        container.appendChild(pre);

        cleanups.push(() => {
          resetTimeouts.forEach((timeout) => window.clearTimeout(timeout));
          button.removeEventListener('mouseenter', handleMouseEnter);
          button.removeEventListener('mouseleave', handleMouseLeave);
          button.removeEventListener('click', handleClick);

          if (container.parentNode && container.contains(pre)) {
            container.parentNode.replaceChild(pre, container);
          } else {
            container.remove();
          }
        });
      });
    };

    enhanceCodeBlocks();

    const observer = new MutationObserver(enhanceCodeBlocks);
    observer.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      cleanups.reverse().forEach((cleanup) => cleanup());
    };
  }, [rootId]);

  return null;
}
