import type { MetadataRoute } from 'next';
import { SITE_URL, STATIC_PAGES, postPath } from '@/lib/site';
import { client } from '@/sanity/lib/client';
import { sitemapQuery } from '@/sanity/lib/queries';

export const revalidate = 60;

type Row = { slug: string; updatedAt?: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [en, tr] = await Promise.all([
    client.fetch<Row[]>(sitemapQuery('en'), {}, { next: { tags: ['post'] } }),
    client.fetch<Row[]>(sitemapQuery('tr'), {}, { next: { tags: ['post'] } }),
  ]);

  // 34 preserved static pages (home + 16 sub-pages, EN + TR).
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/` },
    ...STATIC_PAGES.map((s) => ({ url: `${SITE_URL}/${s}` })),
    { url: `${SITE_URL}/tr` },
    ...STATIC_PAGES.map((s) => ({ url: `${SITE_URL}/tr/${s}` })),
  ];

  const blogIndex: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/blog` },
    { url: `${SITE_URL}/tr/blog` },
  ];

  const posts: MetadataRoute.Sitemap = [
    ...en.map((p) => ({
      url: `${SITE_URL}${postPath('en', p.slug)}`,
      lastModified: p.updatedAt,
    })),
    ...tr.map((p) => ({
      url: `${SITE_URL}${postPath('tr', p.slug)}`,
      lastModified: p.updatedAt,
    })),
  ];

  return [...staticEntries, ...blogIndex, ...posts];
}
