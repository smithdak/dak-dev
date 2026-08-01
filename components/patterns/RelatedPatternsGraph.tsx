import Link from 'next/link';
import type { Pattern, PatternRelationship, RelationshipType } from '@/lib/patterns';

const CHAPTER_COLORS: Record<number, string> = {
  1: 'var(--color-chapter-1)',
  2: 'var(--color-chapter-2)',
  3: 'var(--color-chapter-3)',
  4: 'var(--color-chapter-4)',
  5: 'var(--color-chapter-5)',
  6: 'var(--color-chapter-6)',
};

const EDGE_COLORS: Record<RelationshipType, string> = {
  enables: 'var(--color-chapter-1)',
  composes: 'var(--color-chapter-2)',
  prevents: 'var(--color-chapter-6)',
  contrasts: 'var(--color-chapter-4)',
};

const EDGE_DASH: Record<RelationshipType, string> = {
  enables: '',
  composes: '',
  prevents: '6 3',
  contrasts: '2 3',
};

interface RelatedPatternsGraphProps {
  currentPattern: Pattern;
  relatedPatterns: (Pattern & { relationship: PatternRelationship })[];
}

function computeLayout(count: number) {
  const cx = 140;
  const cy = 140;
  const radius = count <= 3 ? 85 : count <= 5 ? 95 : 105;
  const angleOffset = -Math.PI / 2;

  return Array.from({ length: count }, (_, i) => {
    const angle = angleOffset + (2 * Math.PI * i) / count;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });
}

export function RelatedPatternsGraph({
  currentPattern,
  relatedPatterns,
}: RelatedPatternsGraphProps) {
  if (relatedPatterns.length === 0) return null;

  const cx = 140;
  const cy = 140;
  const positions = computeLayout(relatedPatterns.length);

  const centerColor = CHAPTER_COLORS[currentPattern.frontmatter.chapter] || CHAPTER_COLORS[1];

  return (
    <div className="border-2 border-text/40 bg-background/80 p-6 md:p-8 h-full flex flex-col">
      <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
        Relationship Map
      </h2>
      <div className="flex-1 flex items-center justify-center">
        <svg
          viewBox="0 0 280 280"
          className="w-full max-w-[320px]"
          role="img"
          aria-label={`Relationship graph for ${currentPattern.frontmatter.name} showing ${relatedPatterns.length} related pattern${relatedPatterns.length !== 1 ? 's' : ''}`}
        >
          <style>{`
          .rg-node { opacity: 0.35; transition: opacity 150ms ease; }
          .rg-node:hover, .rg-node:focus { opacity: 1; }
          @media (prefers-reduced-motion: reduce) { .rg-node { transition: none; } }
        `}</style>
          {/* Related patterns — edge + node grouped per pattern for hover */}
          {relatedPatterns.map((rp, i) => {
            const pos = positions[i];
            const edgeColor = EDGE_COLORS[rp.relationship.type];
            const dash = EDGE_DASH[rp.relationship.type];
            const nodeColor = CHAPTER_COLORS[rp.frontmatter.chapter] || CHAPTER_COLORS[1];
            const nodeW = 86;
            const nodeH = 40;
            return (
              <a
                key={`node-${rp.frontmatter.slug}`}
                href={`/learn/patterns/${rp.frontmatter.slug}`}
                className="rg-node"
                style={{ outline: 'none' }}
              >
                {/* Edge line */}
                <line
                  x1={cx}
                  y1={cy}
                  x2={pos.x}
                  y2={pos.y}
                  stroke={edgeColor}
                  strokeWidth={2.5}
                  strokeDasharray={dash || undefined}
                />
                {/* Shadow rect */}
                <rect
                  x={pos.x - nodeW / 2 + 3}
                  y={pos.y - nodeH / 2 + 3}
                  width={nodeW}
                  height={nodeH}
                  fill="var(--color-text)"
                  opacity={0.25}
                />
                {/* Node rect */}
                <rect
                  x={pos.x - nodeW / 2}
                  y={pos.y - nodeH / 2}
                  width={nodeW}
                  height={nodeH}
                  fill="var(--color-background)"
                  stroke={nodeColor}
                  strokeWidth={2.5}
                />
                {/* Pattern number */}
                <text
                  x={pos.x}
                  y={pos.y - 5}
                  textAnchor="middle"
                  fill={nodeColor}
                  fontSize={11}
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {rp.frontmatter.number}
                </text>
                {/* Pattern name (truncated) */}
                <text
                  x={pos.x}
                  y={pos.y + 10}
                  textAnchor="middle"
                  fill="var(--color-text)"
                  fontSize={9}
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {rp.frontmatter.name.length > 12
                    ? rp.frontmatter.name.slice(0, 11) + '\u2026'
                    : rp.frontmatter.name}
                </text>
              </a>
            );
          })}

          {/* Center node (current pattern) — drawn last so it's on top */}
          <rect
            x={cx - 54 + 3}
            y={cy - 24 + 3}
            width={108}
            height={48}
            fill="var(--color-text)"
            opacity={0.3}
          />
          <rect
            x={cx - 54}
            y={cy - 24}
            width={108}
            height={48}
            fill="var(--color-background)"
            stroke={centerColor}
            strokeWidth={3}
          />
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            fill={centerColor}
            fontSize={12}
            fontFamily="monospace"
            fontWeight="bold"
          >
            {currentPattern.frontmatter.number}
          </text>
          <text
            x={cx}
            y={cy + 12}
            textAnchor="middle"
            fill="var(--color-text)"
            fontSize={10}
            fontFamily="monospace"
            fontWeight="bold"
          >
            {currentPattern.frontmatter.name.length > 14
              ? currentPattern.frontmatter.name.slice(0, 13) + '\u2026'
              : currentPattern.frontmatter.name}
          </text>
        </svg>
      </div>

      {/* Legend — each item links to the first related pattern of that type */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 pt-3 border-t border-text/15">
        {(['enables', 'composes', 'prevents', 'contrasts'] as const).map((type) => {
          const match = relatedPatterns.find((rp) => rp.relationship.type === type);
          if (!match) return null;
          return (
            <Link
              key={type}
              href={`/learn/patterns/${match.frontmatter.slug}`}
              className="flex items-center gap-1.5 transition-colors hover:text-text focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-background"
            >
              <svg width="20" height="8" aria-hidden="true">
                <line
                  x1={0}
                  y1={4}
                  x2={20}
                  y2={4}
                  stroke={EDGE_COLORS[type]}
                  strokeWidth={2.5}
                  strokeDasharray={EDGE_DASH[type] || undefined}
                />
              </svg>
              <span className="text-[10px] font-mono text-text uppercase hover:text-text transition-colors">
                {type}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
