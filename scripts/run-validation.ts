#!/usr/bin/env -S pnpm exec tsx
/**
 * Content Validation CLI
 *
 * Usage:
 *   pnpm exec tsx scripts/run-validation.ts validate <slug>     # Validate a specific post
 *   pnpm exec tsx scripts/run-validation.ts brand-check <text>  # Check text against brand voice
 *   pnpm exec tsx scripts/run-validation.ts list                # List all posts with validation status
 */

import { validatePost, validateBrandVoice, type ValidationResult } from '../lib/content-validation';
import { getAllPosts } from '../lib/posts';
import {
  scanAllComponents,
  groupResultsByCategory,
  calculateAverageScore,
  type ComponentCategory,
} from '../lib/component-validation';

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  switch (command) {
    case 'validate': {
      const slug = args[1];
      if (!slug) {
        console.error('Usage: pnpm exec tsx scripts/run-validation.ts validate <slug>');
        process.exit(1);
      }
      await validatePostCommand(slug);
      break;
    }

    case 'brand-check': {
      const text = args.slice(1).join(' ');
      if (!text) {
        console.error('Usage: pnpm exec tsx scripts/run-validation.ts brand-check <text>');
        process.exit(1);
      }
      brandCheckCommand(text);
      break;
    }

    case 'list': {
      await listPostsCommand();
      break;
    }

    case 'validate-all': {
      const includeDrafts = args[1] === '--drafts';
      await validateAllCommand(includeDrafts);
      break;
    }

    case 'scan': {
      const postsOnly = args.includes('--posts');
      const componentsOnly = args.includes('--components');
      await scanCommand({ postsOnly, componentsOnly });
      break;
    }

    default:
      console.log(`Content Validation CLI

Commands:
  validate <slug>       Validate a specific post by slug
  brand-check <text>    Check text against brand voice guidelines
  list                  List all posts with their validation scores
  validate-all [--drafts] Validate all posts (optionally include drafts)
  scan [--posts|--components] Scan all content for brand consistency

Examples:
  pnpm exec tsx scripts/run-validation.ts validate how-apl-built-this-blog
  pnpm exec tsx scripts/run-validation.ts brand-check "I think this might be useful"
  pnpm exec tsx scripts/run-validation.ts list
  pnpm exec tsx scripts/run-validation.ts scan
  pnpm exec tsx scripts/run-validation.ts scan --posts
  pnpm exec tsx scripts/run-validation.ts scan --components
`);
  }
}

async function validatePostCommand(slug: string) {
  console.log(`\nValidating post: ${slug}\n`);
  console.log('='.repeat(60));

  const result = await validatePost(slug);

  // Overall score
  console.log(`\nOverall Score: ${result.score}/100`);
  console.log(`Status: ${result.passed ? '✓ PASSED' : '✗ FAILED'}`);

  // Metrics
  console.log('\n--- Metrics ---');
  console.log(`Word Count: ${result.metrics.wordCount}`);
  console.log(`Headings (H2): ${result.metrics.headingCount}`);
  console.log(`Code Blocks: ${result.metrics.codeBlockCount}`);
  console.log(`Passive Voice: ${result.metrics.passiveVoicePercentage.toFixed(1)}%`);
  console.log(`Avg Sentence Length: ${result.metrics.avgSentenceLength.toFixed(1)} words`);

  // Breakdown by category
  if (result.breakdown) {
    console.log('\n--- Score Breakdown ---');
    for (const [category, catResult] of Object.entries(result.breakdown)) {
      const cat = catResult as ValidationResult;
      console.log(`${category}: ${cat.score}/100 ${cat.passed ? '✓' : '✗'}`);
    }
  }

  // Issues
  if (result.issues.length > 0) {
    console.log('\n--- Errors ---');
    for (const issue of result.issues) {
      console.log(
        `  ✗ [${issue.category}${issue.field ? '/' + issue.field : ''}] ${issue.message}`
      );
      if (issue.suggestion) {
        console.log(`    → ${issue.suggestion}`);
      }
    }
  }

  // Warnings
  if (result.warnings.length > 0) {
    console.log('\n--- Warnings ---');
    for (const warning of result.warnings) {
      console.log(
        `  ⚠ [${warning.category}${warning.field ? '/' + warning.field : ''}] ${warning.message}`
      );
      if (warning.suggestion) {
        console.log(`    → ${warning.suggestion}`);
      }
    }
  }

  console.log('\n' + '='.repeat(60));

  // Output JSON for programmatic use
  if (process.env.JSON_OUTPUT === 'true') {
    console.log('\n--- JSON Output ---');
    console.log(JSON.stringify(result, null, 2));
  }

  // Exit with error code if not passed
  process.exit(result.passed ? 0 : 1);
}

function brandCheckCommand(text: string) {
  console.log('\nBrand Voice Check\n');
  console.log('='.repeat(60));
  console.log(`\nText: "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"\n`);

  const result = validateBrandVoice(text);

  console.log(`Score: ${result.score}/100`);
  console.log(`Status: ${result.passed ? '✓ PASSED' : '✗ FAILED'}`);

  if (result.warnings.length > 0) {
    console.log('\n--- Issues Found ---');
    for (const warning of result.warnings) {
      console.log(`  ⚠ ${warning.message}`);
      if (warning.suggestion) {
        console.log(`    → ${warning.suggestion}`);
      }
    }
  } else {
    console.log('\n✓ No brand voice issues detected');
  }

  console.log('\n' + '='.repeat(60));

  // Output JSON for programmatic use
  if (process.env.JSON_OUTPUT === 'true') {
    console.log('\n--- JSON Output ---');
    console.log(JSON.stringify(result, null, 2));
  }

  process.exit(result.score >= 80 ? 0 : 1);
}

async function listPostsCommand() {
  console.log('\nContent Validation Status\n');
  console.log('='.repeat(70));

  const posts = getAllPosts();

  console.log(`\nFound ${posts.length} posts\n`);
  console.log('Slug'.padEnd(45) + 'Status'.padEnd(12) + 'Score');
  console.log('-'.repeat(70));

  for (const post of posts) {
    const slug = post.frontmatter.slug;
    const result = await validatePost(slug);
    const status = post.frontmatter.published ? 'published' : 'draft';
    const statusIcon = result.passed ? '✓' : '✗';
    console.log(`${slug.padEnd(45)}${status.padEnd(12)}${statusIcon} ${result.score}/100`);
  }

  console.log('\n' + '='.repeat(70));
}

async function validateAllCommand(includeDrafts: boolean) {
  console.log('\nValidating All Posts\n');
  console.log('='.repeat(60));

  const posts = getAllPosts();
  const filteredPosts = includeDrafts ? posts : posts.filter((p) => p.frontmatter.published);

  console.log(
    `\nValidating ${filteredPosts.length} posts${includeDrafts ? ' (including drafts)' : ''}\n`
  );

  let passed = 0;
  let failed = 0;
  const results: Array<{ slug: string; score: number; passed: boolean }> = [];

  for (const post of filteredPosts) {
    const slug = post.frontmatter.slug;
    const result = await validatePost(slug);
    results.push({ slug, score: result.score, passed: result.passed });
    if (result.passed) {
      passed++;
      console.log(`  ✓ ${slug} (${result.score}/100)`);
    } else {
      failed++;
      console.log(`  ✗ ${slug} (${result.score}/100)`);
    }
  }

  console.log('\n--- Summary ---');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${filteredPosts.length}`);
  console.log('\n' + '='.repeat(60));

  if (process.env.JSON_OUTPUT === 'true') {
    console.log('\n--- JSON Output ---');
    console.log(JSON.stringify({ passed, failed, total: filteredPosts.length, results }, null, 2));
  }

  process.exit(failed > 0 ? 1 : 0);
}

async function scanCommand(options: { postsOnly: boolean; componentsOnly: boolean }) {
  console.log('\nFull Content Scan');
  console.log('='.repeat(60));

  const posts = getAllPosts();
  const componentResults = options.postsOnly ? [] : scanAllComponents();
  const postResults: Array<{
    slug: string;
    score: number;
    issues: Array<{ message: string; suggestion?: string }>;
    warnings: Array<{ message: string; suggestion?: string }>;
  }> = [];

  // Scan posts if not components-only
  if (!options.componentsOnly) {
    for (const post of posts.filter((p) => p.frontmatter.published)) {
      const result = await validatePost(post.frontmatter.slug);
      postResults.push({
        slug: post.frontmatter.slug,
        score: result.score,
        issues: result.issues,
        warnings: result.warnings,
      });
    }
  }

  // Calculate totals
  const totalFiles = postResults.length + componentResults.length;
  const postCount = postResults.length;
  const componentCount = componentResults.length;

  console.log(
    `\nScanned: ${totalFiles} files | Posts: ${postCount} | Components: ${componentCount}\n`
  );

  // Display post results
  if (!options.componentsOnly && postResults.length > 0) {
    console.log('=== BLOG POSTS (' + postResults.length + ') ===\n');

    for (let i = 0; i < postResults.length; i++) {
      const post = postResults[i];
      console.log(`${i + 1}. ${post.slug} (Score: ${post.score}/100)`);

      if (post.issues.length === 0 && post.warnings.length === 0) {
        console.log('   ✓ All checks passed');
      } else {
        for (const issue of post.issues) {
          console.log(`   ✗ ${issue.message}`);
        }
        for (const warning of post.warnings) {
          console.log(`   ⚠ ${warning.message}`);
        }
      }
      console.log('');
    }
  }

  // Display component results grouped by category
  if (!options.postsOnly && componentResults.length > 0) {
    const grouped = groupResultsByCategory(componentResults);
    const categoryLabels: Record<ComponentCategory, string> = {
      page: 'PAGE COMPONENTS',
      layout: 'LAYOUT COMPONENTS',
      section: 'SECTION COMPONENTS',
      blog: 'BLOG COMPONENTS',
      ui: 'UI COMPONENTS',
    };

    for (const category of ['page', 'layout', 'section', 'blog', 'ui'] as ComponentCategory[]) {
      const results = grouped[category];
      if (results.length === 0) continue;

      console.log(`=== ${categoryLabels[category]} (${results.length}) ===\n`);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log(`${i + 1}. ${result.relativePath}`);

        if (result.issues.length === 0) {
          console.log('   ✓ All checks passed');
        } else {
          for (const issue of result.issues) {
            const lineInfo = issue.line ? `:${issue.line}` : '';
            console.log(`   ${issue.type === 'error' ? '✗' : '⚠'} ${issue.message}${lineInfo}`);
            if (issue.text) {
              console.log(`     Text: "${issue.text}"`);
            }
          }
        }
        console.log('');
      }
    }
  }

  // Issue summary
  console.log('=== ISSUE SUMMARY ===\n');

  // Collect all issues
  const allIssues: Array<{ type: string; category: string; message: string }> = [];

  for (const post of postResults) {
    for (const issue of post.issues) {
      allIssues.push({ type: 'error', category: 'posts', message: issue.message });
    }
    for (const warning of post.warnings) {
      allIssues.push({ type: 'warning', category: 'posts', message: warning.message });
    }
  }

  for (const result of componentResults) {
    for (const issue of result.issues) {
      allIssues.push({ type: issue.type, category: 'components', message: issue.message });
    }
  }

  // Count by category
  const issueCategories: Record<string, number> = {};
  for (const issue of allIssues) {
    const key = issue.message.split(':')[0].split('(')[0].trim();
    issueCategories[key] = (issueCategories[key] || 0) + 1;
  }

  if (Object.keys(issueCategories).length > 0) {
    console.log('By Category:');
    for (const [category, count] of Object.entries(issueCategories).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${count}x ${category}`);
    }
    console.log('');
  }

  // Count by severity
  const errors = allIssues.filter((i) => i.type === 'error').length;
  const warnings = allIssues.filter((i) => i.type === 'warning').length;

  console.log('By Severity:');
  console.log(`  ${errors} Errors (must fix)`);
  console.log(`  ${warnings} Warnings (should fix)`);
  console.log('');

  // Recommendations
  console.log('=== RECOMMENDATIONS ===\n');

  const quickFixes: string[] = [];
  const contentUpdates: string[] = [];

  // Analyze issues for recommendations
  for (const post of postResults) {
    for (const issue of [...post.issues, ...post.warnings]) {
      if (issue.message.includes('blur placeholder')) {
        if (!quickFixes.includes('Run `pnpm images:generate` for deterministic post art')) {
          quickFixes.push('Run `pnpm images:generate` for deterministic post art');
        }
      } else if (issue.message.includes('Excerpt') && issue.suggestion) {
        contentUpdates.push(`Expand excerpt in ${post.slug}: ${issue.suggestion}`);
      } else if (issue.message.includes('Forbidden phrase') && issue.suggestion) {
        contentUpdates.push(`${post.slug}: ${issue.message}`);
      } else if (issue.message.includes('conclusion')) {
        contentUpdates.push(`Add conclusion section to ${post.slug}`);
      }
    }
  }

  for (const result of componentResults) {
    for (const issue of result.issues) {
      if (issue.message.includes('Forbidden phrase') && issue.line) {
        contentUpdates.push(`Replace forbidden phrase in ${result.relativePath}:${issue.line}`);
      } else if (issue.message.includes('passive voice') && issue.line) {
        contentUpdates.push(`Rewrite passive voice in ${result.relativePath}:${issue.line}`);
      }
    }
  }

  if (quickFixes.length > 0) {
    console.log('Priority 1 - Quick Fixes:');
    for (const fix of quickFixes) {
      console.log(`  • ${fix}`);
    }
    console.log('');
  }

  if (contentUpdates.length > 0) {
    console.log('Priority 2 - Content Updates:');
    for (const update of contentUpdates.slice(0, 10)) {
      console.log(`  • ${update}`);
    }
    if (contentUpdates.length > 10) {
      console.log(`  ... and ${contentUpdates.length - 10} more`);
    }
    console.log('');
  }

  if (quickFixes.length === 0 && contentUpdates.length === 0) {
    console.log('No recommendations - all content looks good!\n');
  }

  // Summary line
  console.log('='.repeat(60));

  const postAvg =
    postResults.length > 0
      ? Math.round(postResults.reduce((sum, p) => sum + p.score, 0) / postResults.length)
      : 100;
  const componentAvg = calculateAverageScore(componentResults);
  const overallHealth =
    errors === 0 && warnings <= 5
      ? 'Excellent'
      : errors === 0 && warnings <= 15
        ? 'Good'
        : errors <= 3
          ? 'Needs Attention'
          : 'Needs Work';

  console.log(
    `Posts: ${postAvg} avg | Components: ${componentAvg} avg | Overall Health: ${overallHealth}`
  );
  console.log('');

  // Exit with appropriate code
  process.exit(errors > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
