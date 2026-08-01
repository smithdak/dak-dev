import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Components Demo',
  description: 'Visual demonstration of all UI components in the Dakota Smith blog design system',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ComponentsDemoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
