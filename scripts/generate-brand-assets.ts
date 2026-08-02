#!/usr/bin/env -S pnpm exec tsx
/**
 * Deterministic brand-asset generator.
 *
 * All identity copy, palette values, font provenance, output geometry, and
 * renderer versions live in `.content/brand/brand-kit.v1.json`. Fonts are
 * embedded into each SVG before Sharp renders it, so raster output never
 * depends on host fonts or network access.
 *
 * Usage:
 *   pnpm brand:generate
 *   pnpm brand:check
 *   pnpm generate:og
 */

import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, '.content', 'brand', 'brand-kit.v1.json');
const PUBLIC_DIR = path.join(ROOT, 'public');
const PUBLIC_MANIFEST_PATH = path.join(PUBLIC_DIR, 'brand', 'manifest.json');

type Theme = 'light' | 'dark';
type AssetFormat = 'png' | 'svg';
type AssetTemplate = 'mark' | 'lockup' | 'cover' | 'social' | 'sheet' | 'og';
type FontWeight = 'regular' | 'medium' | 'bold';

interface FontSpec {
  path: string;
  sha256: string;
}

interface AssetSpec {
  id: string;
  path: string;
  format: AssetFormat;
  template: AssetTemplate;
  theme: Theme;
  platform?: 'linkedin' | 'x' | 'github' | 'youtube' | 'presentation' | 'square' | 'portrait';
  width: number;
  height: number;
  use: string;
}

interface BrandManifest {
  schemaVersion: number;
  generatorVersion: string;
  reviewedAt: string;
  renderer: {
    sharp: string;
    vips: string;
    simd: false;
    pngCompressionLevel: number;
  };
  identity: {
    name: string;
    role: string;
    domain: string;
    thesis: string;
    practice: string;
  };
  palette: {
    paper: string;
    surface: string;
    ink: string;
    muted: string;
    accent: string;
    rule: string;
    darkCanvas: string;
    darkSurface: string;
    darkInk: string;
    darkMuted: string;
    darkAccent: string;
    darkRule: string;
  };
  fonts: Record<FontWeight, FontSpec>;
  assets: AssetSpec[];
}

interface ThemeColors {
  canvas: string;
  surface: string;
  foreground: string;
  muted: string;
  accent: string;
  rule: string;
}

interface CliOptions {
  check: boolean;
  assetId?: string;
}

const fontWeights: Record<FontWeight, number> = {
  regular: 400,
  medium: 500,
  bold: 700,
};

const fontData = new Map<FontWeight, string>();

function fail(message: string): never {
  throw new Error(message);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requireRecord(value: unknown, label: string): Record<string, unknown> {
  if (!isRecord(value)) fail(`${label} must be an object`);
  return value;
}

function requireString(value: unknown, label: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    fail(`${label} must be a non-empty string`);
  }
  return value;
}

function requireInteger(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    fail(`${label} must be a positive integer`);
  }
  return value;
}

function escapeXml(value: string): string {
  return value.replace(/[<>&'\"]/g, (character) => {
    const entities: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      "'": '&apos;',
      '"': '&quot;',
    };
    return entities[character];
  });
}

function parseManifest(): BrandManifest {
  const raw = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8')) as unknown;
  const root = requireRecord(raw, 'manifest');
  const renderer = requireRecord(root.renderer, 'manifest.renderer');
  const identity = requireRecord(root.identity, 'manifest.identity');
  const palette = requireRecord(root.palette, 'manifest.palette');
  const fonts = requireRecord(root.fonts, 'manifest.fonts');

  if (!Array.isArray(root.assets)) fail('manifest.assets must be an array');

  const parsedFonts = Object.fromEntries(
    (Object.keys(fontWeights) as FontWeight[]).map((weight) => {
      const font = requireRecord(fonts[weight], `manifest.fonts.${weight}`);
      return [
        weight,
        {
          path: requireString(font.path, `manifest.fonts.${weight}.path`),
          sha256: requireString(font.sha256, `manifest.fonts.${weight}.sha256`).toLowerCase(),
        },
      ];
    })
  ) as Record<FontWeight, FontSpec>;

  const parsedAssets = root.assets.map((value, index): AssetSpec => {
    const record = requireRecord(value, `manifest.assets[${index}]`);
    const format = requireString(record.format, `manifest.assets[${index}].format`);
    const template = requireString(record.template, `manifest.assets[${index}].template`);
    const theme = requireString(record.theme, `manifest.assets[${index}].theme`);
    const platform = record.platform;

    if (!['png', 'svg'].includes(format)) {
      fail(`manifest.assets[${index}].format is unsupported: ${format}`);
    }
    if (!['mark', 'lockup', 'cover', 'social', 'sheet', 'og'].includes(template)) {
      fail(`manifest.assets[${index}].template is unsupported: ${template}`);
    }
    if (!['light', 'dark'].includes(theme)) {
      fail(`manifest.assets[${index}].theme is unsupported: ${theme}`);
    }
    if (
      platform !== undefined &&
      !['linkedin', 'x', 'github', 'youtube', 'presentation', 'square', 'portrait'].includes(
        String(platform)
      )
    ) {
      fail(`manifest.assets[${index}].platform is unsupported: ${String(platform)}`);
    }

    const outputPath = requireString(record.path, `manifest.assets[${index}].path`);
    if (path.isAbsolute(outputPath) || outputPath.split(/[\\/]/).includes('..')) {
      fail(`manifest.assets[${index}].path must stay within public/: ${outputPath}`);
    }

    return {
      id: requireString(record.id, `manifest.assets[${index}].id`),
      path: outputPath,
      format: format as AssetFormat,
      template: template as AssetTemplate,
      theme: theme as Theme,
      platform: platform as AssetSpec['platform'],
      width: requireInteger(record.width, `manifest.assets[${index}].width`),
      height: requireInteger(record.height, `manifest.assets[${index}].height`),
      use: requireString(record.use, `manifest.assets[${index}].use`),
    };
  });

  const manifest: BrandManifest = {
    schemaVersion: requireInteger(root.schemaVersion, 'manifest.schemaVersion'),
    generatorVersion: requireString(root.generatorVersion, 'manifest.generatorVersion'),
    reviewedAt: requireString(root.reviewedAt, 'manifest.reviewedAt'),
    renderer: {
      sharp: requireString(renderer.sharp, 'manifest.renderer.sharp'),
      vips: requireString(renderer.vips, 'manifest.renderer.vips'),
      simd: renderer.simd === false ? false : fail('manifest.renderer.simd must be false'),
      pngCompressionLevel: requireInteger(
        renderer.pngCompressionLevel,
        'manifest.renderer.pngCompressionLevel'
      ),
    },
    identity: {
      name: requireString(identity.name, 'manifest.identity.name'),
      role: requireString(identity.role, 'manifest.identity.role'),
      domain: requireString(identity.domain, 'manifest.identity.domain'),
      thesis: requireString(identity.thesis, 'manifest.identity.thesis'),
      practice: requireString(identity.practice, 'manifest.identity.practice'),
    },
    palette: {
      paper: requireString(palette.paper, 'manifest.palette.paper'),
      surface: requireString(palette.surface, 'manifest.palette.surface'),
      ink: requireString(palette.ink, 'manifest.palette.ink'),
      muted: requireString(palette.muted, 'manifest.palette.muted'),
      accent: requireString(palette.accent, 'manifest.palette.accent'),
      rule: requireString(palette.rule, 'manifest.palette.rule'),
      darkCanvas: requireString(palette.darkCanvas, 'manifest.palette.darkCanvas'),
      darkSurface: requireString(palette.darkSurface, 'manifest.palette.darkSurface'),
      darkInk: requireString(palette.darkInk, 'manifest.palette.darkInk'),
      darkMuted: requireString(palette.darkMuted, 'manifest.palette.darkMuted'),
      darkAccent: requireString(palette.darkAccent, 'manifest.palette.darkAccent'),
      darkRule: requireString(palette.darkRule, 'manifest.palette.darkRule'),
    },
    fonts: parsedFonts,
    assets: parsedAssets,
  };

  if (manifest.schemaVersion !== 1 || manifest.generatorVersion !== '1.0.0') {
    fail(`Unsupported brand-kit contract ${manifest.schemaVersion}/${manifest.generatorVersion}`);
  }
  if (manifest.renderer.pngCompressionLevel < 1 || manifest.renderer.pngCompressionLevel > 9) {
    fail('manifest.renderer.pngCompressionLevel must be between 1 and 9');
  }

  for (const [name, color] of Object.entries(manifest.palette)) {
    if (!/^#[0-9a-f]{6}$/i.test(color)) fail(`manifest.palette.${name} must be a hex color`);
  }

  const ids = new Set<string>();
  const paths = new Set<string>();
  for (const asset of manifest.assets) {
    if (ids.has(asset.id)) fail(`Duplicate asset id: ${asset.id}`);
    if (paths.has(asset.path)) fail(`Duplicate asset path: ${asset.path}`);
    ids.add(asset.id);
    paths.add(asset.path);
    if (!asset.path.endsWith(`.${asset.format}`)) {
      fail(`${asset.id} format does not match its path extension`);
    }
  }

  return manifest;
}

function verifyInputs(manifest: BrandManifest): void {
  for (const key of ['sharp', 'vips'] as const) {
    if (sharp.versions[key] !== manifest.renderer[key]) {
      fail(
        `Renderer version mismatch for ${key}: expected ${manifest.renderer[key]}, found ${sharp.versions[key] ?? 'unknown'}`
      );
    }
  }

  for (const [weight, spec] of Object.entries(manifest.fonts) as Array<[FontWeight, FontSpec]>) {
    const fontPath = path.join(ROOT, spec.path);
    const data = fs.readFileSync(fontPath);
    const digest = createHash('sha256').update(data).digest('hex');
    if (digest !== spec.sha256) {
      fail(`Font hash mismatch for ${weight}: expected ${spec.sha256}, found ${digest}`);
    }
    fontData.set(weight, data.toString('base64'));
  }

  const css = fs.readFileSync(path.join(ROOT, 'app', 'globals.css'), 'utf8').toLowerCase();
  for (const [name, color] of Object.entries(manifest.palette)) {
    if (!css.includes(color.toLowerCase())) {
      fail(`Brand palette ${name} (${color}) is not present in app/globals.css`);
    }
  }
}

function colorsFor(manifest: BrandManifest, theme: Theme): ThemeColors {
  const { palette } = manifest;
  return theme === 'light'
    ? {
        canvas: palette.paper,
        surface: palette.surface,
        foreground: palette.ink,
        muted: palette.muted,
        accent: palette.accent,
        rule: palette.rule,
      }
    : {
        canvas: palette.darkCanvas,
        surface: palette.darkSurface,
        foreground: palette.darkInk,
        muted: palette.darkMuted,
        accent: palette.darkAccent,
        rule: palette.darkRule,
      };
}

function fontCss(...weights: FontWeight[]): string {
  return weights
    .map((weight) => {
      const data = fontData.get(weight) ?? fail(`Font data not loaded for ${weight}`);
      return `@font-face{font-family:'Space Grotesk';src:url(data:font/ttf;base64,${data}) format('truetype');font-style:normal;font-weight:${fontWeights[weight]};}`;
    })
    .join('');
}

function svgDocument(width: number, height: number, body: string, styles = ''): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs><style>${styles}</style></defs>${body}</svg>`;
}

function markGeometry(x: number, y: number, size: number, foreground: string, accent: string) {
  const scale = size / 100;
  return `<g transform="translate(${x} ${y}) scale(${scale})">
    <path fill="${foreground}" fill-rule="evenodd" d="M18 10H48C75 10 90 25 90 50C90 75 75 90 48 90H18V10ZM37 27V73H47C63 73 71 65 71 50C71 35 63 27 47 27H37Z"/>
    <rect x="80" y="35" width="4" height="30" fill="${accent}"/>
  </g>`;
}

function markPanel(x: number, y: number, size: number, colors: ThemeColors, background = true) {
  return `${
    background
      ? `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${colors.canvas}" stroke="${colors.rule}" stroke-width="${Math.max(1, size * 0.004)}"/>`
      : ''
  }${markGeometry(x + size * 0.13, y + size * 0.13, size * 0.74, colors.foreground, colors.accent)}`;
}

function buildMark(manifest: BrandManifest, asset: AssetSpec): string {
  const colors = colorsFor(manifest, asset.theme);
  const inset = asset.width * 0.1;
  const frame = asset.width - inset * 2;
  return svgDocument(
    asset.width,
    asset.height,
    `<rect width="${asset.width}" height="${asset.height}" fill="${colors.canvas}"/>
     <rect x="${inset}" y="${inset}" width="${frame}" height="${frame}" fill="none" stroke="${colors.rule}" stroke-width="${Math.max(2, asset.width * 0.004)}"/>
     ${markGeometry(
       asset.width * 0.19,
       asset.height * 0.19,
       asset.width * 0.62,
       colors.foreground,
       colors.accent
     )}`
  );
}

function buildLockup(manifest: BrandManifest, asset: AssetSpec): string {
  const colors = colorsFor(manifest, asset.theme);
  const { identity } = manifest;
  const markSize = asset.height * 0.66;
  const markX = asset.height * 0.12;
  const markY = (asset.height - markSize) / 2;
  const dividerX = asset.height * 0.94;
  const copyX = asset.height * 1.08;

  return svgDocument(
    asset.width,
    asset.height,
    `${markPanel(markX, markY, markSize, colors, false)}
     <line x1="${dividerX}" y1="${asset.height * 0.18}" x2="${dividerX}" y2="${asset.height * 0.82}" stroke="${colors.rule}" stroke-width="2"/>
     <text x="${copyX}" y="${asset.height * 0.48}" font-family="Space Grotesk" font-size="${asset.height * 0.25}" font-weight="500" letter-spacing="-0.025em" fill="${colors.foreground}">${escapeXml(identity.name)}</text>
     <text x="${copyX}" y="${asset.height * 0.65}" font-family="Space Grotesk" font-size="${asset.height * 0.058}" font-weight="500" letter-spacing="0.12em" fill="${colors.muted}">${escapeXml(identity.role.toUpperCase())} / ${escapeXml(identity.domain.toUpperCase())}</text>`,
    fontCss('medium')
  );
}

function buildCover(manifest: BrandManifest, asset: AssetSpec): string {
  const colors = colorsFor(manifest, asset.theme);
  const { identity } = manifest;
  if (asset.platform === 'youtube') {
    const safeX = (asset.width - 1546) / 2;
    const safeY = (asset.height - 423) / 2;
    const markSize = 260;
    const contentX = safeX + 340;
    return svgDocument(
      asset.width,
      asset.height,
      `<rect width="${asset.width}" height="${asset.height}" fill="${colors.canvas}"/>
       <rect width="${asset.width}" height="18" fill="${colors.accent}"/>
       <rect x="${safeX}" y="${safeY}" width="1546" height="423" fill="${colors.surface}"/>
       ${markPanel(safeX + 38, safeY + 82, markSize, colors)}
       <text x="${contentX}" y="${safeY + 128}" font-family="Space Grotesk" font-size="82" font-weight="500" letter-spacing="-0.025em" fill="${colors.foreground}">${escapeXml(identity.name)}</text>
       <text x="${contentX}" y="${safeY + 184}" font-family="Space Grotesk" font-size="30" font-weight="500" letter-spacing="0.1em" fill="${colors.muted}">${escapeXml(identity.role.toUpperCase())} / ${escapeXml(identity.domain.toUpperCase())}</text>
       <line x1="${contentX}" y1="${safeY + 230}" x2="${safeX + 1498}" y2="${safeY + 230}" stroke="${colors.rule}" stroke-width="2"/>
       <text x="${contentX}" y="${safeY + 302}" font-family="Space Grotesk" font-size="48" font-weight="500" letter-spacing="-0.018em" fill="${colors.foreground}">Designing the authority layer around</text>
       <text x="${contentX}" y="${safeY + 359}" font-family="Space Grotesk" font-size="48" font-weight="500" letter-spacing="-0.018em" fill="${colors.foreground}">agent-produced change.</text>`,
      fontCss('medium')
    );
  }

  if (asset.platform === 'presentation') {
    return svgDocument(
      asset.width,
      asset.height,
      `<rect width="${asset.width}" height="${asset.height}" fill="${colors.canvas}"/>
       <rect width="${asset.width}" height="14" fill="${colors.accent}"/>
       ${markPanel(120, 180, 520, colors)}
       <text x="760" y="270" font-family="Space Grotesk" font-size="118" font-weight="500" letter-spacing="-0.025em" fill="${colors.foreground}">${escapeXml(identity.name)}</text>
       <text x="760" y="344" font-family="Space Grotesk" font-size="26" font-weight="500" letter-spacing="0.075em" fill="${colors.muted}">${escapeXml(identity.role.toUpperCase())} / ${escapeXml(identity.domain.toUpperCase())}</text>
       <line x1="760" y1="420" x2="1790" y2="420" stroke="${colors.rule}" stroke-width="3"/>
       <text x="760" y="570" font-family="Space Grotesk" font-size="64" font-weight="500" letter-spacing="-0.02em" fill="${colors.foreground}">Designing the authority layer</text>
       <text x="760" y="650" font-family="Space Grotesk" font-size="64" font-weight="500" letter-spacing="-0.02em" fill="${colors.foreground}">around agent-produced change.</text>
       <line x1="760" y1="770" x2="1790" y2="770" stroke="${colors.rule}" stroke-width="3"/>
       <text x="1790" y="850" text-anchor="end" font-family="Space Grotesk" font-size="29" font-weight="500" letter-spacing="0.075em" fill="${colors.muted}">${escapeXml(identity.practice.toUpperCase())}</text>`,
      fontCss('medium')
    );
  }

  const isGithub = asset.platform === 'github';
  const contentX = isGithub ? asset.width * 0.2 : asset.width * 0.37;
  const markSize = isGithub ? asset.height * 0.19 : asset.height * 0.61;
  const markX = isGithub ? asset.width * 0.075 : asset.width * 0.065;
  const markY = isGithub ? asset.height * 0.12 : (asset.height - markSize) / 2;
  const nameSize = isGithub ? asset.height * 0.1 : asset.height * 0.15;
  const thesisSize = isGithub ? asset.height * 0.064 : asset.height * 0.088;
  const nameY = isGithub ? asset.height * 0.205 : asset.height * 0.32;
  const roleY = isGithub ? asset.height * 0.29 : asset.height * 0.45;
  const thesisY = isGithub ? asset.height * 0.61 : asset.height * 0.69;
  const roleSize = isGithub ? asset.height * 0.032 : asset.height * 0.045;
  const roleTracking = isGithub ? '0.065em' : '0.09em';
  const thesisLines = isGithub
    ? ['Designing the authority layer', 'around agent-produced change.']
    : ['Designing the authority layer', 'around agent-produced change.'];

  return svgDocument(
    asset.width,
    asset.height,
    `<rect width="${asset.width}" height="${asset.height}" fill="${colors.canvas}"/>
     <rect width="${asset.width}" height="${Math.max(5, asset.height * 0.016)}" fill="${colors.accent}"/>
     ${markPanel(markX, markY, markSize, colors, !isGithub)}
     <text x="${contentX}" y="${nameY}" font-family="Space Grotesk" font-size="${nameSize}" font-weight="500" letter-spacing="-0.025em" fill="${colors.foreground}">${escapeXml(identity.name)}</text>
     <text x="${contentX}" y="${roleY}" font-family="Space Grotesk" font-size="${roleSize}" font-weight="500" letter-spacing="${roleTracking}" fill="${colors.muted}">${escapeXml(identity.role.toUpperCase())} / ${escapeXml(identity.domain.toUpperCase())}</text>
     <line x1="${contentX}" y1="${asset.height * 0.52}" x2="${asset.width * 0.93}" y2="${asset.height * 0.52}" stroke="${colors.rule}" stroke-width="2"/>
     <text x="${contentX}" y="${thesisY}" font-family="Space Grotesk" font-size="${thesisSize}" font-weight="500" letter-spacing="-0.018em" fill="${colors.foreground}">
       <tspan x="${contentX}" dy="0">${escapeXml(thesisLines[0])}</tspan>
       <tspan x="${contentX}" dy="1.08em">${escapeXml(thesisLines[1])}</tspan>
     </text>
     <text x="${asset.width * 0.93}" y="${asset.height * 0.9}" text-anchor="end" font-family="Space Grotesk" font-size="${asset.height * 0.039}" font-weight="500" letter-spacing="0.04em" fill="${colors.muted}">${escapeXml(identity.practice.toUpperCase())}</text>`,
    fontCss('medium')
  );
}

function buildSocial(manifest: BrandManifest, asset: AssetSpec): string {
  const colors = colorsFor(manifest, asset.theme);
  const { identity } = manifest;
  const padding = asset.width * 0.075;
  const markSize = asset.width * 0.18;
  const titleSize = asset.width * 0.055;
  const isPortrait = asset.platform === 'portrait';
  const thesisY = isPortrait ? asset.height * 0.46 : asset.height * 0.47;
  const footerY = asset.height - padding;

  return svgDocument(
    asset.width,
    asset.height,
    `<rect width="${asset.width}" height="${asset.height}" fill="${colors.canvas}"/>
     <rect width="${asset.width}" height="${Math.max(8, asset.height * 0.012)}" fill="${colors.accent}"/>
     ${markPanel(padding, padding, markSize, colors)}
     <text x="${asset.width - padding}" y="${padding + markSize * 0.33}" text-anchor="end" font-family="Space Grotesk" font-size="${asset.width * 0.03}" font-weight="500" letter-spacing="0.04em" fill="${colors.foreground}">${escapeXml(identity.name)}</text>
     <text x="${asset.width - padding}" y="${padding + markSize * 0.58}" text-anchor="end" font-family="Space Grotesk" font-size="${asset.width * 0.018}" font-weight="500" letter-spacing="0.11em" fill="${colors.muted}">${escapeXml(identity.role.toUpperCase())}</text>
     <line x1="${padding}" y1="${thesisY - titleSize * 0.95}" x2="${asset.width - padding}" y2="${thesisY - titleSize * 0.95}" stroke="${colors.rule}" stroke-width="2"/>
     <text x="${padding}" y="${thesisY}" font-family="Space Grotesk" font-size="${titleSize}" font-weight="500" letter-spacing="-0.025em" fill="${colors.foreground}">
       <tspan x="${padding}" dy="0">Designing the authority</tspan>
       <tspan x="${padding}" dy="1.08em">layer around agent-produced</tspan>
       <tspan x="${padding}" dy="1.08em">change.</tspan>
     </text>
     <line x1="${padding}" y1="${footerY - asset.height * 0.075}" x2="${asset.width - padding}" y2="${footerY - asset.height * 0.075}" stroke="${colors.rule}" stroke-width="2"/>
     <text x="${padding}" y="${footerY}" font-family="Space Grotesk" font-size="${asset.width * 0.022}" font-weight="500" letter-spacing="0.08em" fill="${colors.accent}">${escapeXml(identity.domain.toUpperCase())}</text>
     <text x="${asset.width - padding}" y="${footerY}" text-anchor="end" font-family="Space Grotesk" font-size="${asset.width * 0.017}" font-weight="500" letter-spacing="0.045em" fill="${colors.muted}">${escapeXml(identity.practice.toUpperCase())}</text>`,
    fontCss('medium')
  );
}

function buildOg(manifest: BrandManifest, asset: AssetSpec): string {
  const colors = colorsFor(manifest, asset.theme);
  const { identity } = manifest;
  return svgDocument(
    asset.width,
    asset.height,
    `<rect width="${asset.width}" height="${asset.height}" fill="${colors.canvas}"/>
     <rect width="${asset.width}" height="9" fill="${colors.accent}"/>
     ${markPanel(72, 58, 96, colors)}
     <text x="194" y="96" font-family="Space Grotesk" font-size="34" font-weight="500" letter-spacing="-0.02em" fill="${colors.foreground}">${escapeXml(identity.name)}</text>
     <text x="194" y="130" font-family="Space Grotesk" font-size="17" font-weight="500" letter-spacing="0.1em" fill="${colors.muted}">${escapeXml(identity.role.toUpperCase())}</text>
     <line x1="72" y1="186" x2="1128" y2="186" stroke="${colors.rule}" stroke-width="2"/>
     <text x="72" y="285" font-family="Space Grotesk" font-size="61" font-weight="500" letter-spacing="-0.025em" fill="${colors.foreground}">
       <tspan x="72" dy="0">Designing the authority layer</tspan>
       <tspan x="72" dy="1.08em">around agent-produced change.</tspan>
     </text>
     <line x1="72" y1="493" x2="1128" y2="493" stroke="${colors.rule}" stroke-width="2"/>
     <text x="72" y="548" font-family="Space Grotesk" font-size="18" font-weight="500" letter-spacing="0.09em" fill="${colors.muted}">${escapeXml(identity.practice.toUpperCase())}</text>
     <text x="1128" y="575" text-anchor="end" font-family="Space Grotesk" font-size="22" font-weight="700" letter-spacing="0.04em" fill="${colors.accent}">${escapeXml(identity.domain)}</text>`,
    fontCss('medium', 'bold')
  );
}

function buildSheet(manifest: BrandManifest, asset: AssetSpec): string {
  const light = colorsFor(manifest, 'light');
  const dark = colorsFor(manifest, 'dark');
  const { identity, palette } = manifest;
  const swatches = [
    ['Paper', palette.paper],
    ['Surface', palette.surface],
    ['Ink', palette.ink],
    ['Muted', palette.muted],
    ['Accent', palette.accent],
    ['Rule', palette.rule],
  ];

  const swatchSvg = swatches
    .map(([label, color], index) => {
      const x = 126 + index * 345;
      const foreground =
        label === 'Ink' || label === 'Muted' || label === 'Accent'
          ? light.canvas
          : light.foreground;
      return `<rect x="${x}" y="1040" width="300" height="180" fill="${color}"/>
        <text x="${x + 22}" y="1102" font-family="Space Grotesk" font-size="30" font-weight="500" fill="${foreground}">${label}</text>
        <text x="${x + 22}" y="1160" font-family="Space Grotesk" font-size="25" font-weight="400" letter-spacing="0.05em" fill="${foreground}">${color.toUpperCase()}</text>`;
    })
    .join('');

  return svgDocument(
    asset.width,
    asset.height,
    `<rect width="${asset.width}" height="${asset.height}" fill="${light.canvas}"/>
     <rect width="18" height="${asset.height}" fill="${light.accent}"/>
     <text x="126" y="150" font-family="Space Grotesk" font-size="92" font-weight="500" letter-spacing="-0.025em" fill="${light.foreground}">${escapeXml(identity.name)}</text>
     <text x="126" y="215" font-family="Space Grotesk" font-size="28" font-weight="500" letter-spacing="0.12em" fill="${light.muted}">${escapeXml(identity.role.toUpperCase())} / ${escapeXml(identity.domain.toUpperCase())}</text>
     <line x1="126" y1="284" x2="2274" y2="284" stroke="${light.rule}" stroke-width="3"/>
     <rect x="126" y="352" width="500" height="500" fill="${light.canvas}" stroke="${light.rule}" stroke-width="3"/>
     ${markGeometry(206, 432, 340, light.foreground, light.accent)}
     <rect x="674" y="352" width="500" height="500" fill="${dark.canvas}"/>
     ${markGeometry(754, 432, 340, dark.foreground, dark.accent)}
     <text x="1252" y="454" font-family="Space Grotesk" font-size="64" font-weight="500" letter-spacing="-0.02em" fill="${light.foreground}">Identity system</text>
     <text x="1252" y="535" font-family="Space Grotesk" font-size="33" font-weight="400" fill="${light.muted}">Name: ${escapeXml(identity.name)}</text>
     <text x="1252" y="593" font-family="Space Grotesk" font-size="33" font-weight="400" fill="${light.muted}">Role: ${escapeXml(identity.role)}</text>
     <text x="1252" y="651" font-family="Space Grotesk" font-size="33" font-weight="400" fill="${light.muted}">Domain: ${escapeXml(identity.domain)}</text>
     <text x="1252" y="748" font-family="Space Grotesk" font-size="34" font-weight="500" fill="${light.foreground}">The green gate inside the D marks the authority layer.</text>
     <text x="1252" y="802" font-family="Space Grotesk" font-size="30" font-weight="400" fill="${light.muted}">Agent work moves; accountable authorization stays explicit.</text>
     <text x="126" y="976" font-family="Space Grotesk" font-size="46" font-weight="500" letter-spacing="-0.015em" fill="${light.foreground}">Core palette</text>
     ${swatchSvg}
     <line x1="126" y1="1302" x2="2274" y2="1302" stroke="${light.rule}" stroke-width="3"/>
     <text x="126" y="1380" font-family="Space Grotesk" font-size="35" font-weight="500" fill="${light.foreground}">Use the supplied light or dark master.</text>
     <text x="126" y="1433" font-family="Space Grotesk" font-size="29" font-weight="400" fill="${light.muted}">Preserve clear space · never stretch · never recolor · keep the role exactly “${escapeXml(identity.role)}”</text>
     <text x="126" y="1521" font-family="Space Grotesk" font-size="25" font-weight="500" letter-spacing="0.1em" fill="${light.accent}">${escapeXml(identity.practice.toUpperCase())}</text>
     <text x="2274" y="1521" text-anchor="end" font-family="Space Grotesk" font-size="25" font-weight="500" letter-spacing="0.08em" fill="${light.foreground}">${escapeXml(identity.domain.toUpperCase())}</text>`,
    fontCss('regular', 'medium')
  );
}

function buildSvg(manifest: BrandManifest, asset: AssetSpec): string {
  switch (asset.template) {
    case 'mark':
      return buildMark(manifest, asset);
    case 'lockup':
      return buildLockup(manifest, asset);
    case 'cover':
      return buildCover(manifest, asset);
    case 'social':
      return buildSocial(manifest, asset);
    case 'sheet':
      return buildSheet(manifest, asset);
    case 'og':
      return buildOg(manifest, asset);
  }
}

async function renderAsset(manifest: BrandManifest, asset: AssetSpec): Promise<Buffer> {
  const svg = Buffer.from(buildSvg(manifest, asset));
  if (asset.format === 'svg') return svg;

  return sharp(svg)
    .png({
      compressionLevel: manifest.renderer.pngCompressionLevel,
      adaptiveFiltering: false,
      palette: false,
    })
    .toBuffer();
}

function publicManifestBuffer(manifest: BrandManifest): Buffer {
  const value = {
    schemaVersion: manifest.schemaVersion,
    generatorVersion: manifest.generatorVersion,
    reviewedAt: manifest.reviewedAt,
    identity: manifest.identity,
    palette: manifest.palette,
    assets: manifest.assets.map((asset) => ({
      id: asset.id,
      path: `/${asset.path.replace(/\\/g, '/')}`,
      format: asset.format,
      width: asset.width,
      height: asset.height,
      use: asset.use,
    })),
  };
  return Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
}

function compareFile(filePath: string, expected: Buffer, errors: string[]): void {
  if (!fs.existsSync(filePath)) {
    errors.push(`missing ${path.relative(ROOT, filePath)}`);
    return;
  }
  const actual = fs.readFileSync(filePath);
  if (!actual.equals(expected)) errors.push(`byte drift in ${path.relative(ROOT, filePath)}`);
}

function listFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(absolute) : [absolute];
  });
}

function checkUnexpectedFiles(manifest: BrandManifest, errors: string[]): void {
  const expected = new Set(
    manifest.assets
      .filter((asset) => asset.path.startsWith('brand/'))
      .map((asset) => path.normalize(path.join(PUBLIC_DIR, asset.path)))
  );
  expected.add(path.normalize(PUBLIC_MANIFEST_PATH));

  for (const file of listFiles(path.join(PUBLIC_DIR, 'brand'))) {
    if (!expected.has(path.normalize(file))) {
      errors.push(`unexpected generated brand asset: ${path.relative(ROOT, file)}`);
    }
  }
}

function parseCli(): CliOptions {
  const args = process.argv.slice(2);
  let check = false;
  let assetId: string | undefined;

  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === '--check') {
      check = true;
    } else if (arg === '--asset') {
      assetId = args[++index];
      if (!assetId) fail('--asset requires an id');
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
Deterministic brand-asset generator

Usage:
  pnpm brand:generate
  pnpm brand:check
  pnpm generate:og
  pnpm exec tsx scripts/generate-brand-assets.ts --asset ASSET_ID
`);
      process.exit(0);
    } else {
      fail(`Unknown argument: ${arg}`);
    }
  }

  return { check, assetId };
}

async function main(): Promise<void> {
  const options = parseCli();
  const manifest = parseManifest();
  verifyInputs(manifest);

  sharp.cache(false);
  sharp.concurrency(1);
  sharp.simd(false);

  const assets = options.assetId
    ? manifest.assets.filter((asset) => asset.id === options.assetId)
    : manifest.assets;
  if (assets.length === 0) fail(`Unknown brand asset: ${options.assetId}`);

  if (!options.check) {
    let byteCount = 0;
    for (const asset of assets) {
      const buffer = await renderAsset(manifest, asset);
      const outputPath = path.join(PUBLIC_DIR, asset.path);
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, buffer);
      byteCount += buffer.length;
      console.log(`generated ${asset.id} (${asset.width}x${asset.height}, ${buffer.length} bytes)`);
    }

    if (!options.assetId) {
      const buffer = publicManifestBuffer(manifest);
      fs.mkdirSync(path.dirname(PUBLIC_MANIFEST_PATH), { recursive: true });
      fs.writeFileSync(PUBLIC_MANIFEST_PATH, buffer);
      byteCount += buffer.length;
      console.log(`generated brand-manifest (${buffer.length} bytes)`);
    }

    console.log(`Generated ${assets.length} deterministic brand assets (${byteCount} bytes).`);
    console.log('Run `pnpm brand:check` before committing the generated files.');
    return;
  }

  const errors: string[] = [];
  for (const asset of assets) {
    const expected = await renderAsset(manifest, asset);
    compareFile(path.join(PUBLIC_DIR, asset.path), expected, errors);
    console.log(`checked ${asset.id}`);
  }

  if (!options.assetId) {
    compareFile(PUBLIC_MANIFEST_PATH, publicManifestBuffer(manifest), errors);
    checkUnexpectedFiles(manifest, errors);
  }

  if (errors.length > 0) {
    console.error(
      `Brand-asset check failed with ${errors.length} issue${errors.length === 1 ? '' : 's'}:`
    );
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }

  console.log(`Verified ${assets.length} byte-reproducible brand assets.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
