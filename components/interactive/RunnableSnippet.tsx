'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * RunnableSnippet — progressively-enhanced, runnable code embed (Codapi).
 *
 * DESIGN INTENT / SECURITY POSTURE
 * --------------------------------
 * This site ships a deliberately hardened CSP (next.config.ts) and treats
 * Lighthouse Best-Practices=100 as a merge gate (DESIGN.md §10, §12). Running
 * code in the browser via Codapi requires relaxing that CSP (a CDN origin in
 * connect-src for WASI wasm, plus 'wasm-unsafe-eval'). That is a real, outward-
 * facing security tradeoff, so runnable mode is OPT-IN and OFF by default:
 *
 *   - Default (flag unset): renders a clean, static, neo-brutalist code block.
 *     Zero third-party script, zero CSP change, zero Lighthouse risk.
 *   - Enabled (NEXT_PUBLIC_ENABLE_CODAPI === 'true'): lazily loads the Codapi
 *     web component and upgrades the block into a runnable playground.
 *
 * To turn it on, see DESIGN.md "Runnable code embeds" for the exact CSP diff.
 *
 * Engines (Codapi browser-only, no server — satisfies the SSG constraint):
 *   engine="browser" sandbox="javascript" | "fetch"   (no wasm)
 *   engine="wasi"    sandbox="python" | "sqlite" | …   (needs wasm-unsafe-eval)
 */

const CODAPI_ENABLED = process.env.NEXT_PUBLIC_ENABLE_CODAPI === 'true';
const CODAPI_VERSION = '0.20.0';
const RUNNO_VERSION = '0.6.1';

type Engine = 'browser' | 'wasi';

interface RunnableSnippetProps {
  /** The starting source code. */
  code: string;
  /** Codapi sandbox id, e.g. "javascript", "python", "sqlite". */
  sandbox?: string;
  /** Codapi engine. "browser" needs no wasm; "wasi" does. */
  engine?: Engine;
  /** Display language label / Shiki hint. */
  language?: string;
}

let scriptsPromise: Promise<void> | null = null;

/** Load the Codapi web-component scripts once, in order. */
function loadCodapi(engine: Engine): Promise<void> {
  if (scriptsPromise) return scriptsPromise;

  const inject = (src: string, module = false) =>
    new Promise<void>((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        resolve();
        return;
      }
      const el = document.createElement('script');
      el.src = src;
      if (module) el.type = 'module';
      el.onload = () => resolve();
      el.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(el);
    });

  const base = `https://unpkg.com/@antonz/codapi@${CODAPI_VERSION}/dist`;
  scriptsPromise = (async () => {
    if (engine === 'wasi') {
      await inject(`https://unpkg.com/@antonz/runno@${RUNNO_VERSION}/dist/runno.js`);
      await inject(`${base}/engine/wasi.js`);
    }
    await inject(`${base}/snippet.js`);
  })();
  return scriptsPromise;
}

export function RunnableSnippet({
  code,
  sandbox = 'javascript',
  engine = 'browser',
  language,
}: RunnableSnippetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    if (!CODAPI_ENABLED) return;
    let cancelled = false;
    loadCodapi(engine)
      .then(() => {
        if (!cancelled) setEnhanced(true);
      })
      .catch(() => {
        /* Stay in static fallback on load failure. */
      });
    return () => {
      cancelled = true;
    };
  }, [engine]);

  const langLabel = language || sandbox;

  return (
    <div
      ref={containerRef}
      className="my-8 border-2 border-text"
      data-runnable={enhanced ? 'on' : 'off'}
    >
      <div className="flex items-center justify-between border-b-2 border-text bg-surface px-3 py-1.5">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted">
          {langLabel}
        </span>
        {enhanced ? (
          <span
            className="font-mono text-[10px] font-bold uppercase tracking-widest"
            style={{ color: 'var(--color-accent)' }}
          >
            ▶ runnable
          </span>
        ) : (
          CODAPI_ENABLED && (
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
              loading…
            </span>
          )
        )}
      </div>

      {/* The <pre> is the canonical code source: always present, no-JS safe,
          and the element Codapi enhances when scripts load. */}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className={`language-${sandbox}`}>{code}</code>
      </pre>

      {enhanced && (
        // @ts-expect-error — codapi-snippet is a runtime-registered custom element
        <codapi-snippet engine={engine} sandbox={sandbox} editor="basic" />
      )}
    </div>
  );
}
