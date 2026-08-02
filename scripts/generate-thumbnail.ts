#!/usr/bin/env -S pnpm exec tsx
/**
 * @deprecated Compatibility entry point for deterministic manifest-driven art.
 * Text overlays and external source art are intentionally unsupported.
 */

const retiredFlag = process.argv.find((argument) =>
  ['--source', '--text', '--accent'].includes(argument)
);

if (retiredFlag) {
  console.error(
    `${retiredFlag} is retired. Use \`pnpm images:generate -- --slug <slug>\`; post art contains no text or external source material.`
  );
  process.exitCode = 1;
} else {
  void import('./generate-post-images');
}
