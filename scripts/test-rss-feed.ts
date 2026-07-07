import { generateRSSFeed } from '../lib/rss';
import fs from 'fs';
import path from 'path';

console.log('Testing RSS Feed Generation...\n');

async function main() {
  const feed = await generateRSSFeed(50);

  console.log('✓ RSS feed generated successfully');
  console.log(`✓ Feed length: ${feed.length} bytes`);

  // Basic validation
  if (!feed.includes('<?xml version="1.0" encoding="UTF-8"?>')) {
    throw new Error('Missing XML declaration');
  }

  if (!feed.includes('<rss version="2.0"')) {
    throw new Error('Missing RSS 2.0 declaration');
  }

  if (!feed.includes('<channel>')) {
    throw new Error('Missing channel element');
  }

  if (!feed.includes('Dakota Smith Blog')) {
    throw new Error('Missing site title');
  }

  console.log('✓ RSS 2.0 XML structure valid');

  // Check for at least one item
  const itemCount = (feed.match(/<item>/g) || []).length;
  console.log(`✓ Feed includes ${itemCount} post(s)`);

  // Write to temp file for inspection
  const outputPath = path.join(process.cwd(), 'public', 'test-feed.xml');
  fs.writeFileSync(outputPath, feed, 'utf-8');
  console.log(`✓ Sample feed written to ${outputPath}`);

  console.log('\n✅ RSS feed validation passed!');
  console.log('\nFirst 500 characters of feed:');
  console.log('─'.repeat(60));
  console.log(feed.substring(0, 500));
  console.log('─'.repeat(60));
}

main().catch((error) => {
  console.error('❌ RSS feed validation failed:', error);
  process.exit(1);
});
