import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

// Content-Security-Policy.
// Next.js App Router injects inline bootstrap/hydration scripts. A strict
// nonce-based policy would require per-request middleware, which forces
// dynamic rendering and conflicts with this site's SSG performance budget.
// We therefore allow 'unsafe-inline' for scripts but lock down every other
// vector: no external script origins beyond the few we actually use,
// object-src none, base-uri self, and tightly scoped connect/frame/img.
const isDev = process.env.NODE_ENV !== 'production';

// RUNNABLE CODE EMBEDS (Codapi) — opt-in, OFF by default.
// The <RunnableSnippet> component only loads its scripts when
// NEXT_PUBLIC_ENABLE_CODAPI === 'true'. The CSP relaxation it needs is wired to
// the SAME flag below, so the two stay in lockstep: flag off → hardened policy
// + no feature; flag on → the relaxation + the feature. When enabled we add:
//   - script-src:  'wasm-unsafe-eval' (WASI sandboxes instantiate wasm) and
//                  https://unpkg.com (Codapi/Runno web-component scripts)
//   - connect-src: https://unpkg.com (Runno fetches language wasm binaries)
//   - worker-src already allows 'self' blob: (Runno uses workers) — no change.
// This is a real relaxation of the hardened policy; re-verify Lighthouse
// Best-Practices in CI before merging an activation. NOTE: the WASI engine
// (python/sqlite) needs only 'wasm-unsafe-eval'; the browser JS engine also
// needs 'unsafe-eval' in production (already present in dev for HMR).
const codapiEnabled = process.env.NEXT_PUBLIC_ENABLE_CODAPI === 'true';
const codapiScript = codapiEnabled ? " 'wasm-unsafe-eval' https://unpkg.com" : '';
const codapiConnect = codapiEnabled ? ' https://unpkg.com' : '';

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  `script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://giscus.app${codapiScript}${
    isDev ? " 'unsafe-eval'" : ''
  }`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://images.unsplash.com",
  "font-src 'self'",
  // NEWSLETTER_ORIGIN: when NEXT_PUBLIC_NEWSLETTER_ENDPOINT is set (see
  // components/ui/NewsletterSignup.tsx), add the provider origin here so the
  // subscribe POST is allowed, e.g. ... https://buttondown.com
  `connect-src 'self' https://va.vercel-scripts.com https://*.vercel-insights.com${codapiConnect}${
    isDev ? ' ws:' : ''
  }`,
  'frame-src https://giscus.app',
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  'upgrade-insecure-requests',
].join('; ');

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Disable X-Powered-By header
  poweredByHeader: false,

  // Enable View Transitions API for smooth page navigation
  experimental: {
    viewTransition: true,
    optimizePackageImports: ['framer-motion'],
  },

  // Image optimization configuration
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  // Compiler options for better performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Headers for security and caching
  async headers() {
    return [
      // Cache static assets aggressively
      {
        source: '/:all*(svg|jpg|png|webp|avif|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache Next.js static assets
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Security headers for all routes
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          // X-XSS-Protection intentionally omitted: the legacy auditor is
          // deprecated, disabled in modern browsers, and can itself introduce
          // cross-site information leaks. Content-Security-Policy replaces it.
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'X-Permitted-Cross-Domain-Policies',
            value: 'none',
          },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()',
          },
          {
            key: 'Content-Security-Policy',
            value: contentSecurityPolicy,
          },
        ],
      },
      // HTML pages - revalidate but cache
      {
        source: '/:path*.html',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },

  // Redirects for consolidated pages
  async redirects() {
    return [
      {
        source: '/tools',
        destination: '/about#tools',
        permanent: true,
      },
      {
        source: '/contact',
        destination: '/about#contact',
        permanent: true,
      },
      {
        source: '/patterns',
        destination: '/learn/patterns',
        permanent: true,
      },
      {
        source: '/patterns/:path*',
        destination: '/learn/patterns/:path*',
        permanent: true,
      },
    ];
  },
};

export default bundleAnalyzer(nextConfig);
