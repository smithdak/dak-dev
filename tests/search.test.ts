import assert from 'node:assert/strict';
import test from 'node:test';
import { gzipSync } from 'node:zlib';
import workProducts from '@/content/products.json';
import { getAllHarnessChapters } from '@/lib/harness';
import { getAllDemos, getAllExplainers, GLOSSARY_TERMS } from '@/lib/onramp';
import { getAllPatterns } from '@/lib/patterns';
import { getAllPosts } from '@/lib/posts';
import { getAllSecurityChapters } from '@/lib/security';
import { searchPosts } from '@/lib/search';
import { generateSearchIndex } from '@/lib/search/index-generator';
import { getAllToolkitPages, getToolkitProducts } from '@/lib/toolkit';

test('search indexes every published leaf once within its payload budget', () => {
  const index = generateSearchIndex();
  const externalWorkRecords = workProducts.filter((product) => /^https?:\/\//.test(product.url));
  const expectedCount =
    getAllPosts().length +
    getAllPatterns().length +
    getAllToolkitPages().length +
    getToolkitProducts().length +
    getAllHarnessChapters().length +
    getAllSecurityChapters().length +
    getAllDemos().length +
    getAllExplainers().length +
    GLOSSARY_TERMS.length +
    externalWorkRecords.length;

  assert.equal(index.length, expectedCount);
  assert.equal(new Set(index.map((item) => item.href)).size, index.length);
  assert.ok(index.every((item) => item.contentPreview.length <= 500));
  assert.ok(index.some((item) => item.href === '/learn/toolkit/agent-teams/compositions'));
  assert.ok(index.some((item) => item.href === '/learn/start/decoder#term-context-window'));
  assert.ok(index.some((item) => item.href === '/blog/agent-delivery-harness'));
  assert.deepEqual(
    index.find((item) => item.href === 'https://github.com/smithdak/base'),
    {
      slug: 'work-base',
      href: 'https://github.com/smithdak/base',
      title: 'base',
      excerpt: workProducts.find((product) => product.id === 'base')?.description,
      contentPreview: `${workProducts.find((product) => product.id === 'base')?.description} infrastructure 2026-07`,
      tags: ['work', 'infrastructure'],
      keywords: ['base', 'base', 'infrastructure'],
      date: undefined,
      type: 'work',
      label: 'Public repository',
      section: 'Work · Infrastructure',
    }
  );
  assert.ok(
    searchPosts(index, 'skillsmith').some(
      (item) => item.href === 'https://github.com/smithdak/skillsmith'
    )
  );
  assert.ok(
    searchPosts(index, 'delivery control').some(
      (item) => item.href === '/learn/harness/delivery-control-above-agent-loop'
    )
  );

  for (const type of [
    'post',
    'pattern',
    'toolkit',
    'harness',
    'security',
    'start',
    'work',
  ] as const) {
    assert.ok(
      index.some((item) => item.type === type),
      `Missing ${type} search records`
    );
  }

  const gzipBytes = gzipSync(JSON.stringify(index)).byteLength;
  assert.ok(gzipBytes < 50 * 1024, `Search index is ${(gzipBytes / 1024).toFixed(1)} KiB gzipped`);
});
