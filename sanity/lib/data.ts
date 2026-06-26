import { cache } from 'react';
import type { Locale } from '@/lib/site';
import { client } from './client';
import { indexQuery, postQuery, relatedQuery, slugsQuery } from './queries';

export type CardImage = {
  url?: string;
  alt?: string;
  width?: number;
  height?: number;
};

export type Card = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category: string;
  publishedAt?: string;
  readingMinutes?: number;
  image?: CardImage | null;
};

export type Post = Card & {
  updatedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonical?: string;
  author?: string;
  noIndex?: boolean;
  heroImage?: CardImage | null;
  ogImage?: { url?: string } | null;
  body?: unknown[];
  altExists?: boolean;
  altSlug?: string;
};

// All reads are tagged 'post' so the Sanity webhook's revalidateTag('post')
// refreshes every blog page + the sitemap on publish. cache() also dedupes the
// fetch across generateMetadata + the page render (same request).
const POST_TAG = { next: { tags: ['post'] } };

export const getPost = cache(
  (loc: Locale, slug: string): Promise<Post | null> =>
    client.fetch(postQuery(loc), { slug }, POST_TAG),
);

export const getIndexPosts = cache(
  (loc: Locale): Promise<Card[]> => client.fetch(indexQuery(loc), {}, POST_TAG),
);

export const getRelated = cache(
  (loc: Locale, category: string, slug: string): Promise<Card[]> =>
    client.fetch(relatedQuery(loc), { category, slug }, POST_TAG),
);

export const getSlugs = cache(
  (loc: Locale): Promise<string[]> => client.fetch(slugsQuery(loc), {}, POST_TAG),
);
