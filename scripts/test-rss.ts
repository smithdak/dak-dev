/**
 * Test script for RSS feed generation
 * Validates RSS 2.0 XML format and content
 */
import { generateRSSFeed } from '../lib/rss';

function validateRSSFeed(feed: string): void {
  const errors: string[] = [];

  // Check XML declaration
  if (!feed.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
    errors.push('Missing or invalid XML declaration');
  }

  // Check RSS version
  if (!feed.includes('<rss version="2.0"')) {
    errors.push('Missing or invalid RSS version');
  }

  // Check required channel elements
  const requiredElements = [
    '<title>',
    '<link>',
    '<description>',
    '<language>',
    '<lastBuildDate>',
  ];

  for (const element of requiredElements) {
    if (!feed.includes(element)) {
      errors.push(`Missing required element: ${element}`);
    }
  }

  // Check item structure
  if (feed.includes('<item>')) {
    const requiredItemElements = [
      '<title>',
      '<link>',
      '<guid',
      '<description>',
      '<pubDate>',
      '<author>',
    ];

    for (const element of requiredItemElements) {
      if (!feed.includes(element)) {
        errors.push(`Missing required item element: ${element}`);
      }
    }
  }

  // Check for proper XML escaping (no unescaped & < >)
  const unescapedPattern = /&(?!(amp;|lt;|gt;|quot;|apos;))/g;
  if (unescapedPattern.test(feed)) {
    errors.push('Found unescaped XML characters');
  }

  if (errors.length > 0) {
    console.error('RSS Feed Validation Errors:');
    errors.forEach((error) => console.error(`  - ${error}`));
    process.exit(1);
  } else {
    console.log('RSS Feed Validation: PASSED');
  }
}

async function main() {
  console.log('Generating RSS feed...');
  const feed = await generateRSSFeed(50);

  console.log('Validating RSS feed...');
  validateRSSFeed(feed);

  console.log('\nFeed Stats:');
  const itemCount = (feed.match(/<item>/g) || []).length;
  console.log(`  - Items: ${itemCount}`);
  console.log(`  - Size: ${(feed.length / 1024).toFixed(2)} KB`);

  console.log('\nFirst 500 characters of feed:');
  console.log(feed.substring(0, 500));

  console.log('\n✓ RSS feed generation successful!');
}

main().catch((error) => {
  console.error('RSS feed generation failed:', error);
  process.exit(1);
});
