import type { Locale } from './site';

export const CATEGORY_LABELS: Record<Locale, Record<string, string>> = {
  en: {
    'carbon-credits': 'Carbon Credits',
    forestry: 'Forestry',
    climate: 'Climate',
    community: 'Community',
  },
  tr: {
    'carbon-credits': 'Karbon Kredileri',
    forestry: 'Ormancılık',
    climate: 'İklim',
    community: 'Topluluk',
  },
};

export function categoryLabel(loc: Locale, value?: string): string {
  if (!value) return '';
  return CATEGORY_LABELS[loc][value] ?? value;
}

export function formatDate(loc: Locale, iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (loc === 'tr') {
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
  }
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

export function readTimeLabel(loc: Locale, minutes?: number): string {
  const n = Math.max(1, Math.round(minutes || 1));
  return loc === 'tr' ? `${n} dakikada okunur` : `${n} min read`;
}
