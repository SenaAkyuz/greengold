import type { ReactNode } from 'react';
import Script from 'next/script';

// TR blog: same global CSS + script, plus correct <html lang="tr"> (the single
// root layout defaults to "en"; this sets it before paint for the TR subtree).
export default function TrBlogLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="stylesheet" href="/styles.css" precedence="default" />
      <script
        dangerouslySetInnerHTML={{ __html: "document.documentElement.lang='tr'" }}
      />
      {children}
      <Script src="/script.js" strategy="afterInteractive" />
    </>
  );
}
