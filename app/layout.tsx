import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SITE_NAME } from '@/lib/site';

// Single root layout (Next requires exactly one). Minimal on purpose: the
// dynamic blog routes inject /styles.css + /script.js via their own nested
// layouts, and Sanity Studio at /studio stays free of the site's CSS/JS.
export const metadata: Metadata = {
  title: { default: SITE_NAME, template: '%s' },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

// suppressHydrationWarning: the TR blog layout sets <html lang="tr"> client-side
// (via an inline script, before paint) while the server renders the default
// "en". That intentional attribute difference is exactly what
// suppressHydrationWarning is for — it scopes to <html>'s own attributes only,
// so real mismatches deeper in the tree are still reported.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
