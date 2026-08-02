import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

interface ImgBotConfig {
  ignoredFiles: string[];
}

interface BrandManifest {
  assets: Array<{ path: string }>;
}

test('ImgBot excludes every deterministic image output', () => {
  const root = process.cwd();
  const config = JSON.parse(
    fs.readFileSync(path.join(root, '.imgbotconfig'), 'utf8')
  ) as ImgBotConfig;
  const manifest = JSON.parse(
    fs.readFileSync(path.join(root, '.content', 'brand', 'brand-kit.v1.json'), 'utf8')
  ) as BrandManifest;
  const ignoredFiles = new Set(config.ignoredFiles);

  assert.ok(
    ignoredFiles.has('public/images/posts/**'),
    'generated post images must remain outside ImgBot'
  );

  for (const asset of manifest.assets) {
    const publicPath = `public/${asset.path.replace(/\\/g, '/')}`;
    const covered = publicPath.startsWith('public/brand/')
      ? ignoredFiles.has('public/brand/**')
      : ignoredFiles.has(publicPath);

    assert.ok(covered, `ImgBot must ignore generated brand asset ${publicPath}`);
  }
});
