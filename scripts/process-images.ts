#!/usr/bin/env -S pnpm exec tsx
/**
 * @deprecated Compatibility entry point for the deterministic post-art system.
 * Source-image processing was retired because it bypassed manifest provenance.
 */

const sourceFlag = process.argv.find((argument) => argument === '--source');

if (sourceFlag) {
  console.error('Source-image processing is retired. Use `pnpm images:generate -- --slug <slug>`.');
  process.exitCode = 1;
} else {
  const forwarded = process.argv.slice(2).flatMap((argument) => {
    if (argument === '--validate' || argument === 'validate' || argument === 'check') {
      return ['--check'];
    }
    if (argument === '--ci' || argument === 'process') return [];
    return [argument];
  });
  process.argv.splice(2, process.argv.length - 2, ...forwarded);
  void import('./generate-post-images');
}
