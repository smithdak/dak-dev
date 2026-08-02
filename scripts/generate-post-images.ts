#!/usr/bin/env -S pnpm exec tsx
/**
 * Deterministic post-art generator.
 *
 * The renderer deliberately uses only raw RGB geometry. There are no fonts,
 * SVG inputs, remote assets, random values, or model-generated dependencies.
 * Every output byte is a function of this file, the versioned manifest, the
 * post slug, and the pinned Sharp renderer versions.
 *
 * Usage:
 *   pnpm images:generate
 *   pnpm images:generate -- --all
 *   pnpm images:generate -- --slug <slug>
 *   pnpm images:check
 *   pnpm images:check -- --slug <slug>
 */

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import sharp from 'sharp';
import { generateBlurPlaceholder } from '../lib/image-utils';

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, '.content', 'images', 'post-art.v1.json');
const POSTS_DIR = path.join(ROOT, 'content', 'posts');
const OUTPUT_ROOT = path.join(ROOT, 'public', 'images', 'posts');

const MOTIFS = [
  'handoff',
  'boundary',
  'convergence',
  'ledger',
  'aperture',
  'cascade',
  'orbit',
  'calibration',
] as const;

type Motif = (typeof MOTIFS)[number];
type RGB = readonly [number, number, number];

interface Point {
  x: number;
  y: number;
}

interface PostArtEntry {
  slug: string;
  motif: Motif;
  variant: number;
}

interface OutputSpec {
  width: number;
  height: number;
  file: string;
}

interface PostArtManifest {
  schemaVersion: number;
  generatorVersion: string;
  renderer: {
    sharp: string;
    vips: string;
    mozjpeg: string;
    supersample: number;
    simd: boolean;
    jpegQuality: number;
  };
  outputs: {
    hero: OutputSpec;
    thumbnail: OutputSpec;
  };
  palette: {
    paper: string;
    surface: string;
    ink: string;
    muted: string;
    accent: string;
    rule: string;
  };
  motifs: Record<Motif, string>;
  posts: PostArtEntry[];
}

interface Palette {
  paper: RGB;
  surface: RGB;
  ink: RGB;
  muted: RGB;
  accent: RGB;
  rule: RGB;
}

interface RenderedPost {
  hero: Buffer;
  thumbnail: Buffer;
  heroBlur: string;
  thumbnailBlur: string;
}

interface CliOptions {
  check: boolean;
  slug?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function fail(message: string): never {
  throw new Error(message);
}

function requireRecord(value: unknown, label: string): Record<string, unknown> {
  if (!isRecord(value)) fail(`${label} must be an object`);
  return value;
}

function requireString(value: unknown, label: string): string {
  if (typeof value !== 'string' || value.length === 0) fail(`${label} must be a string`);
  return value;
}

function requireInteger(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value)) fail(`${label} must be an integer`);
  return value;
}

function parseOutputSpec(value: unknown, label: string): OutputSpec {
  const record = requireRecord(value, label);
  return {
    width: requireInteger(record.width, `${label}.width`),
    height: requireInteger(record.height, `${label}.height`),
    file: requireString(record.file, `${label}.file`),
  };
}

function loadManifest(): PostArtManifest {
  const raw = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8')) as unknown;
  const root = requireRecord(raw, 'manifest');
  const renderer = requireRecord(root.renderer, 'manifest.renderer');
  const outputs = requireRecord(root.outputs, 'manifest.outputs');
  const palette = requireRecord(root.palette, 'manifest.palette');
  const motifDescriptions = requireRecord(root.motifs, 'manifest.motifs');

  if (!Array.isArray(root.posts)) fail('manifest.posts must be an array');

  const posts = root.posts.map((value, index): PostArtEntry => {
    const entry = requireRecord(value, `manifest.posts[${index}]`);
    const slug = requireString(entry.slug, `manifest.posts[${index}].slug`);
    const motif = requireString(entry.motif, `manifest.posts[${index}].motif`);
    const variant = requireInteger(entry.variant, `manifest.posts[${index}].variant`);

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      fail(`manifest.posts[${index}].slug is not a canonical slug: ${slug}`);
    }
    if (!(MOTIFS as readonly string[]).includes(motif)) {
      fail(`manifest.posts[${index}].motif is not supported: ${motif}`);
    }
    if (variant < 0 || variant > 3) {
      fail(`manifest.posts[${index}].variant must be between 0 and 3`);
    }

    return { slug, motif: motif as Motif, variant };
  });

  const manifest: PostArtManifest = {
    schemaVersion: requireInteger(root.schemaVersion, 'manifest.schemaVersion'),
    generatorVersion: requireString(root.generatorVersion, 'manifest.generatorVersion'),
    renderer: {
      sharp: requireString(renderer.sharp, 'manifest.renderer.sharp'),
      vips: requireString(renderer.vips, 'manifest.renderer.vips'),
      mozjpeg: requireString(renderer.mozjpeg, 'manifest.renderer.mozjpeg'),
      supersample: requireInteger(renderer.supersample, 'manifest.renderer.supersample'),
      simd: renderer.simd === false ? false : fail('manifest.renderer.simd must be false'),
      jpegQuality: requireInteger(renderer.jpegQuality, 'manifest.renderer.jpegQuality'),
    },
    outputs: {
      hero: parseOutputSpec(outputs.hero, 'manifest.outputs.hero'),
      thumbnail: parseOutputSpec(outputs.thumbnail, 'manifest.outputs.thumbnail'),
    },
    palette: {
      paper: requireString(palette.paper, 'manifest.palette.paper'),
      surface: requireString(palette.surface, 'manifest.palette.surface'),
      ink: requireString(palette.ink, 'manifest.palette.ink'),
      muted: requireString(palette.muted, 'manifest.palette.muted'),
      accent: requireString(palette.accent, 'manifest.palette.accent'),
      rule: requireString(palette.rule, 'manifest.palette.rule'),
    },
    motifs: Object.fromEntries(
      MOTIFS.map((motif) => [
        motif,
        requireString(motifDescriptions[motif], `manifest.motifs.${motif}`),
      ])
    ) as Record<Motif, string>,
    posts,
  };

  if (manifest.schemaVersion !== 1 || manifest.generatorVersion !== '1.0.0') {
    fail(
      `Unsupported post-art contract ${manifest.schemaVersion}/${manifest.generatorVersion}; update the generator with the manifest`
    );
  }
  if (
    manifest.outputs.hero.width !== 1600 ||
    manifest.outputs.hero.height !== 900 ||
    manifest.outputs.hero.file !== 'hero.jpg' ||
    manifest.outputs.thumbnail.width !== 960 ||
    manifest.outputs.thumbnail.height !== 640 ||
    manifest.outputs.thumbnail.file !== 'thumbnail.jpg'
  ) {
    fail('Manifest output specs must remain hero 1600x900 and thumbnail 960x640 JPEG');
  }
  if (manifest.renderer.supersample !== 2) {
    fail('Manifest renderer.supersample must be 2 for generator version 1.0.0');
  }
  if (manifest.renderer.jpegQuality < 1 || manifest.renderer.jpegQuality > 100) {
    fail('Manifest renderer.jpegQuality must be between 1 and 100');
  }

  for (const [name, value] of Object.entries(manifest.palette)) {
    if (!/^#[0-9a-f]{6}$/i.test(value)) fail(`manifest.palette.${name} must be a hex color`);
  }

  return manifest;
}

function verifyRendererVersions(manifest: PostArtManifest): void {
  for (const key of ['sharp', 'vips', 'mozjpeg'] as const) {
    if (sharp.versions[key] !== manifest.renderer[key]) {
      fail(
        `Renderer version mismatch for ${key}: expected ${manifest.renderer[key]}, found ${sharp.versions[key] ?? 'unknown'}`
      );
    }
  }
}

function verifyContentCoverage(manifest: PostArtManifest): Map<string, string> {
  const content = new Map<string, string>();

  for (const file of fs
    .readdirSync(POSTS_DIR)
    .filter((name) => name.endsWith('.mdx'))
    .sort()) {
    const fileSlug = path.basename(file, '.mdx');
    const sourcePath = path.join(POSTS_DIR, file);
    const parsed = matter(fs.readFileSync(sourcePath, 'utf8')).data as Record<string, unknown>;
    if (parsed.slug !== fileSlug) {
      fail(
        `${path.relative(ROOT, sourcePath)} has slug ${String(parsed.slug)}; expected ${fileSlug}`
      );
    }
    content.set(fileSlug, sourcePath);
  }

  const manifestSlugs = new Set<string>();
  for (const entry of manifest.posts) {
    if (manifestSlugs.has(entry.slug)) fail(`Duplicate manifest post: ${entry.slug}`);
    manifestSlugs.add(entry.slug);
  }

  const missing = [...content.keys()].filter((slug) => !manifestSlugs.has(slug));
  const stale = [...manifestSlugs].filter((slug) => !content.has(slug));
  if (missing.length > 0 || stale.length > 0) {
    const details = [
      missing.length > 0 ? `missing from manifest: ${missing.join(', ')}` : '',
      stale.length > 0 ? `not present in content/posts: ${stale.join(', ')}` : '',
    ].filter(Boolean);
    fail(`Post-art manifest coverage mismatch (${details.join('; ')})`);
  }

  return content;
}

function hexToRgb(hex: string): RGB {
  return [
    Number.parseInt(hex.slice(1, 3), 16),
    Number.parseInt(hex.slice(3, 5), 16),
    Number.parseInt(hex.slice(5, 7), 16),
  ];
}

function getPalette(manifest: PostArtManifest): Palette {
  return {
    paper: hexToRgb(manifest.palette.paper),
    surface: hexToRgb(manifest.palette.surface),
    ink: hexToRgb(manifest.palette.ink),
    muted: hexToRgb(manifest.palette.muted),
    accent: hexToRgb(manifest.palette.accent),
    rule: hexToRgb(manifest.palette.rule),
  };
}

class Artboard {
  readonly data: Buffer;

  constructor(
    readonly width: number,
    readonly height: number,
    background: RGB
  ) {
    this.data = Buffer.alloc(width * height * 3);
    this.data.fill(Buffer.from(background));
  }

  point(x: number, y: number): Point {
    return { x: x * this.width, y: y * this.height };
  }

  private span(y: number, fromX: number, toX: number, color: RGB, alpha = 1): void {
    if (y < 0 || y >= this.height) return;
    const start = Math.max(0, Math.ceil(Math.min(fromX, toX)));
    const end = Math.min(this.width - 1, Math.floor(Math.max(fromX, toX)));
    if (start > end) return;

    let offset = (y * this.width + start) * 3;
    if (alpha >= 1) {
      for (let x = start; x <= end; x++) {
        this.data[offset] = color[0];
        this.data[offset + 1] = color[1];
        this.data[offset + 2] = color[2];
        offset += 3;
      }
      return;
    }

    const inverse = 1 - alpha;
    for (let x = start; x <= end; x++) {
      this.data[offset] = Math.round(this.data[offset] * inverse + color[0] * alpha);
      this.data[offset + 1] = Math.round(this.data[offset + 1] * inverse + color[1] * alpha);
      this.data[offset + 2] = Math.round(this.data[offset + 2] * inverse + color[2] * alpha);
      offset += 3;
    }
  }

  rect(x: number, y: number, width: number, height: number, color: RGB, alpha = 1): void {
    const startY = Math.max(0, Math.ceil(y));
    const endY = Math.min(this.height - 1, Math.floor(y + height));
    for (let row = startY; row <= endY; row++) this.span(row, x, x + width, color, alpha);
  }

  normalizedRect(x: number, y: number, width: number, height: number, color: RGB, alpha = 1): void {
    this.rect(
      x * this.width,
      y * this.height,
      width * this.width,
      height * this.height,
      color,
      alpha
    );
  }

  circle(center: Point, radius: number, color: RGB, alpha = 1): void {
    const radiusSquared = radius * radius;
    const startY = Math.max(0, Math.ceil(center.y - radius));
    const endY = Math.min(this.height - 1, Math.floor(center.y + radius));
    for (let y = startY; y <= endY; y++) {
      const dy = y + 0.5 - center.y;
      const halfWidth = Math.sqrt(Math.max(0, radiusSquared - dy * dy));
      this.span(y, center.x - halfWidth, center.x + halfWidth, color, alpha);
    }
  }

  ring(center: Point, radius: number, stroke: number, color: RGB, alpha = 1): void {
    const outerSquared = radius * radius;
    const innerRadius = Math.max(0, radius - stroke);
    const innerSquared = innerRadius * innerRadius;
    const startY = Math.max(0, Math.ceil(center.y - radius));
    const endY = Math.min(this.height - 1, Math.floor(center.y + radius));

    for (let y = startY; y <= endY; y++) {
      const dy = y + 0.5 - center.y;
      const outerHalf = Math.sqrt(Math.max(0, outerSquared - dy * dy));
      if (Math.abs(dy) >= innerRadius) {
        this.span(y, center.x - outerHalf, center.x + outerHalf, color, alpha);
        continue;
      }
      const innerHalf = Math.sqrt(Math.max(0, innerSquared - dy * dy));
      this.span(y, center.x - outerHalf, center.x - innerHalf, color, alpha);
      this.span(y, center.x + innerHalf, center.x + outerHalf, color, alpha);
    }
  }

  polygon(points: readonly Point[], color: RGB, alpha = 1): void {
    if (points.length < 3) return;
    const startY = Math.max(0, Math.ceil(Math.min(...points.map((point) => point.y))));
    const endY = Math.min(this.height - 1, Math.floor(Math.max(...points.map((point) => point.y))));

    for (let y = startY; y <= endY; y++) {
      const scanY = y + 0.5;
      const intersections: number[] = [];
      for (let index = 0; index < points.length; index++) {
        const start = points[index];
        const end = points[(index + 1) % points.length];
        if ((start.y <= scanY && end.y > scanY) || (end.y <= scanY && start.y > scanY)) {
          intersections.push(start.x + ((scanY - start.y) * (end.x - start.x)) / (end.y - start.y));
        }
      }
      intersections.sort((left, right) => left - right);
      for (let index = 0; index + 1 < intersections.length; index += 2) {
        this.span(y, intersections[index], intersections[index + 1], color, alpha);
      }
    }
  }

  line(start: Point, end: Point, stroke: number, color: RGB, alpha = 1): void {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy);
    if (length === 0) {
      this.circle(start, stroke / 2, color, alpha);
      return;
    }
    const offsetX = (-dy / length) * (stroke / 2);
    const offsetY = (dx / length) * (stroke / 2);
    this.polygon(
      [
        { x: start.x + offsetX, y: start.y + offsetY },
        { x: end.x + offsetX, y: end.y + offsetY },
        { x: end.x - offsetX, y: end.y - offsetY },
        { x: start.x - offsetX, y: start.y - offsetY },
      ],
      color,
      alpha
    );
    this.circle(start, stroke / 2, color, alpha);
    this.circle(end, stroke / 2, color, alpha);
  }

  polyline(points: readonly Point[], stroke: number, color: RGB, alpha = 1): void {
    for (let index = 0; index + 1 < points.length; index++) {
      this.line(points[index], points[index + 1], stroke, color, alpha);
    }
  }

  arc(
    center: Point,
    radius: number,
    startAngle: number,
    endAngle: number,
    stroke: number,
    color: RGB,
    alpha = 1
  ): void {
    const pointCount = Math.max(10, Math.ceil(Math.abs(endAngle - startAngle) * 18));
    const points = Array.from({ length: pointCount + 1 }, (_, index) => {
      const angle = startAngle + ((endAngle - startAngle) * index) / pointCount;
      return {
        x: center.x + Math.cos(angle) * radius,
        y: center.y + Math.sin(angle) * radius,
      };
    });
    this.polyline(points, stroke, color, alpha);
  }

  outlineRect(
    x: number,
    y: number,
    width: number,
    height: number,
    stroke: number,
    color: RGB,
    alpha = 1
  ): void {
    this.rect(x, y, width, stroke, color, alpha);
    this.rect(x, y + height - stroke, width, stroke, color, alpha);
    this.rect(x, y, stroke, height, color, alpha);
    this.rect(x + width - stroke, y, stroke, height, color, alpha);
  }
}

function fnv1a(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index++) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function drawEditorialFrame(board: Artboard, palette: Palette, seed: number): void {
  const fine = board.height * 0.0024;
  const marker = 0.065 + ((seed >>> 4) & 3) * 0.012;
  board.line(board.point(0.06, 0.09), board.point(0.36, 0.09), fine, palette.rule);
  board.line(board.point(0.06, 0.09), board.point(marker, 0.09), fine * 2.4, palette.accent);
  board.line(board.point(0.94, 0.17), board.point(0.94, 0.83), fine, palette.rule);
  board.circle(board.point(0.94, 0.12), board.height * 0.009, palette.ink);
  board.circle(board.point(0.94, 0.12), board.height * 0.004, palette.paper);
}

function mirrorX(point: Point, board: Artboard, mirrored: boolean): Point {
  return mirrored ? { x: board.width - point.x, y: point.y } : point;
}

function drawHandoff(board: Artboard, palette: Palette, seed: number, variant: number): void {
  const mirrored = ((seed >>> 9) & 1) === 1;
  const stroke = board.height * 0.005;
  board.normalizedRect(0.1, 0.25, 0.8, 0.5, palette.surface, 0.72);

  const positions = [0.17, 0.33, 0.5, 0.67, 0.83].map((x, index) => {
    const alternation = (index + variant) % 2 === 0 ? -1 : 1;
    const y = 0.5 + alternation * (0.12 + ((seed >>> (index + 2)) & 1) * 0.025);
    return mirrorX(board.point(x, y), board, mirrored);
  });

  board.polyline(positions, stroke, palette.muted, 0.72);
  const gateX = mirrorX(board.point(0.735, 0), board, mirrored).x;
  board.line(
    { x: gateX, y: board.height * 0.22 },
    { x: gateX, y: board.height * 0.78 },
    stroke * 0.65,
    palette.ink,
    0.75
  );
  board.normalizedRect(mirrored ? 0.718 : 0.728, 0.455, 0.014, 0.09, palette.paper);
  board.normalizedRect(mirrored ? 0.716 : 0.73, 0.478, 0.018, 0.044, palette.accent);

  positions.forEach((point, index) => {
    const radius = board.height * (index === 2 ? 0.052 : 0.041);
    board.circle(point, radius, palette.paper);
    board.ring(
      point,
      radius,
      stroke,
      index === positions.length - 1 ? palette.accent : palette.ink
    );
    board.circle(point, radius * 0.28, index === 2 ? palette.ink : palette.muted);
  });
}

function drawBoundary(board: Artboard, palette: Palette, seed: number, variant: number): void {
  const mirrored = ((seed >>> 11) & 1) === 1;
  const stroke = board.height * 0.005;
  board.normalizedRect(0.12, 0.16, 0.76, 0.68, palette.surface, 0.58);

  for (let index = 0; index < 4; index++) {
    const insetX = (0.17 + index * 0.055) * board.width;
    const insetY = (0.21 + index * 0.055) * board.height;
    board.outlineRect(
      insetX,
      insetY,
      board.width - insetX * 2,
      board.height - insetY * 2,
      stroke * (index === 3 ? 1.5 : 0.65),
      index === 3 ? palette.ink : palette.rule,
      index === 3 ? 0.88 : 1
    );
  }

  const fieldX = mirrored ? 0.18 : 0.68;
  board.normalizedRect(fieldX, 0.25, 0.14, 0.5, palette.ink, 0.96);
  const passageY = 0.42 + variant * 0.035;
  board.normalizedRect(
    mirrored ? fieldX + 0.11 : fieldX - 0.015,
    passageY,
    0.06,
    0.16,
    palette.paper
  );
  board.normalizedRect(
    mirrored ? fieldX + 0.117 : fieldX - 0.007,
    passageY + 0.055,
    0.045,
    0.05,
    palette.accent
  );
  const ruleX = mirrored ? 0.835 : 0.165;
  board.line(board.point(ruleX, 0.32), board.point(ruleX, 0.68), stroke, palette.muted, 0.7);
}

function drawConvergence(board: Artboard, palette: Palette, seed: number, variant: number): void {
  const mirrored = ((seed >>> 7) & 1) === 1;
  const stroke = board.height * 0.004;
  const sourceX = 0.13;
  const joinX = 0.57 + variant * 0.015;
  const terminalX = 0.68;
  const sourceYs = [0.23, 0.34, 0.45, 0.56, 0.67, 0.78];

  board.normalizedRect(0.08, 0.16, 0.84, 0.68, palette.surface, 0.35);
  sourceYs.forEach((sourceY, index) => {
    const drift = (((seed >>> (index * 3)) & 7) - 3) * 0.008;
    const source = mirrorX(board.point(sourceX, sourceY), board, mirrored);
    const elbow = mirrorX(
      board.point(0.38 + (index % 2) * 0.035, sourceY + drift),
      board,
      mirrored
    );
    const join = mirrorX(board.point(joinX, 0.5 + (sourceY - 0.5) * 0.28), board, mirrored);
    board.polyline([source, elbow, join], stroke, palette.muted, 0.76);
    board.circle(source, board.height * 0.016, palette.paper);
    board.ring(source, board.height * 0.016, stroke * 0.75, palette.ink);
  });

  const join = mirrorX(board.point(joinX, 0.5), board, mirrored);
  const terminal = mirrorX(board.point(terminalX, 0.5), board, mirrored);
  board.line(join, terminal, stroke * 2.2, palette.accent);
  const blockX = mirrored ? 0.18 : 0.68;
  board.normalizedRect(blockX, 0.36, 0.17, 0.28, palette.ink);
  board.normalizedRect(mirrored ? blockX + 0.13 : blockX, 0.36, 0.04, 0.28, palette.accent);
  board.normalizedRect(
    mirrored ? blockX + 0.035 : blockX + 0.065,
    0.445,
    0.07,
    0.11,
    palette.paper
  );
}

function drawLedger(board: Artboard, palette: Palette, seed: number, variant: number): void {
  const stroke = board.height * 0.003;
  const top = 0.19;
  const left = 0.14;
  const width = 0.7;
  const rowHeight = 0.095;
  const activeRow = (variant * 2 + ((seed >>> 6) & 1)) % 6;
  board.normalizedRect(left, top, width, rowHeight * 6, palette.surface, 0.76);
  board.normalizedRect(0.72, top, 0.12, rowHeight * 6, palette.ink, 0.94);

  for (let index = 0; index < 6; index++) {
    const rowY = top + index * rowHeight;
    board.line(
      board.point(left, rowY),
      board.point(left + width, rowY),
      stroke,
      index === activeRow ? palette.accent : palette.rule
    );
    board.normalizedRect(left + 0.035, rowY + 0.031, 0.026, 0.026, palette.ink, 0.82);
    board.normalizedRect(
      left + 0.09,
      rowY + 0.039,
      0.35 + (index % 3) * 0.045,
      0.009,
      palette.muted,
      0.7
    );
    board.circle(
      board.point(0.78, rowY + rowHeight / 2),
      board.height * 0.013,
      index === activeRow ? palette.accent : palette.paper
    );
  }
  board.line(
    board.point(left, top + rowHeight * 6),
    board.point(0.84, top + rowHeight * 6),
    stroke,
    palette.rule
  );
  board.normalizedRect(0.105, top + activeRow * rowHeight, 0.012, rowHeight, palette.accent);
}

function drawAperture(board: Artboard, palette: Palette, seed: number, variant: number): void {
  const stroke = board.height * 0.004;
  const tilt = (((seed >>> 5) & 3) - 1.5) * 0.012;
  board.normalizedRect(0.11, 0.18, 0.78, 0.64, palette.surface, 0.4);

  for (let index = 0; index < 4; index++) {
    const x = 0.16 + index * 0.075;
    const y = 0.22 + index * 0.055;
    const width = 0.62 - index * 0.08;
    const height = 0.56 - index * 0.075;
    const offset = tilt * index;
    const points = [
      board.point(x + offset, y),
      board.point(x + width + offset, y),
      board.point(x + width - offset, y + height),
      board.point(x - offset, y + height),
    ];
    board.polyline(
      [...points, points[0]],
      stroke * (index === 3 ? 1.7 : 0.75),
      index === 3 ? palette.ink : palette.rule
    );
  }

  const channelY = 0.43 + variant * 0.025;
  board.normalizedRect(0.29, channelY, 0.42, 0.14, palette.paper);
  board.line(board.point(0.24, 0.5), board.point(0.76, 0.5), stroke * 1.5, palette.ink, 0.8);
  board.normalizedRect(0.47, channelY - 0.035, 0.06, 0.21, palette.ink);
  board.circle(board.point(0.5, 0.5), board.height * 0.026, palette.accent);
  board.circle(board.point(0.5, 0.5), board.height * 0.011, palette.paper);
}

function drawCascade(board: Artboard, palette: Palette, seed: number, variant: number): void {
  const mirrored = ((seed >>> 10) & 1) === 1;
  const stroke = board.height * 0.004;
  const points: Point[] = [];
  board.normalizedRect(0.09, 0.14, 0.82, 0.72, palette.surface, 0.32);

  for (let index = 0; index < 5; index++) {
    const x = 0.16 + index * 0.145;
    const y = 0.23 + index * 0.115;
    const transformedX = mirrored ? 1 - x - 0.11 : x;
    board.normalizedRect(
      transformedX,
      y,
      0.11,
      0.105,
      index === 4 ? palette.accent : index === 2 ? palette.ink : palette.paper
    );
    board.outlineRect(
      transformedX * board.width,
      y * board.height,
      board.width * 0.11,
      board.height * 0.105,
      stroke,
      index === 4 ? palette.accent : palette.ink,
      0.9
    );
    points.push(board.point(transformedX + 0.055, y + 0.0525));
  }
  board.polyline(points, stroke, palette.muted, 0.72);

  const finalPoint = points[points.length - 1];
  board.line(
    finalPoint,
    { x: finalPoint.x, y: board.height * (0.79 + variant * 0.008) },
    stroke * 1.5,
    palette.accent
  );
  board.normalizedRect(mirrored ? 0.085 : 0.855, 0.2, 0.014, 0.6, palette.rule, 0.85);
}

function drawOrbit(board: Artboard, palette: Palette, seed: number, variant: number): void {
  const center = board.point(0.48 + variant * 0.025, 0.5);
  const stroke = board.height * 0.004;
  const baseRadius = board.height * 0.115;
  board.circle(center, board.height * 0.31, palette.surface, 0.5);
  board.ring(center, baseRadius, stroke, palette.ink, 0.85);
  board.circle(center, board.height * 0.065, palette.ink);
  board.circle(center, board.height * 0.025, palette.paper);

  const phase = ((seed >>> 4) & 7) * 0.08;
  const arcs = [
    { radius: baseRadius * 1.55, start: -2.7 + phase, end: -0.15 + phase },
    { radius: baseRadius * 2.15, start: 0.22 + phase, end: 2.65 + phase },
    { radius: baseRadius * 2.72, start: -1.85 + phase, end: 0.62 + phase },
  ];
  arcs.forEach((arc, index) => {
    board.arc(
      center,
      arc.radius,
      arc.start,
      arc.end,
      stroke,
      index === 2 ? palette.muted : palette.rule,
      0.9
    );
    const angle = arc.end;
    const satellite = {
      x: center.x + Math.cos(angle) * arc.radius,
      y: center.y + Math.sin(angle) * arc.radius,
    };
    board.circle(
      satellite,
      board.height * (index === 1 ? 0.024 : 0.017),
      index === 1 ? palette.accent : palette.ink
    );
  });
  board.line(board.point(0.73, 0.5), board.point(0.88, 0.5), stroke, palette.ink);
  board.normalizedRect(0.86, 0.465, 0.035, 0.07, palette.accent);
}

function drawCalibration(board: Artboard, palette: Palette, seed: number, variant: number): void {
  const stroke = board.height * 0.0035;
  const choke = board.point(0.59 + variant * 0.015, 0.5);
  const starts = [0.23, 0.31, 0.4, 0.5, 0.6, 0.69, 0.77];
  board.normalizedRect(0.09, 0.18, 0.82, 0.64, palette.surface, 0.36);

  starts.forEach((y, index) => {
    const drift = (((seed >>> (index * 2)) & 3) - 1.5) * 0.012;
    const start = board.point(0.12, y + drift);
    const mid = board.point(0.36 + (index % 3) * 0.025, 0.5 + (y - 0.5) * 0.52);
    board.polyline(
      [start, mid, choke],
      stroke * (index === 3 ? 1.7 : 1),
      index === 3 ? palette.ink : palette.muted,
      index === 3 ? 0.9 : 0.55
    );
  });

  board.line(choke, board.point(0.88, 0.5), stroke * 2, palette.accent);
  for (let index = 0; index < 6; index++) {
    const x = 0.64 + index * 0.04;
    const height = index % 2 === 0 ? 0.055 : 0.032;
    board.line(
      board.point(x, 0.5 - height),
      board.point(x, 0.5 + height),
      stroke * 0.65,
      palette.ink,
      0.65
    );
  }
  board.circle(choke, board.height * 0.027, palette.paper);
  board.ring(choke, board.height * 0.027, stroke * 1.2, palette.ink);
  board.circle(board.point(0.88, 0.5), board.height * 0.026, palette.accent);
}

function drawMotif(board: Artboard, palette: Palette, entry: PostArtEntry, seed: number): void {
  drawEditorialFrame(board, palette, seed);
  switch (entry.motif) {
    case 'handoff':
      drawHandoff(board, palette, seed, entry.variant);
      break;
    case 'boundary':
      drawBoundary(board, palette, seed, entry.variant);
      break;
    case 'convergence':
      drawConvergence(board, palette, seed, entry.variant);
      break;
    case 'ledger':
      drawLedger(board, palette, seed, entry.variant);
      break;
    case 'aperture':
      drawAperture(board, palette, seed, entry.variant);
      break;
    case 'cascade':
      drawCascade(board, palette, seed, entry.variant);
      break;
    case 'orbit':
      drawOrbit(board, palette, seed, entry.variant);
      break;
    case 'calibration':
      drawCalibration(board, palette, seed, entry.variant);
      break;
  }
}

async function renderImage(
  entry: PostArtEntry,
  spec: OutputSpec,
  manifest: PostArtManifest,
  palette: Palette
): Promise<Buffer> {
  const scale = manifest.renderer.supersample;
  const board = new Artboard(spec.width * scale, spec.height * scale, palette.paper);
  const seed = fnv1a(
    `${manifest.schemaVersion}:${manifest.generatorVersion}:${entry.slug}:${entry.motif}:${entry.variant}`
  );
  drawMotif(board, palette, entry, seed);

  return sharp(board.data, {
    raw: { width: board.width, height: board.height, channels: 3 },
  })
    .resize(spec.width, spec.height, { kernel: sharp.kernel.lanczos3 })
    .jpeg({
      quality: manifest.renderer.jpegQuality,
      chromaSubsampling: '4:4:4',
      progressive: false,
      optimiseCoding: true,
      optimiseScans: false,
      trellisQuantisation: false,
      overshootDeringing: false,
      mozjpeg: true,
    })
    .toBuffer();
}

async function renderPost(
  entry: PostArtEntry,
  manifest: PostArtManifest,
  palette: Palette
): Promise<RenderedPost> {
  const hero = await renderImage(entry, manifest.outputs.hero, manifest, palette);
  const thumbnail = await renderImage(entry, manifest.outputs.thumbnail, manifest, palette);
  return {
    hero,
    thumbnail,
    heroBlur: await generateBlurPlaceholder(hero),
    thumbnailBlur: await generateBlurPlaceholder(thumbnail),
  };
}

function expectedPaths(entry: PostArtEntry, manifest: PostArtManifest) {
  const directory = path.join(OUTPUT_ROOT, entry.slug);
  return {
    directory,
    hero: path.join(directory, manifest.outputs.hero.file),
    thumbnail: path.join(directory, manifest.outputs.thumbnail.file),
    heroPublic: `/images/posts/${entry.slug}/${manifest.outputs.hero.file}`,
    thumbnailPublic: `/images/posts/${entry.slug}/${manifest.outputs.thumbnail.file}`,
  };
}

function writePost(entry: PostArtEntry, rendered: RenderedPost, manifest: PostArtManifest): void {
  const paths = expectedPaths(entry, manifest);
  fs.mkdirSync(paths.directory, { recursive: true });
  fs.writeFileSync(paths.hero, rendered.hero);
  fs.writeFileSync(paths.thumbnail, rendered.thumbnail);
}

function setFrontmatterField(source: string, field: string, value: string): string {
  const replacement = `${field}: "${value.replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"`;
  const existing = new RegExp(
    `^${field}:[^\\r\\n]*(?:\\r?\\n[ \\t]+data:image/jpeg;base64,[^\\r\\n]*)?`,
    'm'
  );
  if (existing.test(source)) return source.replace(existing, () => replacement);

  const frontmatter = source.match(/^---\r?\n[\s\S]*?\r?\n---(?=\r?\n)/);
  if (!frontmatter || frontmatter.index === undefined) {
    fail(`Cannot add ${field}: post has no valid frontmatter boundary`);
  }
  const newline = source.includes('\r\n') ? '\r\n' : '\n';
  const closingOffset = frontmatter[0].lastIndexOf(`${newline}---`);
  if (closingOffset < 0) fail(`Cannot add ${field}: post has no closing frontmatter boundary`);
  const insertion = frontmatter.index + closingOffset;
  return `${source.slice(0, insertion)}${newline}${replacement}${source.slice(insertion)}`;
}

function syncFrontmatter(
  sourcePath: string,
  entry: PostArtEntry,
  rendered: RenderedPost,
  manifest: PostArtManifest
): boolean {
  const paths = expectedPaths(entry, manifest);
  const expectations: Record<string, string> = {
    hero: paths.heroPublic,
    heroBlur: rendered.heroBlur,
    thumbnail: paths.thumbnailPublic,
    thumbnailBlur: rendered.thumbnailBlur,
  };
  let source = fs.readFileSync(sourcePath, 'utf8');
  let changed = false;

  for (const [field, expected] of Object.entries(expectations)) {
    const current = matter(source).data as Record<string, unknown>;
    if (current[field] === expected) continue;
    source = setFrontmatterField(source, field, expected);
    changed = true;
  }

  if (changed) fs.writeFileSync(sourcePath, source, 'utf8');
  return changed;
}

function compareFile(filePath: string, expected: Buffer, label: string, errors: string[]): void {
  if (!fs.existsSync(filePath)) {
    errors.push(`${label}: missing ${path.relative(ROOT, filePath)}`);
    return;
  }
  const actual = fs.readFileSync(filePath);
  if (!actual.equals(expected)) {
    errors.push(`${label}: ${path.relative(ROOT, filePath)} is not byte-reproducible`);
  }
}

function compareFrontmatter(
  sourcePath: string,
  entry: PostArtEntry,
  rendered: RenderedPost,
  manifest: PostArtManifest,
  errors: string[]
): void {
  const frontmatter = matter(fs.readFileSync(sourcePath, 'utf8')).data as Record<string, unknown>;
  const paths = expectedPaths(entry, manifest);
  const expectations: Record<string, string> = {
    hero: paths.heroPublic,
    heroBlur: rendered.heroBlur,
    thumbnail: paths.thumbnailPublic,
    thumbnailBlur: rendered.thumbnailBlur,
  };

  for (const [field, expected] of Object.entries(expectations)) {
    if (frontmatter[field] !== expected) {
      errors.push(`${entry.slug}: frontmatter ${field} does not match generated art`);
    }
  }
}

function checkUnexpectedOutputs(manifest: PostArtManifest, errors: string[]): void {
  if (!fs.existsSync(OUTPUT_ROOT)) return;
  const expected = new Set(
    manifest.posts.flatMap((entry) => {
      const paths = expectedPaths(entry, manifest);
      return [path.normalize(paths.hero), path.normalize(paths.thumbnail)];
    })
  );

  for (const directory of fs.readdirSync(OUTPUT_ROOT, { withFileTypes: true })) {
    if (!directory.isDirectory()) continue;
    const absoluteDirectory = path.join(OUTPUT_ROOT, directory.name);
    for (const file of fs.readdirSync(absoluteDirectory, { withFileTypes: true })) {
      if (!file.isFile() || !/\.(?:jpe?g|png|webp|avif)$/i.test(file.name)) continue;
      const absoluteFile = path.normalize(path.join(absoluteDirectory, file.name));
      if (!expected.has(absoluteFile)) {
        errors.push(`unexpected generated post-art file: ${path.relative(ROOT, absoluteFile)}`);
      }
    }
  }
}

function parseCli(): CliOptions {
  const args = process.argv.slice(2);
  let check = false;
  let slug: string | undefined;
  let all = false;

  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === '--check') {
      check = true;
    } else if (arg === '--all') {
      all = true;
    } else if (arg === '--slug') {
      slug = args[++index];
      if (!slug) fail('--slug requires a value');
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
Deterministic post-art generator

Usage:
  pnpm images:generate                 Generate every post image (default)
  pnpm images:generate -- --all        Generate every post image
  pnpm images:generate -- --slug SLUG  Generate one post's images
  pnpm images:check                    Re-render and byte-check all images and blur data
  pnpm images:check -- --slug SLUG     Check one post after validating global coverage
`);
      process.exit(0);
    } else {
      fail(`Unknown argument: ${arg}`);
    }
  }

  if (all && slug) fail('--all and --slug are mutually exclusive');
  return { check, slug };
}

async function main(): Promise<void> {
  const options = parseCli();
  const manifest = loadManifest();
  verifyRendererVersions(manifest);
  const content = verifyContentCoverage(manifest);
  const palette = getPalette(manifest);
  const entries = options.slug
    ? manifest.posts.filter((entry) => entry.slug === options.slug)
    : manifest.posts;

  if (entries.length === 0) fail(`No manifest entry for slug: ${options.slug}`);

  sharp.cache(false);
  sharp.concurrency(1);
  sharp.simd(false);

  if (!options.check) {
    let byteCount = 0;
    let frontmatterCount = 0;
    for (const entry of entries) {
      const rendered = await renderPost(entry, manifest, palette);
      writePost(entry, rendered, manifest);
      if (syncFrontmatter(content.get(entry.slug)!, entry, rendered, manifest)) {
        frontmatterCount++;
      }
      byteCount += rendered.hero.length + rendered.thumbnail.length;
      console.log(
        `generated ${entry.slug} (${entry.motif}/${entry.variant}, ${rendered.hero.length + rendered.thumbnail.length} bytes)`
      );
    }
    console.log(
      `Generated ${entries.length * 2} deterministic assets for ${entries.length} post${entries.length === 1 ? '' : 's'} (${byteCount} bytes).`
    );
    console.log(
      `Synchronized frontmatter for ${frontmatterCount} post${frontmatterCount === 1 ? '' : 's'}.`
    );
    console.log('Run `pnpm images:check` before committing the generated assets and blur data.');
    return;
  }

  const errors: string[] = [];
  for (const entry of entries) {
    const rendered = await renderPost(entry, manifest, palette);
    const paths = expectedPaths(entry, manifest);
    compareFile(paths.hero, rendered.hero, entry.slug, errors);
    compareFile(paths.thumbnail, rendered.thumbnail, entry.slug, errors);
    compareFrontmatter(content.get(entry.slug)!, entry, rendered, manifest, errors);
    console.log(`checked ${entry.slug} (${entry.motif}/${entry.variant})`);
  }
  if (!options.slug) checkUnexpectedOutputs(manifest, errors);

  if (errors.length > 0) {
    console.error(
      `Post-art check failed with ${errors.length} issue${errors.length === 1 ? '' : 's'}:`
    );
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }

  console.log(
    `Verified ${entries.length * 2} byte-reproducible assets and ${entries.length * 2} blur fields across ${entries.length} post${entries.length === 1 ? '' : 's'}.`
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
