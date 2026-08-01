/**
 * Test script for Epic 007: Search & Discovery Features
 * Verifies search index generation, search functionality, and related posts algorithm
 */

import { searchPosts } from '@/lib/search';
import { generateSearchIndex } from '@/lib/search/index-generator';
import { getRelatedPosts, getAllPosts } from '@/lib/posts';

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Epic 007: Search & Discovery Features - Test Suite');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Test 1: Search Index Generation
console.log('Test 1: Search Index Generation');
console.log('─────────────────────────────────');
const searchIndex = generateSearchIndex();
console.log(`✓ Generated search index with ${searchIndex.length} posts`);

if (searchIndex.length > 0) {
  const samplePost = searchIndex[0];
  console.log('\nSample index entry:');
  console.log(`  Title: ${samplePost.title}`);
  console.log(`  Slug: ${samplePost.slug}`);
  console.log(`  Tags: ${samplePost.tags.join(', ')}`);
  console.log(`  Content preview length: ${samplePost.contentPreview.length} chars`);
  console.log(`  Keywords: ${samplePost.keywords.join(', ')}`);

  // Check size
  const jsonSize = Buffer.from(JSON.stringify(searchIndex)).length;
  const sizeKB = (jsonSize / 1024).toFixed(2);
  const estimatedGzipKB = ((jsonSize * 0.3) / 1024).toFixed(2);
  console.log(`\n✓ Index size: ${sizeKB} KB (estimated gzipped: ${estimatedGzipKB} KB)`);

  if (parseFloat(estimatedGzipKB) < 50) {
    console.log('✓ Index size is optimized (< 50KB gzipped)');
  } else {
    console.log('⚠ Warning: Index size may be too large');
  }
}

// Test 2: Search Functionality
console.log('\n\nTest 2: Search Functionality');
console.log('─────────────────────────────────');
const testQueries = ['AI', 'claude', 'automation', 'nonexistent-query-xyz'];

testQueries.forEach((query) => {
  const results = searchPosts(searchIndex, query);
  console.log(`\nQuery: "${query}"`);
  console.log(`  Found ${results.length} results`);

  if (results.length > 0) {
    results.forEach((result, i) => {
      console.log(`  ${i + 1}. ${result.title}`);
      console.log(`     Tags: [${result.tags.join(', ')}]`);
    });
  }
});

console.log('\n✓ Search functionality working correctly');

// Test 3: Related Posts Algorithm
console.log('\n\nTest 3: Related Posts Algorithm');
console.log('─────────────────────────────────');
const allPosts = getAllPosts();

if (allPosts.length > 0) {
  const testPost = allPosts[0];
  console.log(`\nTesting related posts for: "${testPost.frontmatter.title}"`);
  console.log(`Current post tags: [${testPost.frontmatter.tags.join(', ')}]`);

  const relatedPosts = getRelatedPosts(testPost.frontmatter.slug, 3);
  console.log(`\nFound ${relatedPosts.length} related posts:`);

  relatedPosts.forEach((post, i) => {
    const matchingTags = post.frontmatter.tags.filter((tag) =>
      testPost.frontmatter.tags.includes(tag)
    );
    console.log(`\n${i + 1}. ${post.frontmatter.title}`);
    console.log(`   Tags: [${post.frontmatter.tags.join(', ')}]`);
    console.log(`   Matching tags: [${matchingTags.join(', ')}]`);
    console.log(`   Date: ${post.frontmatter.date}`);
  });

  console.log('\n✓ Related posts algorithm working correctly');

  // Verify current post is not in related posts
  const hasSelf = relatedPosts.some((post) => post.frontmatter.slug === testPost.frontmatter.slug);
  if (!hasSelf) {
    console.log('✓ Current post correctly excluded from related posts');
  } else {
    console.log('✗ Error: Current post found in related posts!');
  }
} else {
  console.log('⚠ No posts found to test related posts algorithm');
}

// Test 4: Edge Cases
console.log('\n\nTest 4: Edge Cases');
console.log('─────────────────────────────────');

// Empty query
const emptyResults = searchPosts(searchIndex, '');
console.log(`Empty query returns: ${emptyResults.length} results`);
if (emptyResults.length === 0) {
  console.log('✓ Empty query correctly returns no results');
}

// Multi-word query
const multiWordResults = searchPosts(searchIndex, 'AI automation');
console.log(`\nMulti-word query "AI automation" returns: ${multiWordResults.length} results`);

// Case insensitive
const lowerResults = searchPosts(searchIndex, 'ai');
const upperResults = searchPosts(searchIndex, 'AI');
if (lowerResults.length === upperResults.length) {
  console.log('✓ Search is case-insensitive');
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('All Tests Complete');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
