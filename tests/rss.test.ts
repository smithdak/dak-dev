import assert from 'node:assert/strict';
import test from 'node:test';
import { generateRSSFeed } from '@/lib/rss';

test('RSS generation emits valid required structure and escaped XML', async () => {
  const feed = await generateRSSFeed(50);

  assert.ok(feed.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
  assert.match(feed, /<rss version="2\.0"/);
  for (const element of [
    '<channel>',
    '<title>',
    '<link>',
    '<description>',
    '<language>',
    '<lastBuildDate>',
  ]) {
    assert.ok(feed.includes(element), `Missing ${element}`);
  }

  if (feed.includes('<item>')) {
    for (const element of ['<guid', '<pubDate>', '<author>']) {
      assert.ok(feed.includes(element), `Missing item ${element}`);
    }
  }

  assert.doesNotMatch(feed, /&(?!(amp;|lt;|gt;|quot;|apos;))/);
});
