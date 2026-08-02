import type { PatternDifficulty } from '@/lib/patterns';

const STYLES: Record<PatternDifficulty, string> = {
  beginner: 'text-chapter-1',
  intermediate: 'text-chapter-5',
  advanced: 'text-chapter-6',
};

export const DIFFICULTY_META: Record<PatternDifficulty, { label: string; description: string }> = {
  beginner: {
    label: 'Beginner',
    description: 'No prior agent experience needed. Start here.',
  },
  intermediate: {
    label: 'Intermediate',
    description: "Assumes you've used coding agents on real projects.",
  },
  advanced: {
    label: 'Advanced',
    description: 'Requires deep agent workflows and multi-session experience.',
  },
};

interface DifficultyBadgeProps {
  difficulty: PatternDifficulty;
  className?: string;
}

export function DifficultyBadge({ difficulty, className = '' }: DifficultyBadgeProps) {
  const meta = DIFFICULTY_META[difficulty];

  return (
    <span
      title={meta.description}
      className={`inline-block text-[10px] font-semibold uppercase tracking-[0.12em] ${STYLES[difficulty]} ${className}`}
    >
      {meta.label}
    </span>
  );
}
