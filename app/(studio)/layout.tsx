import type { ReactNode } from 'react';

// Root layout for the embedded Sanity Studio (/studio). Deliberately free of the
// site's /styles.css and /script.js. The studio page provides its own metadata.
export default function StudioRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
