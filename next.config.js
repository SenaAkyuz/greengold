/** @type {import('next').NextConfig} */
const legacyRedirects = require('./redirects.json');

// 16 root static pages (index handled separately via "/"). TR mirrors the same slugs under /tr.
const PAGES = [
  'about-us',
  'carbon-credits',
  'carbon-footprint-calculator',
  'carbon-measurement',
  'climate-membership',
  'cookie-policy',
  'donate',
  'events',
  'green-gold-sea',
  'green-gold-stay',
  'green-gold-wheels',
  'green-gold-wings',
  'legal-notice',
  'mission',
  'privacy',
  'take-action',
  'terms',
];

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  // Faz 3 will use next/image + @sanity/image-url for blog images.
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },

  // Clean-URL serving for the 34 preserved static pages.
  // IMPORTANT: /blog and /tr/blog are intentionally NOT rewritten — the Next.js
  // dynamic blog routes (Faz 3) handle them.
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        { source: '/', destination: '/index.html' },
        { source: '/tr', destination: '/tr/index.html' },
        ...PAGES.map((p) => ({ source: `/${p}`, destination: `/${p}.html` })),
        ...PAGES.map((p) => ({ source: `/tr/${p}`, destination: `/tr/${p}.html` })),
      ],
      fallback: [],
    };
  },

  async redirects() {
    // Replicate the old vercel.json `cleanUrls` behaviour: .html -> clean (301).
    const cleanUrl = [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/tr/index.html', destination: '/tr', permanent: true },
      ...PAGES.map((p) => ({ source: `/${p}.html`, destination: `/${p}`, permanent: true })),
      ...PAGES.map((p) => ({ source: `/tr/${p}.html`, destination: `/tr/${p}`, permanent: true })),
    ];
    // Order matters: specific legacy rules already precede their catch-alls inside redirects.json.
    return [...cleanUrl, ...legacyRedirects];
  },
};

module.exports = nextConfig;
