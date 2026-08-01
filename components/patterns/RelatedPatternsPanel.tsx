import type { Pattern, PatternRelationship, RelationshipType } from '@/lib/patterns';
import { RelatedPatternLink } from './RelatedPatternLink';

interface RelatedPatternsPanelProps {
  relatedPatterns: (Pattern & { relationship: PatternRelationship })[];
}

const GROUP_ORDER: RelationshipType[] = ['enables', 'composes', 'prevents', 'contrasts'];

const GROUP_LABELS: Record<RelationshipType, string> = {
  enables: 'Enables',
  composes: 'Composes With',
  prevents: 'Prevents',
  contrasts: 'Contrasts',
};

export function RelatedPatternsPanel({ relatedPatterns }: RelatedPatternsPanelProps) {
  if (relatedPatterns.length === 0) return null;

  // Group by relationship type
  const groups = GROUP_ORDER.map((type) => ({
    type,
    label: GROUP_LABELS[type],
    patterns: relatedPatterns.filter((p) => p.relationship.type === type),
  })).filter((g) => g.patterns.length > 0);

  return (
    <div>
      <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted mb-3">
        Related Patterns
      </h2>

      <div className="space-y-3">
        {groups.map((group) => (
          <div key={group.type}>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1.5">
              {group.label}
            </h3>
            {group.patterns.map((pattern) => (
              <RelatedPatternLink
                key={pattern.frontmatter.slug}
                slug={pattern.frontmatter.slug}
                name={pattern.frontmatter.name}
                number={pattern.frontmatter.number}
                chapter={pattern.frontmatter.chapter}
                relationship={pattern.relationship}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
