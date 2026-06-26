import type { ReactNode } from 'react';

// Minimal root layout. The 34 preserved static pages are served verbatim from
// /public and do NOT pass through this layout. It only wraps the dynamic blog
// routes added in Faz 3, which bring their own <head>/header/footer markup.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
