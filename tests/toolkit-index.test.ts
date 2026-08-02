import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ToolkitCapabilityIndex } from '../components/toolkit/ToolkitCapabilityIndex';
import type { AgentToolMeta, ToolkitCoverage, ToolkitTopicMeta } from '../lib/toolkit-types';

const topic: ToolkitTopicMeta = {
  slug: 'project-instructions',
  name: 'Project Instructions',
  description: 'Persistent repository guidance',
  order: 1,
  icon: '',
};

const product: AgentToolMeta = {
  id: 'claude-code',
  name: 'Claude Code',
  shortName: 'Claude',
  vendor: 'Anthropic',
  description: 'Agentic coding environment',
  surfaces: ['cli', 'ide', 'cloud'],
  officialUrl: 'https://code.claude.com/docs',
};

const coverage: ToolkitCoverage[] = [
  {
    topic: topic.slug,
    tool: product.id,
    surfaces: ['cli', 'ide'],
    status: 'native',
    summary: 'First-party local support.',
    sourceIds: ['claude-memory'],
    basis: 'documented',
  },
  {
    topic: topic.slug,
    tool: product.id,
    surfaces: ['cloud'],
    status: 'unknown',
    summary: 'Cloud evidence is insufficient.',
    sourceIds: ['claude-overview'],
    basis: 'documented',
  },
];

test('Toolkit capability index preserves surface-specific coverage', () => {
  const markup = renderToStaticMarkup(
    createElement(ToolkitCapabilityIndex, {
      topics: [{ ...topic, available: true, lensCount: 4, coverage }],
      products: [product],
    })
  );

  assert.match(markup, /<dt[^>]*>Claude<\/dt>/);
  assert.match(markup, /CLI · IDE/);
  assert.match(markup, /Cloud/);
  assert.equal((markup.match(/Native/g) ?? []).length, 1);
  assert.equal((markup.match(/Unknown/g) ?? []).length, 1);
  assert.ok(markup.indexOf('Native') < markup.indexOf('Unknown'));
});
