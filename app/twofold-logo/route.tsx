/**
 * Publisher logo image (600x60) for Organization structured data.
 *
 * Article-class JSON-LD references this as the publisher (Twofold) logo. The
 * 600x60 dimensions match Google's recommended Article publisher logo box
 * (max 600px wide, ~60px tall). Generated with next/og to stay in the same
 * idiom as app/icon.tsx and app/api/og/route.tsx — no binary asset to drift.
 */

import { ImageResponse } from 'next/og';

// SSG: the logo has no dynamic input, so prerender it at build time.
export const dynamic = 'force-static';

const WIDTH = 600;
const HEIGHT = 60;

const CACHE_HEADERS = {
  'Cache-Control': 'public, immutable, no-transform, max-age=31536000',
  'CDN-Cache-Control': 'public, max-age=31536000',
};

export function GET() {
  const response = new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          backgroundColor: '#0A0A0A',
          padding: '0 20px',
          fontFamily: 'monospace',
        }}
      >
        {/* Accent block */}
        <div
          style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#00FF88',
          }}
        />
        <div
          style={{
            fontSize: '34px',
            fontWeight: 700,
            color: '#F5F5F5',
            letterSpacing: '0.04em',
          }}
        >
          Twofold
        </div>
      </div>
    ),
    { width: WIDTH, height: HEIGHT }
  );

  Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}
