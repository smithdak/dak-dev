import { mdxComponents } from '@/components/blog/MdxComponents';
import { AgentLoopStepper } from '@/components/interactive/AgentLoopStepper';
import { ScrollStory } from '@/components/interactive/ScrollStory';

/**
 * Base editorial MDX components plus the client islands used by interactive
 * Harness and Start Here content.
 */
export const interactiveMdxComponents = {
  ...mdxComponents,
  AgentLoopStepper,
  ScrollStory,
};
