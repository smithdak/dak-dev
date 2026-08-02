'use client';

import { useState } from 'react';
import type { ToolName, ToolExample } from '@/lib/patterns';

const TOOL_ORDER: ToolName[] = ['claude-code', 'cursor', 'copilot', 'windsurf'];

const TOOL_LABELS: Record<ToolName, string> = {
  'claude-code': 'CLAUDE CODE',
  cursor: 'CURSOR',
  copilot: 'COPILOT',
  windsurf: 'WINDSURF',
};

interface ToolExamplesProps {
  examples: Record<ToolName, ToolExample>;
}

export function ToolExamples({ examples }: ToolExamplesProps) {
  const [active, setActive] = useState<ToolName>('claude-code');
  const current = examples[active];

  return (
    <div className="mt-12 border-t border-text/20 pt-8">
      <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-muted mb-4">
        Tool-Specific Examples
      </h2>

      {/* Tab bar */}
      <div className="mb-0 flex border-b border-text/20" role="tablist">
        {TOOL_ORDER.map((tool) => {
          const isActive = active === tool;
          return (
            <button
              key={tool}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(tool)}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset ${
                isActive
                  ? '-mb-px border-b-2 border-accent font-bold text-text'
                  : 'text-muted hover:text-text'
              }`}
            >
              {TOOL_LABELS[tool]}
            </button>
          );
        })}
      </div>

      {/* Content panel */}
      <div className="border-b border-text/20 bg-background py-6">
        {current && (
          <>
            <p className="text-sm text-muted mb-4 leading-relaxed">{current.description}</p>
            <pre className="overflow-x-auto bg-surface/50 border border-text/20 p-4">
              <code className="text-sm font-mono text-text whitespace-pre-wrap">
                {current.code}
              </code>
            </pre>
          </>
        )}
      </div>
    </div>
  );
}
