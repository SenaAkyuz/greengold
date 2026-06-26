import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';
import { SITE_NAME, SITE_ICONS } from '@/lib/site';

// Root layout for the TR blog routes (/tr/blog, /tr/blog/[slug]). Renders
// <html lang="tr"> directly on the server — no client-side lang patching, so no
// hydration mismatch. Same shared /styles.css + /script.js.
export const metadata: Metadata = {
  title: { default: SITE_NAME, template: '%s' },
  icons: SITE_ICONS,
};

export default function TrRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <link rel="stylesheet" href="/styles.css" precedence="default" />
        {children}
        <Script src="/script.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
