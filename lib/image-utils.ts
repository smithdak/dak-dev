import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Image specifications from brand guidelines
export const IMAGE_SPECS = {
  thumbnail: { width: 960, height: 640, maxSizeKB: 500 },
  hero: { width: 1600, height: 900, maxSizeKB: 1000 },
} as const;

export type ImageType = keyof typeof IMAGE_SPECS;

export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  sizeKB: number;
  aspectRatio: string;
}

export interface ImageSpec {
  width: number;
  height: number;
  maxSizeKB: number;
}

export interface ValidationIssue {
  type: 'error' | 'warning';
  category: 'images';
  field: string;
  message: string;
  suggestion?: string;
}

export interface ProcessedImage {
  type: ImageType;
  path: string;
  blurDataURL: string;
  metadata: ImageMetadata;
}

/**
 * Fetch image from URL or read from local path
 */
export async function loadImage(source: string): Promise<Buffer> {
  // Check if it's a URL
  if (source.startsWith('http://') || source.startsWith('https://')) {
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  // Local file
  const absolutePath = path.isAbsolute(source) ? source : path.join(process.cwd(), source);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Image file not found: ${absolutePath}`);
  }
  return fs.readFileSync(absolutePath);
}

/**
 * Resize and optimize image for web
 */
export async function processImage(
  buffer: Buffer,
  width: number,
  height: number,
  quality: number = 85
): Promise<Buffer> {
  return sharp(buffer)
    .resize(width, height, {
      fit: 'cover',
      position: 'center',
    })
    .jpeg({
      quality,
      mozjpeg: true,
    })
    .toBuffer();
}

/**
 * Generate base64 blur placeholder (tiny, heavily blurred)
 */
export async function generateBlurPlaceholder(buffer: Buffer): Promise<string> {
  // Create a tiny 10px wide version with heavy blur
  const blurBuffer = await sharp(buffer)
    .resize(10, 10, {
      fit: 'cover',
    })
    .blur(1)
    .jpeg({
      quality: 50,
    })
    .toBuffer();

  const base64 = blurBuffer.toString('base64');
  return `data:image/jpeg;base64,${base64}`;
}

/**
 * Get image metadata (dimensions, format, size)
 */
export async function getImageMetadata(imagePath: string): Promise<ImageMetadata> {
  const absolutePath = path.isAbsolute(imagePath) ? imagePath : path.join(process.cwd(), imagePath);
  const stats = fs.statSync(absolutePath);
  const sizeKB = Math.round(stats.size / 1024);

  const metadata = await sharp(absolutePath).metadata();

  const width = metadata.width || 0;
  const height = metadata.height || 0;
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  const aspectRatio = `${width / divisor}:${height / divisor}`;

  return {
    width,
    height,
    format: metadata.format || 'unknown',
    sizeKB,
    aspectRatio,
  };
}

/**
 * Validate image meets specification
 */
export async function validateImageSpec(
  imagePath: string,
  spec: ImageSpec
): Promise<ValidationIssue[]> {
  const issues: ValidationIssue[] = [];

  try {
    const metadata = await getImageMetadata(imagePath);

    // Check dimensions
    if (metadata.width !== spec.width || metadata.height !== spec.height) {
      issues.push({
        type: 'error',
        category: 'images',
        field: path.basename(imagePath),
        message: `Incorrect dimensions: ${metadata.width}x${metadata.height} (expected ${spec.width}x${spec.height})`,
        suggestion: `Run pnpm images:generate to restore ${spec.width}x${spec.height}`,
      });
    }

    // Check file size
    if (metadata.sizeKB > spec.maxSizeKB) {
      issues.push({
        type: 'warning',
        category: 'images',
        field: path.basename(imagePath),
        message: `Large file size: ${metadata.sizeKB}KB (recommended max: ${spec.maxSizeKB}KB)`,
        suggestion: 'Consider optimizing the image to reduce file size',
      });
    }

    // Check format (should be JPEG)
    if (metadata.format !== 'jpeg' && metadata.format !== 'jpg') {
      issues.push({
        type: 'warning',
        category: 'images',
        field: path.basename(imagePath),
        message: `Non-JPEG format: ${metadata.format} (JPEG recommended for consistency)`,
        suggestion: 'Run pnpm images:generate to restore the canonical JPEG',
      });
    }
  } catch (error) {
    issues.push({
      type: 'error',
      category: 'images',
      field: path.basename(imagePath),
      message: `Failed to validate image: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }

  return issues;
}

/**
 * Process a source image into both thumbnail and hero versions
 */
export async function processPostImages(
  slug: string,
  sourceBuffer: Buffer
): Promise<{ thumbnail: ProcessedImage; hero: ProcessedImage }> {
  const outputDir = path.join(process.cwd(), 'public', 'images', 'posts', slug);

  // Ensure directory exists
  fs.mkdirSync(outputDir, { recursive: true });

  // Process thumbnail
  const thumbnailSpec = IMAGE_SPECS.thumbnail;
  const thumbnailBuffer = await processImage(
    sourceBuffer,
    thumbnailSpec.width,
    thumbnailSpec.height
  );
  const thumbnailPath = path.join(outputDir, 'thumbnail.jpg');
  fs.writeFileSync(thumbnailPath, thumbnailBuffer);
  const thumbnailBlur = await generateBlurPlaceholder(thumbnailBuffer);
  const thumbnailMetadata = await getImageMetadata(thumbnailPath);

  // Process hero
  const heroSpec = IMAGE_SPECS.hero;
  const heroBuffer = await processImage(sourceBuffer, heroSpec.width, heroSpec.height);
  const heroPath = path.join(outputDir, 'hero.jpg');
  fs.writeFileSync(heroPath, heroBuffer);
  const heroBlur = await generateBlurPlaceholder(heroBuffer);
  const heroMetadata = await getImageMetadata(heroPath);

  return {
    thumbnail: {
      type: 'thumbnail',
      path: `/images/posts/${slug}/thumbnail.jpg`,
      blurDataURL: thumbnailBlur,
      metadata: thumbnailMetadata,
    },
    hero: {
      type: 'hero',
      path: `/images/posts/${slug}/hero.jpg`,
      blurDataURL: heroBlur,
      metadata: heroMetadata,
    },
  };
}

/**
 * Get the output directory for post images
 */
export function getPostImageDir(slug: string): string {
  return path.join(process.cwd(), 'public', 'images', 'posts', slug);
}

/**
 * Check if post images exist
 */
export function postImagesExist(slug: string): { thumbnail: boolean; hero: boolean } {
  const dir = getPostImageDir(slug);
  return {
    thumbnail: fs.existsSync(path.join(dir, 'thumbnail.jpg')),
    hero: fs.existsSync(path.join(dir, 'hero.jpg')),
  };
}

/** Escape special XML characters for safe SVG embedding */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate a restrained editorial overlay with a readability scrim, green rule,
 * title text, and author branding. Uses embedded Space Grotesk for deterministic
 * rendering via librsvg.
 */
export async function compositeThumbnail(
  imageBuffer: Buffer,
  width: number,
  height: number,
  text: string,
  options?: { accentColor?: string }
): Promise<Buffer> {
  const accentColor = options?.accentColor || '#006b4d';

  // Load and base64-encode the font for SVG embedding
  const fontPath = path.join(process.cwd(), 'assets', 'fonts', 'SpaceGrotesk-Bold.ttf');
  let fontBase64 = '';
  if (fs.existsSync(fontPath)) {
    fontBase64 = fs.readFileSync(fontPath).toString('base64');
  }

  // Scale text sizes proportionally
  const titleFontSize = Math.round(width * 0.05); // ~40px at 800w, ~80px at 1600w
  const brandFontSize = Math.round(width * 0.02); // ~16px at 800w, ~32px at 1600w
  const accentHeight = Math.round(height * 0.009); // ~4px at 450h, ~8px at 900h
  const padding = Math.round(width * 0.05); // ~40px at 800w, ~80px at 1600w
  const scrimHeight = Math.round(height * 0.4); // 40% of image height

  // Position calculations (from bottom)
  const brandY = height - padding;
  const titleY = brandY - Math.round(brandFontSize * 1.8);
  const accentY = titleY - Math.round(titleFontSize * 1.3);

  const fontFace = fontBase64
    ? `@font-face {
        font-family: 'Space Grotesk';
        src: url(data:font/ttf;base64,${fontBase64}) format('truetype');
        font-weight: 700;
      }`
    : '';

  const fontFamily = fontBase64
    ? "'Space Grotesk', sans-serif"
    : 'system-ui, -apple-system, sans-serif';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <style>${fontFace}</style>
      <linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(0,0,0,0)" />
        <stop offset="40%" stop-color="rgba(0,0,0,0.4)" />
        <stop offset="100%" stop-color="rgba(0,0,0,0.85)" />
      </linearGradient>
    </defs>

    <!-- Gradient scrim over bottom portion -->
    <rect x="0" y="${height - scrimHeight}" width="${width}" height="${scrimHeight}" fill="url(#scrim)" />

    <!-- Accent line -->
    <rect x="${padding}" y="${accentY}" width="${width - padding * 2}" height="${accentHeight}" fill="${accentColor}" />

    <!-- Title text -->
    <text x="${padding}" y="${titleY}"
      font-family="${fontFamily}" font-size="${titleFontSize}" font-weight="700"
       fill="#F7F4EE" letter-spacing="-0.02em">
      ${escapeXml(text)}
    </text>

    <!-- Author branding -->
    <text x="${width - padding}" y="${brandY}"
      font-family="${fontFamily}" font-size="${brandFontSize}" font-weight="600"
       fill="#D4CEC2" text-anchor="end">
      Dakota Smith · Principal Architect · daksmith.dev
    </text>
  </svg>`;

  return sharp(imageBuffer)
    .composite([
      {
        input: Buffer.from(svg),
        top: 0,
        left: 0,
      },
    ])
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();
}

/**
 * Auto-shorten a post title to ~3-4 significant words for thumbnail text.
 * Strips common filler words and takes the first meaningful words.
 */
export function shortenTitle(title: string): string {
  const stopWords = new Set([
    'a',
    'an',
    'the',
    'and',
    'or',
    'but',
    'in',
    'on',
    'at',
    'to',
    'for',
    'of',
    'with',
    'by',
    'from',
    'is',
    'are',
    'was',
    'were',
    'be',
    'been',
    'being',
    'have',
    'has',
    'had',
    'do',
    'does',
    'did',
    'will',
    'would',
    'could',
    'should',
    'may',
    'might',
    'can',
    'shall',
    'my',
    'your',
    'our',
    'how',
    'why',
    'what',
    'when',
    'where',
    'i',
  ]);

  // Remove text after colon (subtitle) and split into words
  const mainTitle = title.split(':')[0].trim();
  const words = mainTitle.split(/\s+/);

  // Filter stop words but keep first word always
  const significant = words.filter((w, i) => i === 0 || !stopWords.has(w.toLowerCase()));

  // Take first 3-4 significant words
  const maxWords = significant.length <= 4 ? significant.length : 3;
  return significant.slice(0, maxWords).join(' ');
}
