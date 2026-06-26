import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';
import { SITE_NAME, SITE_ICONS } from '@/lib/site';

// Root layout for the EN blog routes (/blog, /blog/[slug]). Renders
// <html lang="en"> on the server and pulls in the shared /styles.css + /script.js.
export const metadata: Metadata = {
  title: { default: SITE_NAME, template: '%s' },
  icons: SITE_ICONS,
};

export default function EnRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <link rel="stylesheet" href="/styles.css" precedence="default" />
        {children}
        <Script src="/script.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
