#!/usr/bin/env -S pnpm exec tsx

import { validateToolkitCatalog } from '../lib/toolkit';

function main(): void {
  const summary = validateToolkitCatalog();
  console.log(JSON.stringify(summary, null, 2));
}

try {
  main();
} catch (error) {
  console.error('Toolkit validation failed:', error);
  process.exitCode = 1;
}
