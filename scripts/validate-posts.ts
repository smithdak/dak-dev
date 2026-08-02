#!/usr/bin/env -S pnpm exec tsx
/**
 * Batch Content Validation Script
 *
 * Validates all posts against brand guidelines.
 * Usage:
 *   pnpm validate:content           # Validate all published posts
 *   pnpm validate:content -- --all  # Validate all posts including drafts
 *   pnpm validate:content -- --slug my-post  # Validate specific post
 */

import fs from 'fs';
import path from 'path';
import { validatePost } from '../lib/content-validation';
import { getAllSlugs, getPostBySlug } from '../lib/posts';

interface ValidationSummary {
  total: number;
  passed: number;
  failed: number;
  warnings: number;
  results: Array<{
    slug: string;
    title: string;
    passed: boolean;
    score: number;
    issueCount: number;
    warningCount: number;
  }>;
}

async function main() {
  const args = process.argv.slice(2);
  const includeAll = args.includes('--all');
  const ciMode = args.includes('--ci');
  const slugIndex = args.indexOf('--slug');
  const specificSlug = slugIndex !== -1 ? args[slugIndex + 1] : null;

  console.log('\n📝 Content Validation Report');
  console.log('═'.repeat(50));
  console.log(`Date: ${new Date().toISOString().split('T')[0]}`);
  console.log(
    `Mode: ${specificSlug ? `Single post (${specificSlug})` : includeAll ? 'All posts' : 'Published posts only'}`
  );
  console.log('═'.repeat(50));

  // Get slugs to validate
  let slugs: string[];
  if (specificSlug) {
    slugs = [specificSlug];
  } else {
    slugs = getAllSlugs();
    if (!includeAll) {
      // Filter to only published posts
      slugs = slugs.filter((slug) => {
        const post = getPostBySlug(slug);
        return post?.frontmatter.published;
      });
    }
  }

  if (slugs.length === 0) {
    console.log('\n⚠️  No posts found to validate.\n');
    process.exit(0);
  }

  const summary: ValidationSummary = {
    total: slugs.length,
    passed: 0,
    failed: 0,
    warnings: 0,
    results: [],
  };

  // Validate each post
  for (const slug of slugs) {
    const post = getPostBySlug(slug);
    if (!post) {
      console.log(`\n❌ Post not found: ${slug}`);
      summary.failed++;
      continue;
    }

    const result = await validatePost(slug);

    const postResult = {
      slug,
      title: post.frontmatter.title,
      passed: result.passed,
      score: result.score,
      issueCount: result.issues.length,
      warningCount: result.warnings.length,
    };

    summary.results.push(postResult);

    if (result.passed) {
      summary.passed++;
    } else {
      summary.failed++;
    }

    if (result.warnings.length > 0) {
      summary.warnings += result.warnings.length;
    }

    // Print individual result
    const statusIcon = result.passed ? '✅' : '❌';
    const warningIcon = result.warnings.length > 0 ? ` ⚠️ ${result.warnings.length}` : '';
    console.log(`\n${statusIcon} ${post.frontmatter.title}`);
    console.log(`   Score: ${result.score}/100 | Issues: ${result.issues.length}${warningIcon}`);

    // Print issues
    if (result.issues.length > 0) {
      console.log('   Issues:');
      for (const issue of result.issues) {
        console.log(`   - [${issue.category}] ${issue.message}`);
        if (issue.suggestion) {
          console.log(`     → ${issue.suggestion}`);
        }
      }
    }

    // Print warnings (limited to first 3)
    if (result.warnings.length > 0) {
      console.log('   Warnings:');
      const displayWarnings = result.warnings.slice(0, 3);
      for (const warning of displayWarnings) {
        console.log(`   - [${warning.category}] ${warning.message}`);
      }
      if (result.warnings.length > 3) {
        console.log(`   ... and ${result.warnings.length - 3} more warnings`);
      }
    }

    // Print metrics
    console.log(
      `   Metrics: ${result.metrics.wordCount} words, ${result.metrics.headingCount} headings, ${result.metrics.codeBlockCount} code blocks`
    );
  }

  // Print summary
  console.log('\n' + '═'.repeat(50));
  console.log('📊 Summary');
  console.log('═'.repeat(50));
  console.log(`Total Posts: ${summary.total}`);
  console.log(`Passed: ${summary.passed} ✅`);
  console.log(`Failed: ${summary.failed} ❌`);
  console.log(`Total Warnings: ${summary.warnings} ⚠️`);

  // Calculate average score
  const avgScore =
    summary.results.length > 0
      ? Math.round(summary.results.reduce((acc, r) => acc + r.score, 0) / summary.results.length)
      : 0;
  console.log(`Average Score: ${avgScore}/100`);

  // Record failure after the report is written so CI can publish the evidence
  // without granting the validation job any pull-request write permission.
  const shouldFailCi = summary.failed > 0 && ciMode;
  if (summary.failed > 0) {
    console.log('\n⚠️  Some posts have validation errors.\n');
  } else {
    console.log('\n✅ All posts passed validation!\n');
  }

  // Write report to file for reference
  const reportPath = path.join(process.cwd(), '.content/validation-report.json');
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        summary: {
          total: summary.total,
          passed: summary.passed,
          failed: summary.failed,
          warnings: summary.warnings,
          average_score: avgScore,
        },
        results: summary.results,
      },
      null,
      2
    )
  );
  console.log(`Report saved to: ${reportPath}\n`);

  if (shouldFailCi) process.exitCode = 1;
}

main().catch((error) => {
  console.error('Validation failed:', error);
  process.exit(1);
});
