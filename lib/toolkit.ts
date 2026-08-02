import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import productsData from '@/content/toolkit/_data/products.json';
import sourcesData from '@/content/toolkit/_data/sources.json';
import coverageData from '@/content/toolkit/_data/coverage.json';

// Server-only loader. Client components must import types/constants from toolkit-types.
export * from './toolkit-types';

import type {
  AgentToolId,
  AgentToolMeta,
  CoverageStatus,
  EvidenceBasis,
  EvidenceKind,
  EvidenceSource,
  ToolkitCoverage,
  ToolkitFrontmatter,
  ToolkitPage,
  ToolSurface,
} from './toolkit-types';
import {
  TOOLKIT_LENSES,
  TOOLKIT_REVIEWED_AT,
  TOOLKIT_TOPICS,
  getToolkitTopicBySlug,
  isToolkitSubPage,
  resolveToolkitTopicSlug,
} from './toolkit-types';

const toolkitDirectory = path.join(process.cwd(), 'content/toolkit');
const TOOL_IDS: AgentToolId[] = ['claude-code', 'openai-codex', 'github-copilot'];
const SURFACES: ToolSurface[] = ['cli', 'ide', 'web', 'cloud'];
const COVERAGE_STATUSES: CoverageStatus[] = [
  'native',
  'partial',
  'external',
  'no-documented-equivalent',
  'unknown',
];
const EVIDENCE_KINDS: EvidenceKind[] = ['official-docs', 'release-note', 'official-repository'];
const EVIDENCE_BASES: EvidenceBasis[] = ['documented', 'observed'];

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`[toolkit] ${message}`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isIsoDate(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function parseProducts(value: unknown): AgentToolMeta[] {
  invariant(Array.isArray(value), 'products.json must contain an array');
  const seen = new Set<string>();

  const products = value.map((candidate, index) => {
    invariant(isRecord(candidate), `products.json item ${index} must be an object`);
    const { id, name, shortName, vendor, description, surfaces, officialUrl } = candidate;
    invariant(
      typeof id === 'string' && TOOL_IDS.includes(id as AgentToolId),
      `invalid product id at item ${index}`
    );
    invariant(!seen.has(id), `duplicate product id: ${id}`);
    seen.add(id);
    invariant(typeof name === 'string' && name.length > 0, `product ${id} requires a name`);
    invariant(
      typeof shortName === 'string' && shortName.length > 0,
      `product ${id} requires a shortName`
    );
    invariant(typeof vendor === 'string' && vendor.length > 0, `product ${id} requires a vendor`);
    invariant(
      typeof description === 'string' && description.length > 0,
      `product ${id} requires a description`
    );
    invariant(isStringArray(surfaces) && surfaces.length > 0, `product ${id} requires surfaces`);
    invariant(
      surfaces.every((surface) => SURFACES.includes(surface as ToolSurface)),
      `product ${id} has an invalid surface`
    );
    invariant(
      typeof officialUrl === 'string' && officialUrl.startsWith('https://'),
      `product ${id} requires an HTTPS officialUrl`
    );

    return {
      id: id as AgentToolId,
      name,
      shortName,
      vendor,
      description,
      surfaces: surfaces as ToolSurface[],
      officialUrl,
    };
  });

  invariant(
    products.length === TOOL_IDS.length,
    `products.json must define exactly ${TOOL_IDS.length} products`
  );
  invariant(
    TOOL_IDS.every((id) => seen.has(id)),
    'products.json is missing a required product'
  );
  return products;
}

function parseSources(value: unknown): EvidenceSource[] {
  invariant(Array.isArray(value), 'sources.json must contain an array');
  const seen = new Set<string>();

  return value.map((candidate, index) => {
    invariant(isRecord(candidate), `sources.json item ${index} must be an object`);
    const { id, title, publisher, kind, url, accessedAt, publishedAt } = candidate;
    invariant(typeof id === 'string' && id.length > 0, `source ${index} requires an id`);
    invariant(!seen.has(id), `duplicate source id: ${id}`);
    seen.add(id);
    invariant(typeof title === 'string' && title.length > 0, `source ${id} requires a title`);
    invariant(
      typeof publisher === 'string' && publisher.length > 0,
      `source ${id} requires a publisher`
    );
    invariant(
      typeof kind === 'string' && EVIDENCE_KINDS.includes(kind as EvidenceKind),
      `source ${id} has an invalid kind`
    );
    invariant(
      typeof url === 'string' && url.startsWith('https://'),
      `source ${id} requires an HTTPS URL`
    );
    invariant(isIsoDate(accessedAt), `source ${id} requires an ISO accessedAt date`);
    invariant(
      publishedAt === undefined || isIsoDate(publishedAt),
      `source ${id} has an invalid publishedAt date`
    );

    return {
      id,
      title,
      publisher,
      kind: kind as EvidenceKind,
      url,
      accessedAt,
      ...(publishedAt ? { publishedAt } : {}),
    };
  });
}

function parseCoverage(
  value: unknown,
  products: AgentToolMeta[],
  sources: EvidenceSource[]
): { reviewedAt: string; claims: ToolkitCoverage[] } {
  invariant(isRecord(value), 'coverage.json must contain an object');
  invariant(
    value.reviewedAt === TOOLKIT_REVIEWED_AT,
    `coverage review date must be ${TOOLKIT_REVIEWED_AT}`
  );
  invariant(Array.isArray(value.claims), 'coverage.json claims must be an array');

  const productIds = new Set(products.map((product) => product.id));
  const productById = new Map(products.map((product) => [product.id, product]));
  const sourceIds = new Set(sources.map((source) => source.id));
  const topicIds = new Set(TOOLKIT_TOPICS.map((topic) => topic.slug));
  const claimedSurfaces = new Set<string>();

  const claims = value.claims.map((candidate, index) => {
    invariant(isRecord(candidate), `coverage claim ${index} must be an object`);
    const { topic, tool, surfaces, status, summary, sourceIds: claimSourceIds, basis } = candidate;
    invariant(
      typeof topic === 'string' && topicIds.has(topic),
      `coverage claim ${index} has an invalid topic`
    );
    invariant(
      typeof tool === 'string' && productIds.has(tool as AgentToolId),
      `coverage claim ${index} has an invalid tool`
    );
    invariant(
      isStringArray(surfaces) && surfaces.length > 0,
      `coverage claim ${index} requires surfaces`
    );
    invariant(
      surfaces.every((surface) => SURFACES.includes(surface as ToolSurface)),
      `coverage claim ${index} has an invalid surface`
    );
    invariant(
      new Set(surfaces).size === surfaces.length,
      `coverage claim ${index} repeats a surface`
    );
    invariant(
      surfaces.every((surface) =>
        productById.get(tool as AgentToolId)?.surfaces.includes(surface as ToolSurface)
      ),
      `coverage claim ${index} references a surface not declared by ${String(tool)}`
    );
    invariant(
      typeof status === 'string' && COVERAGE_STATUSES.includes(status as CoverageStatus),
      `coverage claim ${index} has an invalid status`
    );
    invariant(
      typeof summary === 'string' && summary.length > 0,
      `coverage claim ${index} requires a summary`
    );
    invariant(
      isStringArray(claimSourceIds) && claimSourceIds.length > 0,
      `coverage claim ${index} requires sourceIds`
    );
    invariant(
      claimSourceIds.every((sourceId) => sourceIds.has(sourceId)),
      `coverage claim ${index} references an unknown source`
    );
    invariant(
      typeof basis === 'string' && EVIDENCE_BASES.includes(basis as EvidenceBasis),
      `coverage claim ${index} has an invalid basis`
    );

    for (const surface of surfaces) {
      const claimKey = `${topic}:${tool}:${surface}`;
      invariant(!claimedSurfaces.has(claimKey), `duplicate coverage for ${claimKey}`);
      claimedSurfaces.add(claimKey);
    }

    return {
      topic,
      tool: tool as AgentToolId,
      surfaces: surfaces as ToolSurface[],
      status: status as CoverageStatus,
      summary,
      sourceIds: claimSourceIds,
      basis: basis as EvidenceBasis,
    };
  });

  for (const topic of TOOLKIT_TOPICS) {
    for (const product of products) {
      invariant(
        claims.some((claim) => claim.topic === topic.slug && claim.tool === product.id),
        `coverage is missing ${topic.slug}:${product.id}`
      );
      for (const surface of product.surfaces) {
        invariant(
          claimedSurfaces.has(`${topic.slug}:${product.id}:${surface}`),
          `coverage is missing ${topic.slug}:${product.id}:${surface}`
        );
      }
    }
  }

  return { reviewedAt: value.reviewedAt, claims };
}

const TOOLKIT_PRODUCTS = parseProducts(productsData);
const TOOLKIT_SOURCES = parseSources(sourcesData);
const TOOLKIT_COVERAGE = parseCoverage(coverageData, TOOLKIT_PRODUCTS, TOOLKIT_SOURCES);

function parseFrontmatter(
  value: unknown,
  expectedTopic: string,
  expectedSubPage?: string
): ToolkitFrontmatter | null {
  invariant(isRecord(value), `${expectedTopic} frontmatter must be an object`);
  invariant(typeof value.published === 'boolean', `${expectedTopic} requires a published boolean`);
  if (!value.published) return null;

  const label = expectedSubPage ? `${expectedTopic}/${expectedSubPage}` : expectedTopic;
  invariant(typeof value.title === 'string' && value.title.length > 0, `${label} requires a title`);
  invariant(value.topic === expectedTopic, `${label} topic must be ${expectedTopic}`);
  invariant(
    typeof value.order === 'number' && Number.isInteger(value.order),
    `${label} requires an integer order`
  );
  invariant(
    typeof value.description === 'string' && value.description.length > 0,
    `${label} requires a description`
  );
  invariant(isIsoDate(value.reviewedAt), `${label} requires an ISO reviewedAt date`);
  invariant(
    value.reviewedAt === TOOLKIT_REVIEWED_AT,
    `${label} review date must be ${TOOLKIT_REVIEWED_AT}`
  );
  invariant(
    isStringArray(value.sourceIds) && value.sourceIds.length > 0,
    `${label} requires sourceIds`
  );
  invariant(
    value.sourceIds.every((sourceId) => TOOLKIT_SOURCES.some((source) => source.id === sourceId)),
    `${label} references an unknown source`
  );

  if (expectedSubPage) {
    invariant(isToolkitSubPage(expectedSubPage), `${label} has an invalid sub-page route`);
    invariant(value.subPage === expectedSubPage, `${label} subPage must be ${expectedSubPage}`);
    invariant(
      value.implementationFocus === undefined,
      `${label} must remain capability-first; put product-specific scope in evidence claims`
    );
  } else {
    invariant(value.subPage === undefined, `${label} index frontmatter must not define subPage`);
  }

  invariant(
    value.relatedPatterns === undefined || isStringArray(value.relatedPatterns),
    `${label} relatedPatterns must be strings`
  );
  invariant(
    value.relatedTopics === undefined || isStringArray(value.relatedTopics),
    `${label} relatedTopics must be strings`
  );
  invariant(
    value.keywords === undefined || isStringArray(value.keywords),
    `${label} keywords must be strings`
  );
  invariant(
    value.implementationFocus === undefined,
    `${label} must remain capability-first; put product-specific scope in evidence claims`
  );
  return value as unknown as ToolkitFrontmatter;
}

export function getToolkitProducts(): AgentToolMeta[] {
  return [...TOOLKIT_PRODUCTS];
}

export function getToolkitProductSlugs(): AgentToolId[] {
  return TOOLKIT_PRODUCTS.map((product) => product.id);
}

export function getToolkitProductBySlug(slug: string): AgentToolMeta | undefined {
  return TOOLKIT_PRODUCTS.find((product) => product.id === slug);
}

export function getToolkitSources(): EvidenceSource[] {
  return [...TOOLKIT_SOURCES];
}

export function getToolkitSourcesByIds(ids: string[]): EvidenceSource[] {
  const requested = new Set(ids);
  return TOOLKIT_SOURCES.filter((source) => requested.has(source.id));
}

export function getToolkitCoverageForTopic(topic: string): ToolkitCoverage[] {
  const canonicalTopic = resolveToolkitTopicSlug(topic);
  return TOOLKIT_COVERAGE.claims.filter((claim) => claim.topic === canonicalTopic);
}

export function getToolkitCoverageForProduct(product: AgentToolId): ToolkitCoverage[] {
  return TOOLKIT_COVERAGE.claims.filter((claim) => claim.tool === product);
}

export function getToolkitCoverageSources(claims: ToolkitCoverage[]): EvidenceSource[] {
  return getToolkitSourcesByIds(claims.flatMap((claim) => claim.sourceIds));
}

export function getToolkitPage(topic: string, subPage?: string): ToolkitPage | null {
  const canonicalTopic = resolveToolkitTopicSlug(topic);
  if (!getToolkitTopicBySlug(canonicalTopic)) return null;
  if (subPage !== undefined && !isToolkitSubPage(subPage)) return null;

  const fileName = subPage ? `${subPage}.mdx` : 'index.mdx';
  const fullPath = path.join(toolkitDirectory, canonicalTopic, fileName);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const frontmatter = parseFrontmatter(data, canonicalTopic, subPage);
  if (!frontmatter) return null;

  return { frontmatter, content, readingTime: readingTime(content).text };
}

export function getToolkitTopicPages(topic: string): ToolkitPage[] {
  const canonicalTopic = resolveToolkitTopicSlug(topic);
  if (!getToolkitTopicBySlug(canonicalTopic)) return [];

  return TOOLKIT_LENSES.map((lens) => getToolkitPage(canonicalTopic, lens.slug))
    .filter((page): page is ToolkitPage => page !== null)
    .sort((a, b) => a.frontmatter.order - b.frontmatter.order);
}

export function getAllToolkitPages(): ToolkitPage[] {
  return TOOLKIT_TOPICS.flatMap((topic) => {
    const index = getToolkitPage(topic.slug);
    const subPages = getToolkitTopicPages(topic.slug);
    return [index, ...subPages].filter((page): page is ToolkitPage => page !== null);
  });
}

export interface ToolkitValidationSummary {
  reviewedAt: string;
  products: number;
  topics: number;
  pages: number;
  coverageClaims: number;
  classifiedSurfaceCells: number;
  officialSources: number;
  evidenceBasis: Record<EvidenceBasis, number>;
}

/**
 * Fail-closed validation entry point for scripts and CI. Importing this module
 * validates registry shapes and references; this function also forces every
 * published MDX page through the frontmatter loader and asserts the 9 × 5
 * public content contract.
 */
export function validateToolkitCatalog(): ToolkitValidationSummary {
  const canonicalTopics = new Set(TOOLKIT_TOPICS.map((topic) => topic.slug));
  let pages = 0;

  for (const topic of TOOLKIT_TOPICS) {
    const overview = getToolkitPage(topic.slug);
    invariant(overview !== null, `${topic.slug} is missing its published overview`);
    pages += 1;

    for (const relatedTopic of overview.frontmatter.relatedTopics ?? []) {
      invariant(
        canonicalTopics.has(relatedTopic),
        `${topic.slug} references unknown topic ${relatedTopic}`
      );
    }

    for (const lens of TOOLKIT_LENSES) {
      const page = getToolkitPage(topic.slug, lens.slug);
      invariant(page !== null, `${topic.slug}/${lens.slug} is missing or unpublished`);
      for (const relatedTopic of page.frontmatter.relatedTopics ?? []) {
        invariant(
          canonicalTopics.has(relatedTopic),
          `${topic.slug}/${lens.slug} references unknown topic ${relatedTopic}`
        );
      }
      pages += 1;
    }
  }

  const evidenceBasis: Record<EvidenceBasis, number> = { documented: 0, observed: 0 };
  for (const claim of TOOLKIT_COVERAGE.claims) evidenceBasis[claim.basis] += 1;

  return {
    reviewedAt: TOOLKIT_COVERAGE.reviewedAt,
    products: TOOLKIT_PRODUCTS.length,
    topics: TOOLKIT_TOPICS.length,
    pages,
    coverageClaims: TOOLKIT_COVERAGE.claims.length,
    classifiedSurfaceCells: TOOLKIT_COVERAGE.claims.reduce(
      (count, claim) => count + claim.surfaces.length,
      0
    ),
    officialSources: TOOLKIT_SOURCES.length,
    evidenceBasis,
  };
}
