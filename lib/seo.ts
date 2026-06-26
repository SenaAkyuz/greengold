import type { Metadata } from 'next';
import type { Locale } from './site';
import { SITE_URL, SITE_NAME, postPath, blogIndexPath, otherLocale } from './site';
import type { Post } from '@/sanity/lib/data';

const INDEX_DESC: Record<Locale, string> = {
  en: 'Stories, insights, and updates from Green Gold Foundation on climate, forestry, carbon credits, and community.',
  tr: "Green Gold Foundation'dan iklim, ormancılık, karbon kredileri ve topluluk üzerine hikâyeler, içgörüler ve güncellemeler.",
};

const OG_LOCALE: Record<Locale, string> = { en: 'en_US', tr: 'tr_TR' };

export function indexMetadata(locale: Locale): Metadata {
  const title = 'Blog — Green Gold Foundation';
  const description = INDEX_DESC[locale];
  const url = `${SITE_URL}${blogIndexPath(locale)}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/blog`,
        tr: `${SITE_URL}/tr/blog`,
        'x-default': `${SITE_URL}/blog`,
      },
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title,
      description,
      url,
      locale: OG_LOCALE[locale],
      images: [`${SITE_URL}/og-image.png`],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/og-image.png`],
    },
  };
}

export function postMetadata(locale: Locale, post: Post): Metadata {
  const bareTitle = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt || '';
  const selfUrl = `${SITE_URL}${postPath(locale, post.slug)}`;
  const canonical = post.canonical || selfUrl;
  const ogImage =
    post.ogImage?.url || post.heroImage?.url || `${SITE_URL}/og-image.png`;

  // hreflang per missing-language rule: only emit alternates that actually exist.
  const languages: Record<string, string> = { [locale]: selfUrl };
  let enUrl = locale === 'en' ? selfUrl : undefined;
  if (post.altExists && post.altSlug) {
    const o = otherLocale(locale);
    const oUrl = `${SITE_URL}${postPath(o, post.altSlug)}`;
    languages[o] = oUrl;
    if (o === 'en') enUrl = oUrl;
  }
  languages['x-default'] = enUrl || selfUrl;

  return {
    title: `${bareTitle} | ${SITE_NAME}`,
    description,
    alternates: { canonical, languages },
    robots: post.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: 'article',
      siteName: SITE_NAME,
      title: bareTitle,
      description,
      url: canonical,
      locale: OG_LOCALE[locale],
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: bareTitle,
      description,
      images: [ogImage],
    },
  };
}
