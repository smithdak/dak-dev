/**
 * Image validation
 */

import fs from 'fs';
import path from 'path';
import type { PostFrontmatter } from '../posts';
import type { ValidationResult, ValidationIssue } from './types';
import { validateImageSpec, IMAGE_SPECS } from '../image-utils';

/**
 * Validate post images
 */
export async function validateImages(frontmatter: PostFrontmatter): Promise<ValidationResult> {
  const issues: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  // Check if image files exist
  const publicDir = path.join(process.cwd(), 'public');

  if (frontmatter.thumbnail) {
    const thumbnailPath = path.join(publicDir, frontmatter.thumbnail);
    if (!fs.existsSync(thumbnailPath)) {
      warnings.push({
        type: 'warning',
        category: 'images',
        field: 'thumbnail',
        message: `Thumbnail image not found: ${frontmatter.thumbnail}`,
        suggestion: 'Add thumbnail image (960x640) to the specified path',
      });
    } else {
      // Validate dimensions and size
      try {
        const imageIssues = await validateImageSpec(thumbnailPath, IMAGE_SPECS.thumbnail);
        for (const issue of imageIssues) {
          if (issue.type === 'error') {
            issues.push(issue as ValidationIssue);
          } else {
            warnings.push(issue as ValidationIssue);
          }
        }
      } catch {
        warnings.push({
          type: 'warning',
          category: 'images',
          field: 'thumbnail',
          message: 'Failed to validate thumbnail image',
          suggestion: 'Ensure the image file is a valid JPEG',
        });
      }
    }
  }

  if (frontmatter.hero) {
    const heroPath = path.join(publicDir, frontmatter.hero);
    if (!fs.existsSync(heroPath)) {
      warnings.push({
        type: 'warning',
        category: 'images',
        field: 'hero',
        message: `Hero image not found: ${frontmatter.hero}`,
        suggestion: 'Add hero image (1600x900) to the specified path',
      });
    } else {
      // Validate dimensions and size
      try {
        const imageIssues = await validateImageSpec(heroPath, IMAGE_SPECS.hero);
        for (const issue of imageIssues) {
          if (issue.type === 'error') {
            issues.push(issue as ValidationIssue);
          } else {
            warnings.push(issue as ValidationIssue);
          }
        }
      } catch {
        warnings.push({
          type: 'warning',
          category: 'images',
          field: 'hero',
          message: 'Failed to validate hero image',
          suggestion: 'Ensure the image file is a valid JPEG',
        });
      }
    }
  }

  // Check for blur placeholders
  if (frontmatter.thumbnail && !frontmatter.thumbnailBlur) {
    warnings.push({
      type: 'warning',
      category: 'images',
      field: 'thumbnailBlur',
      message: 'Missing blur placeholder for thumbnail',
      suggestion: 'Run pnpm images:generate to restore the blur data',
    });
  }

  if (frontmatter.hero && !frontmatter.heroBlur) {
    warnings.push({
      type: 'warning',
      category: 'images',
      field: 'heroBlur',
      message: 'Missing blur placeholder for hero',
      suggestion: 'Run pnpm images:generate to restore the blur data',
    });
  }

  const passed = issues.length === 0;
  const score = Math.max(0, 100 - issues.length * 15 - warnings.length * 5);

  return {
    passed,
    score,
    issues,
    warnings,
    metrics: {
      wordCount: 0,
      headingCount: 0,
      codeBlockCount: 0,
      passiveVoicePercentage: 0,
      avgSentenceLength: 0,
    },
  };
}
