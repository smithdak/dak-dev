import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getAllPosts,
  getAllSlugs,
  getPostBySlug,
  getPublishedPostSlugs,
  parsePostFrontmatter,
} from '@/lib/posts';
import { getAllPatterns, getPublishedPatternSlugs, parsePatternFrontmatter } from '@/lib/patterns';

test('published post route candidates exclude every draft', () => {
  const published = new Set(getPublishedPostSlugs());
  const drafts = getAllSlugs().filter(
    (slug) => getPostBySlug(slug)?.frontmatter.published === false
  );

  assert.deepEqual(
    [...published].sort(),
    getAllPosts()
      .map((post) => post.frontmatter.slug)
      .sort()
  );
  assert.equal(
    drafts.some((slug) => published.has(slug)),
    false
  );
});

test('published pattern route candidates match the published collection', () => {
  assert.deepEqual(
    getPublishedPatternSlugs().sort(),
    getAllPatterns()
      .map((pattern) => pattern.frontmatter.slug)
      .sort()
  );
});

test('content frontmatter validation fails closed', () => {
  assert.throws(
    () => parsePostFrontmatter({ published: true }, 'invalid-post'),
    /frontmatter\.date/
  );
  assert.throws(
    () => parsePatternFrontmatter({ published: true }, 'invalid-pattern'),
    /frontmatter\.chapter/
  );
});
