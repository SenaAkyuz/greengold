import type { ReactNode } from 'react';
import Script from 'next/script';

// Injects the same global CSS + behaviour script the static pages use.
// (EN locale — root <html lang="en"> already applies.)
export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="stylesheet" href="/styles.css" precedence="default" />
      {children}
      <Script src="/script.js" strategy="afterInteractive" />
    </>
  );
}
