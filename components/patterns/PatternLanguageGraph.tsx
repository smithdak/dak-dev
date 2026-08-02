'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { GraphNode, GraphEdge } from '@/lib/graph-layout';
import type { RelationshipType } from '@/lib/patterns';

const CHAPTER_COLORS: Record<number, string> = {
  1: 'var(--color-chapter-1)',
  2: 'var(--color-chapter-2)',
  3: 'var(--color-chapter-3)',
  4: 'var(--color-chapter-4)',
  5: 'var(--color-chapter-5)',
  6: 'var(--color-chapter-6)',
};

const CHAPTER_NAMES: Record<number, string> = {
  1: 'FOUNDATION',
  2: 'CONTEXT',
  3: 'TASK',
  4: 'STEERING',
  5: 'VERIFICATION',
  6: 'RECOVERY',
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

const NODE_W = 150;
const NODE_H = 62;

interface PatternLanguageGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  width: number;
  height: number;
  columnCount: number;
  sidePadding: number;
  topPadding: number;
}

export function PatternLanguageGraph({
  nodes,
  edges,
  width,
  height,
  columnCount,
  sidePadding,
}: PatternLanguageGraphProps) {
  const router = useRouter();
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const nodeMap = useMemo(() => {
    const m = new Map<string, GraphNode>();
    for (const n of nodes) m.set(n.slug, n);
    return m;
  }, [nodes]);

  // Set of slugs connected to hovered node
  const connectedSlugs = useMemo(() => {
    if (!hoveredSlug) return null;
    const s = new Set<string>([hoveredSlug]);
    for (const e of edges) {
      if (e.from === hoveredSlug) s.add(e.to);
      if (e.to === hoveredSlug) s.add(e.from);
    }
    return s;
  }, [hoveredSlug, edges]);

  const isConnected = useCallback(
    (slug: string) => !connectedSlugs || connectedSlugs.has(slug),
    [connectedSlugs]
  );

  const isEdgeConnected = useCallback(
    (edge: GraphEdge) =>
      !connectedSlugs || (connectedSlugs.has(edge.from) && connectedSlugs.has(edge.to)),
    [connectedSlugs]
  );

  const columnWidth = (width - sidePadding * 2) / columnCount;

  // Chapters with patterns
  const chaptersPresent = useMemo(() => {
    const s = new Set<number>();
    for (const n of nodes) s.add(n.chapter);
    return s;
  }, [nodes]);

  return (
    <div className="mb-10 border-y border-text/20 py-5">
      <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-muted mb-4">
        Pattern Language Map
      </h2>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`Interactive pattern language graph showing ${nodes.length} patterns and their relationships`}
      >
        {/* Chapter column labels */}
        {Array.from({ length: columnCount }, (_, i) => {
          const chapter = i + 1;
          const cx = sidePadding + columnWidth * i + columnWidth / 2;
          const hasPatterns = chaptersPresent.has(chapter);

          return (
            <g key={`col-${chapter}`}>
              <text
                x={cx}
                y={28}
                textAnchor="middle"
                fill={hasPatterns ? CHAPTER_COLORS[chapter] : 'var(--color-muted)'}
                fontSize={12}
                fontFamily="monospace"
                fontWeight="bold"
                opacity={hasPatterns ? 1 : 0.4}
              >
                {CHAPTER_NAMES[chapter]}
              </text>
              <line
                x1={cx - columnWidth / 2 + 10}
                y1={42}
                x2={cx + columnWidth / 2 - 10}
                y2={42}
                stroke={hasPatterns ? CHAPTER_COLORS[chapter] : 'var(--color-muted)'}
                strokeWidth={1}
                opacity={0.3}
              />
              {/* Empty chapter placeholder */}
              {!hasPatterns && (
                <>
                  <rect
                    x={cx - 50}
                    y={height / 2 - 24}
                    width={100}
                    height={48}
                    fill="none"
                    stroke="var(--color-muted)"
                    strokeWidth={1}
                    strokeDasharray="4 3"
                    opacity={0.3}
                  />
                  <text
                    x={cx}
                    y={height / 2 + 4}
                    textAnchor="middle"
                    fill="var(--color-muted)"
                    fontSize={10}
                    fontFamily="monospace"
                    opacity={0.4}
                  >
                    coming soon
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Edges */}
        {edges.map((edge) => {
          const fromNode = nodeMap.get(edge.from);
          const toNode = nodeMap.get(edge.to);
          if (!fromNode || !toNode) return null;

          const connected = isEdgeConnected(edge);
          const dx = toNode.x - fromNode.x;
          const cpOffset = Math.abs(dx) * 0.3;

          const path = `M ${fromNode.x} ${fromNode.y} C ${fromNode.x + cpOffset} ${fromNode.y}, ${toNode.x - cpOffset} ${toNode.y}, ${toNode.x} ${toNode.y}`;

          return (
            <path
              key={`${edge.from}-${edge.to}-${edge.type}`}
              d={path}
              fill="none"
              stroke={EDGE_COLORS[edge.type]}
              strokeWidth={2}
              strokeDasharray={EDGE_DASH[edge.type] || undefined}
              className="transition-opacity duration-150"
              style={{
                opacity: connected ? 0.5 : 0.08,
              }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const color = CHAPTER_COLORS[node.chapter];
          const connected = isConnected(node.slug);
          const isHovered = hoveredSlug === node.slug;

          return (
            <g
              key={node.slug}
              className="cursor-pointer transition-opacity duration-150"
              style={{
                opacity: connected ? 1 : 0.2,
              }}
              onMouseEnter={() => setHoveredSlug(node.slug)}
              onMouseLeave={() => setHoveredSlug(null)}
              onClick={() => router.push(`/learn/patterns/${node.slug}`)}
              role="link"
              tabIndex={0}
              aria-label={`Pattern ${node.number}: ${node.name}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') router.push(`/learn/patterns/${node.slug}`);
              }}
            >
              {/* Background */}
              <rect
                x={node.x - NODE_W / 2}
                y={node.y - NODE_H / 2}
                width={NODE_W}
                height={NODE_H}
                fill="var(--color-background)"
                stroke={isHovered ? 'var(--color-text)' : color}
                strokeWidth={isHovered ? 2 : 1}
              />
              {/* Number */}
              <text
                x={node.x}
                y={node.y - 9}
                textAnchor="middle"
                fill={color}
                fontSize={12}
                fontFamily="monospace"
                fontWeight="bold"
              >
                {node.number}
              </text>
              {/* Name */}
              <text
                x={node.x}
                y={node.y + 13}
                textAnchor="middle"
                fill="var(--color-text)"
                fontSize={10}
                fontFamily="monospace"
              >
                {node.name.length > 18 ? node.name.slice(0, 17) + '…' : node.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Edge legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 pt-3 border-t border-text/20">
        {(['enables', 'composes', 'prevents', 'contrasts'] as const).map((type) => (
          <div key={type} className="flex items-center gap-2">
            <svg width="24" height="8" aria-hidden="true">
              <line
                x1={0}
                y1={4}
                x2={24}
                y2={4}
                stroke={EDGE_COLORS[type]}
                strokeWidth={2}
                strokeDasharray={EDGE_DASH[type] || undefined}
              />
            </svg>
            <span className="text-xs font-mono text-muted uppercase tracking-wider">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
