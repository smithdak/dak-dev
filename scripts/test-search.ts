import assert from 'node:assert/strict';
import { gzipSync } from 'node:zlib';
import { generateSearchIndex } from '@/lib/search/index-generator';
import { searchPosts } from '@/lib/search';
import { getAllPosts } from '@/lib/posts';
import { getAllPatterns } from '@/lib/patterns';
import { getAllToolkitPages } from '@/lib/toolkit';
import { getAllHarnessChapters } from '@/lib/harness';
import { getAllSecurityChapters } from '@/lib/security';
import { getAllDemos, getAllExplainers, GLOSSARY_TERMS } from '@/lib/onramp';

const index = generateSearchIndex();
const expectedCount =
  getAllPosts().length +
  getAllPatterns().length +
  getAllToolkitPages().length +
  getAllHarnessChapters().length +
  getAllSecurityChapters().length +
  getAllDemos().length +
  getAllExplainers().length +
  GLOSSARY_TERMS.length;

assert.equal(index.length, expectedCount, 'Every published leaf record should be indexed once');
assert.equal(
  new Set(index.map((item) => item.href)).size,
  index.length,
  'Search hrefs must be unique'
);
assert.ok(
  index.every((item) => item.contentPreview.length <= 500),
  'Previews must stay bounded'
);
assert.ok(
  index.some((item) => item.href === '/learn/toolkit/agent-teams/compositions'),
  'Nested Toolkit pages must be indexed'
);
assert.ok(
  index.some((item) => item.href === '/learn/start/decoder#term-context-window'),
  'Decoder term anchors must match the rendered page'
);
assert.ok(
  !index.some((item) => item.href === '/blog/agent-delivery-harness'),
  'Unpublished posts must stay out of the search index'
);
assert.ok(
  searchPosts(index, 'delivery control').some(
    (item) => item.href === '/learn/harness/delivery-control-above-agent-loop'
  ),
  'Delivery Harness chapter must be queryable'
);

for (const type of ['post', 'pattern', 'toolkit', 'harness', 'security', 'start'] as const) {
  assert.ok(
    index.some((item) => item.type === type),
    `Missing ${type} search records`
  );
}

const gzipBytes = gzipSync(JSON.stringify(index)).byteLength;
assert.ok(gzipBytes < 50 * 1024, `Search index exceeds 50 KiB gzipped: ${gzipBytes} bytes`);

console.log(
  `Search index verified: ${index.length} records, ${(gzipBytes / 1024).toFixed(1)} KiB gzipped.`
);
