# Dakota Smith Personal Blog

> High-performance Next.js blog with neo-brutalist design, built for speed and accessibility.

[![Performance](https://img.shields.io/badge/Lighthouse-100-brightgreen)](https://github.com/smithdak/dak-dev)
[![Accessibility](https://img.shields.io/badge/Accessibility-95-green)](https://github.com/smithdak/dak-dev)
[![SEO](https://img.shields.io/badge/SEO-100-brightgreen)](https://github.com/smithdak/dak-dev)

## Features

- Lightning Fast - Lighthouse Performance score of 100, Core Web Vitals optimized
- Accessible - WCAG 2.1 AA compliant with 95+ Lighthouse accessibility score
- SEO Optimized - Perfect 100 SEO score with structured data and OpenGraph images
- Neo-Brutalist Design - Bold, high-contrast dark theme with Space Grotesk typography
- MDX Content - Write posts in MDX with full React component support
- Advanced Code Highlighting - Shiki-powered syntax highlighting with line numbers and diffs
- GitHub Comments - Giscus integration for community discussions
- Privacy-First Analytics - Vercel Analytics with no cookies required

## Tech Stack

- Framework: Next.js 16+ (App Router, React 19, Server Components)
- Styling: Tailwind CSS v4
- Content: MDX with gray-matter frontmatter
- Syntax Highlighting: Shiki with custom neo-brutalist theme
- Comments: Giscus (GitHub Discussions)
- Analytics: Vercel Analytics
- Deployment: Vercel Edge Network

## Getting Started

### Installation

1. Clone and install:
```bash
git clone https://github.com/smithdak/dak-dev.git
cd dak-dev
npm install
```

2. Configure environment:
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

3. Run development server:
```bash
npm run dev
```

4. Open http://localhost:3000

## Scripts

- npm run dev - Development server with Turbopack
- npm run build - Production build
- npm run start - Production server
- npm run lint - ESLint
- npm run format - Prettier formatting
- npm run analyze - Bundle size analysis

## Writing Blog Posts

Create a new MDX file in content/posts/ with frontmatter:

```mdx
---
title: "Post Title"
date: "2026-01-25"
excerpt: "Brief description (150-160 chars)"
slug: "post-slug"
tags: ["tag1", "tag2"]
thumbnail: "/images/posts/slug/thumbnail.jpg"
hero: "/images/posts/slug/hero.jpg"
published: true
---

Your content here...
```

Add images to public/images/posts/slug/:
- thumbnail.jpg (800x450px)
- hero.jpg (1600x900px)

## Deployment

### Vercel Deployment

1. Push to GitHub:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. Import on Vercel.com and configure environment variables
3. Deploy - automatic on every push to main

### Deployment Checklist

- Environment variables configured
- Site URL updated in config
- Giscus configured
- All posts have published: true
- Lighthouse scores validated (98+ performance)

## Performance

### Lighthouse Scores
- Performance: 100
- Accessibility: 95
- Best Practices: 96
- SEO: 100

### Core Web Vitals
- LCP: 1.4s (target <2.5s)
- TBT: 0ms (target <200ms)
- CLS: 0 (target <0.1)

### Bundle Sizes
- Total: ~320 KB gzipped
- CSS: 6.6 KB gzipped
- Optimized with code-splitting and lazy loading

## Design System

### Colors
- Background: #0A0A0A
- Surface: #333333
- Text: #F5F5F5
- Muted: #A9A9A9
- Accent: #00FF88

### Typography
- Font: Space Grotesk (400, 600, 700)
- High contrast ratios (18:1 for text, 8.4:1 for muted)

## Troubleshooting

### Build Issues
- Module not found errors: Move to server component or API route
- Invalid image src: Check paths in MDX frontmatter

### Performance Issues
- Low Lighthouse score: Run npm run analyze to check bundle sizes
- High CLS: Ensure all images have explicit dimensions or aspect ratios

### Deployment Issues
- 404 on blog posts: Check published: true in frontmatter
- OG images not working: Verify @vercel/og installed and /api/og accessible

## License

All rights reserved by Dakota Smith.

---

Built by Dakota Smith | GitHub: @smithdak
