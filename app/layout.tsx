import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SITE_URL as siteUrl } from '@/lib/site';
import './globals.css';

const editorialSans = localFont({
  src: '../assets/fonts/SpaceGrotesk-Variable.woff2',
  weight: '300 700',
  style: 'normal',
  variable: '--font-editorial-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Dakota Smith — AI Systems Architect & Full-Stack Engineer',
    template: '%s | Dakota Smith',
  },
  description:
    'AI systems architect and full-stack engineer writing about accountable AI systems, innovation strategy, and governed delivery.',
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
    siteName: 'Dakota Smith',
    title: 'Dakota Smith — AI Systems Architect & Full-Stack Engineer',
    description: 'Accountable AI systems, innovation strategy, and governed delivery.',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Dakota Smith — AI Systems Architect & Full-Stack Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dakota Smith — AI Systems Architect & Full-Stack Engineer',
    description: 'Accountable AI systems, innovation strategy, and governed delivery.',
    images: ['/og-default.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [{ url: '/apple-touch-icon.png', type: 'image/png', sizes: '180x180' }],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={editorialSans.variable} suppressHydrationWarning>
      <head>
        {/* FOUC prevention: Apply theme class before CSS loads */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  try {
    var storedTheme = localStorage.getItem('theme-preference');
    var theme = storedTheme || 'light';
    var resolved = theme;

    if (!storedTheme) {
      localStorage.setItem('theme-preference', 'light');
    }

    if (theme === 'system') {
      var isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      resolved = isDark ? 'dark' : 'light';
    }

    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(resolved);
  } catch (e) {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add('light');
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
      <body className="min-h-screen bg-background font-sans text-text antialiased flex flex-col">
        {/* Skip to main content link for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:border focus:border-text focus:bg-background focus:px-4 focus:py-3 focus:font-semibold focus:text-text focus:shadow-lg"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <MotionProvider>
            <Header />
            <main id="main-content" className="flex-grow">
              {children}
            </main>
            <Footer />
            <ScrollToTop />
          </MotionProvider>
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_VERCEL_ENV && <Analytics />}
        {process.env.NEXT_PUBLIC_VERCEL_ENV && <SpeedInsights />}
      </body>
    </html>
  );
}
