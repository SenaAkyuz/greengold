export const SITE_URL = 'https://www.foundationgreengold.org';
export const SITE_NAME = 'Green Gold Foundation';

// Shared favicon set for the per-locale root layouts.
export const SITE_ICONS = {
  icon: [
    { url: '/favicon.ico', sizes: 'any' },
    { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
    { url: '/favicon-16.png', type: 'image/png', sizes: '16x16' },
  ],
  apple: '/apple-touch-icon.png',
};

// The 16 preserved static sub-pages (home '' is handled separately). Each is
// served for both locales: /<slug> (EN) and /tr/<slug> (TR).
export const STATIC_PAGES = [
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

export type Locale = 'en' | 'tr';

export function otherLocale(loc: Locale): Locale {
  return loc === 'en' ? 'tr' : 'en';
}

// URL prefix for a locale ('' for EN, '/tr' for TR).
export function localePrefix(loc: Locale): string {
  return loc === 'en' ? '' : '/tr';
}

export function blogIndexPath(loc: Locale): string {
  return `${localePrefix(loc)}/blog`;
}

export function postPath(loc: Locale, slug: string): string {
  return `${localePrefix(loc)}/blog/${slug}`;
}
