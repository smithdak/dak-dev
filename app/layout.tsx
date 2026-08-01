import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import { MotionConfig } from 'framer-motion';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SITE_URL as siteUrl } from '@/lib/site';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Dakota Smith — Principal Architect for Agentic Systems',
    template: '%s | Dakota Smith',
  },
  description:
    'Principal architect writing about agentic systems, harness engineering, governed delivery, and enterprise software architecture.',
  keywords: [
    'Dakota Smith',
    'agentic engineering',
    'harness engineering',
    'AI platform architecture',
    'governed delivery',
    'enterprise software architecture',
    'tech blog',
    'engineering blog',
  ],
  authors: [{ name: 'Dakota Smith', url: `${siteUrl}/about` }],
  creator: 'Dakota Smith',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Dakota Smith Blog',
    title: 'Dakota Smith — Principal Architect for Agentic Systems',
    description:
      'Agentic systems, harness engineering, governed delivery, and enterprise software architecture.',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Dakota Smith — Principal Architect for Agentic Systems',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dakota Smith — Principal Architect for Agentic Systems',
    description:
      'Agentic systems, harness engineering, governed delivery, and enterprise software architecture.',
    images: ['/og-default.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Icons generated via app/icon.tsx and app/apple-icon.tsx
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={spaceGrotesk.variable} suppressHydrationWarning>
      <head>
        {/* FOUC prevention: Apply theme class before CSS loads */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  try {
    var theme = localStorage.getItem('theme-preference') || 'dark';
    var resolved = theme;

    if (theme === 'system') {
      var isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      resolved = isDark ? 'dark' : 'light';
    }

    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(resolved);
  } catch (e) {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add('dark');
  }
})();
            `.trim(),
          }}
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Dakota Smith Blog RSS Feed"
          href="/feed.xml"
        />
      </head>
      <body className="antialiased font-sans min-h-screen flex flex-col">
        {/* Skip to main content link for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-accent focus:text-background focus:font-bold focus:border-4 focus:border-text"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <MotionConfig reducedMotion="user">
            <Header />
            <main id="main-content" className="flex-grow">
              {children}
            </main>
            <Footer />
            <ScrollToTop />
          </MotionConfig>
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_VERCEL_ENV && <Analytics />}
        {process.env.NEXT_PUBLIC_VERCEL_ENV && <SpeedInsights />}
      </body>
    </html>
  );
}
