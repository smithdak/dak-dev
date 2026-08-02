#!/usr/bin/env -S pnpm exec tsx
/**
 * Publish Preparation Pipeline
 *
 * Unified pre-publish pipeline that runs all validation steps in order:
 *   1. Frontmatter validation
 *   2. Structure validation
 *   3. Voice validation
 *   4. SEO validation (with keyword density)
 *   5. Image validation + blur injection (--fix)
 *   6. Internal link validation
 *   7. Content calendar sync (--fix)
 *
 * Usage:
 *   pnpm publish:prepare                           # Modified/unpublished posts only
 *   pnpm publish:prepare -- --slug my-post         # Single post
 *   pnpm publish:prepare -- --all                  # All posts
 *   pnpm publish:prepare:fix                       # Auto-fix blur + calendar sync
 */

import fs from 'fs';
import path from 'path';
import { getAllSlugs, getPostBySlug } from '../lib/posts';
import {
  validateFrontmatter,
  validateStructure,
  validateBrandVoice,
  validateSEO,
  validateImages,
  validateLinks,
  injectBlurPlaceholders,
  syncCalendarStatus,
  type ValidationResult,
} from '../lib/content-validation';

interface StepResult {
  name: string;
  result: ValidationResult;
  fixApplied?: string;
}

interface PostPipelineResult {
  slug: string;
  title: string;
  steps: StepResult[];
  overallPassed: boolean;
  overallScore: number;
  totalIssues: number;
  totalWarnings: number;
}

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    all: args.includes('--all'),
    fix: args.includes('--fix'),
    slug: (() => {
      const idx = args.indexOf('--slug');
      return idx !== -1 ? args[idx + 1] : null;
    })(),
    ci: args.includes('--ci'),
  };
}

function getSlugsToValidate(options: { all: boolean; slug: string | null }): string[] {
  if (options.slug) {
    return [options.slug];
  }

  const allSlugs = getAllSlugs();

  if (options.all) {
    return allSlugs;
  }

  // Default: only unpublished or modified posts (all published posts for now)
  return allSlugs.filter((slug) => {
    const post = getPostBySlug(slug);
    return post?.frontmatter.published;
  });
}

async function runPipeline(slug: string, fix: boolean): Promise<PostPipelineResult> {
  const post = getPostBySlug(slug);
  const title = post?.frontmatter.title || slug;
  const steps: StepResult[] = [];

  if (!post) {
    return {
      slug,
      title,
      steps: [
        {
          name: 'Post Lookup',
          result: {
            passed: false,
            score: 0,
            issues: [
              { type: 'error', category: 'frontmatter', message: `Post not found: ${slug}` },
            ],
            warnings: [],
            metrics: {
              wordCount: 0,
              headingCount: 0,
              codeBlockCount: 0,
              passiveVoicePercentage: 0,
              avgSentenceLength: 0,
            },
          },
        },
      ],
      overallPassed: false,
      overallScore: 0,
      totalIssues: 1,
      totalWarnings: 0,
    };
  }

  // Step 1: Frontmatter
  steps.push({
    name: '1. Frontmatter',
    result: validateFrontmatter(post.frontmatter),
  });

  // Step 2: Structure
  steps.push({
    name: '2. Structure',
    result: validateStructure(post.content),
  });

  // Step 3: Voice
  steps.push({
    name: '3. Voice',
    result: validateBrandVoice(post.content),
  });

  // Step 4: SEO (with density)
  steps.push({
    name: '4. SEO',
    result: validateSEO(post.frontmatter, post.content),
  });

  // Step 5: Images + blur fix
  const imagesResult = await validateImages(post.frontmatter);
  let blurFixMsg: string | undefined;

  if (fix) {
    const blurResult = await injectBlurPlaceholders(slug);
    if (blurResult.updated) {
      const parts: string[] = [];
      if (blurResult.thumbnailInjected) parts.push('thumbnailBlur');
      if (blurResult.heroInjected) parts.push('heroBlur');
      blurFixMsg = `Injected: ${parts.join(', ')}`;
    }
    if (blurResult.errors.length > 0) {
      blurFixMsg =
        (blurFixMsg ? blurFixMsg + ' | ' : '') + `Errors: ${blurResult.errors.join('; ')}`;
    }
  }

  steps.push({
    name: '5. Images',
    result: imagesResult,
    fixApplied: blurFixMsg,
  });

  // Step 6: Links
  steps.push({
    name: '6. Links',
    result: validateLinks(slug, post.content),
  });

  // Step 7: Calendar sync (fix mode only)
  const allIssues = steps.reduce((sum, s) => sum + s.result.issues.length, 0);
  const overallPassed = allIssues === 0;

  if (fix) {
    const calSync = syncCalendarStatus(slug, overallPassed);
    const calMsg = calSync.updated
      ? `${calSync.previousStatus} -> ${calSync.newStatus}`
      : calSync.previousStatus === 'published'
        ? 'Skipped (already published)'
        : 'No change needed';
    steps.push({
      name: '7. Calendar Sync',
      result: {
        passed: true,
        score: 100,
        issues: [],
        warnings: [],
        metrics: {
          wordCount: 0,
          headingCount: 0,
          codeBlockCount: 0,
          passiveVoicePercentage: 0,
          avgSentenceLength: 0,
        },
      },
      fixApplied: calMsg,
    });
  }

  const totalIssues = steps.reduce((sum, s) => sum + s.result.issues.length, 0);
  const totalWarnings = steps.reduce((sum, s) => sum + s.result.warnings.length, 0);
  const scorableSteps = steps.filter((s) => s.name !== '7. Calendar Sync');
  const avgScore =
    scorableSteps.length > 0
      ? Math.round(scorableSteps.reduce((sum, s) => sum + s.result.score, 0) / scorableSteps.length)
      : 0;

  return {
    slug,
    title,
    steps,
    overallPassed: totalIssues === 0,
    overallScore: avgScore,
    totalIssues,
    totalWarnings,
  };
}

function printResult(result: PostPipelineResult) {
  const icon = result.overallPassed ? '\u2705' : '\u274C';
  console.log(`\n${icon} ${result.title} (${result.slug})`);
  console.log(
    `   Score: ${result.overallScore}/100 | Issues: ${result.totalIssues} | Warnings: ${result.totalWarnings}`
  );

  for (const step of result.steps) {
    const stepIcon = step.result.issues.length === 0 ? '\u2705' : '\u274C';
    const warningCount = step.result.warnings.length;
    const warningStr = warningCount > 0 ? ` | ${warningCount} warnings` : '';
    const fixStr = step.fixApplied ? ` [FIX: ${step.fixApplied}]` : '';
    console.log(`   ${stepIcon} ${step.name}: ${step.result.score}/100${warningStr}${fixStr}`);

    // Print errors
    for (const issue of step.result.issues) {
      console.log(`      \u274C ${issue.message}`);
      if (issue.suggestion) console.log(`         -> ${issue.suggestion}`);
    }

    // Print first 2 warnings per step
    const displayWarnings = step.result.warnings.slice(0, 2);
    for (const warning of displayWarnings) {
      console.log(`      \u26A0\uFE0F  ${warning.message}`);
    }
    if (warningCount > 2) {
      console.log(`      ... and ${warningCount - 2} more warnings`);
    }
  }
}

async function main() {
  const opts = parseArgs();

  console.log('\n\uD83D\uDE80 Publish Preparation Pipeline');
  console.log('\u2550'.repeat(50));
  console.log(`Date: ${new Date().toISOString().split('T')[0]}`);
  console.log(
    `Mode: ${opts.slug ? `Single (${opts.slug})` : opts.all ? 'All posts' : 'Published posts'}`
  );
  console.log(`Fix mode: ${opts.fix ? 'ON (blur inject + calendar sync)' : 'OFF'}`);
  console.log('\u2550'.repeat(50));

  const slugs = getSlugsToValidate(opts);

  if (slugs.length === 0) {
    console.log('\n\u26A0\uFE0F  No posts found to validate.\n');
    process.exit(0);
  }

  const results: PostPipelineResult[] = [];

  for (const slug of slugs) {
    const result = await runPipeline(slug, opts.fix);
    results.push(result);
    printResult(result);
  }

  // Summary
  const passed = results.filter((r) => r.overallPassed).length;
  const failed = results.length - passed;
  const avgScore =
    results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.overallScore, 0) / results.length)
      : 0;

  console.log('\n' + '\u2550'.repeat(50));
  console.log('\uD83D\uDCCA Pipeline Summary');
  console.log('\u2550'.repeat(50));
  console.log(`Total: ${results.length} | Passed: ${passed} \u2705 | Failed: ${failed} \u274C`);
  console.log(`Average Score: ${avgScore}/100`);

  // Write report
  const reportPath = path.join(process.cwd(), '.content/validation-report.json');
  const reportDir = path.dirname(reportPath);
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        pipeline: 'publish-prepare',
        fix_mode: opts.fix,
        summary: {
          total: results.length,
          passed,
          failed,
          average_score: avgScore,
        },
        results: results.map((r) => ({
          slug: r.slug,
          title: r.title,
          passed: r.overallPassed,
          score: r.overallScore,
          issues: r.totalIssues,
          warnings: r.totalWarnings,
        })),
      },
      null,
      2
    )
  );
  console.log(`\nReport saved to: ${reportPath}\n`);

  // Exit code
  if (failed > 0 && opts.ci) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Pipeline failed:', error);
  process.exit(1);
});
