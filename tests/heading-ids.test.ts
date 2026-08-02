import assert from 'node:assert/strict';
import test from 'node:test';
import { extractTableOfContents } from '@/lib/toc';
import rehypeHeadingIds from '@/lib/rehype-heading-ids';

test('TOC and rendered headings share markup-aware, deduplicated IDs', () => {
  const markdown = `# Shared

## Shared

## \`Shared\`

### Details *with* emphasis
`;

  assert.deepEqual(extractTableOfContents(markdown), [
    { id: 'shared-2', text: 'Shared', level: 2 },
    { id: 'shared-3', text: 'Shared', level: 2 },
    { id: 'details-with-emphasis', text: 'Details with emphasis', level: 3 },
  ]);

  const headings = [
    {
      type: 'element',
      tagName: 'h1',
      properties: {},
      children: [{ type: 'text', value: 'Shared' }],
    },
    {
      type: 'element',
      tagName: 'h2',
      properties: {},
      children: [{ type: 'text', value: 'Shared' }],
    },
    {
      type: 'element',
      tagName: 'h2',
      properties: {},
      children: [
        {
          type: 'element',
          tagName: 'code',
          properties: {},
          children: [{ type: 'text', value: 'Shared' }],
        },
      ],
    },
    {
      type: 'element',
      tagName: 'h3',
      properties: {},
      children: [
        { type: 'text', value: 'Details ' },
        {
          type: 'element',
          tagName: 'em',
          properties: {},
          children: [{ type: 'text', value: 'with' }],
        },
        { type: 'text', value: ' emphasis' },
      ],
    },
  ];
  const tree = { type: 'root', children: headings };

  rehypeHeadingIds()(tree);

  assert.deepEqual(
    headings.map((heading) => (heading.properties as Record<string, unknown>).id),
    ['shared', 'shared-2', 'shared-3', 'details-with-emphasis']
  );
});
