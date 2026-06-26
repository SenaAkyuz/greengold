export const SITE_URL = 'https://www.foundationgreengold.org';
export const SITE_NAME = 'Green Gold Foundation';

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
