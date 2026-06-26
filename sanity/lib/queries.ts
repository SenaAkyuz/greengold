import type { Locale } from '@/lib/site';
import { otherLocale } from '@/lib/site';

// `loc` is always our own 'en' | 'tr' literal (never user input), so direct
// interpolation into the GROQ projection is safe and lets us project a single
// locale flat (Sanity stores localized fields as {en, tr} objects).

const PUBLISHED = `_type == "post" && status == "published" && publishedAt <= now()`;

// A locale "exists" for a post when it has title + slug + at least one body block.
const localeExists = (loc: Locale) =>
  `defined(title.${loc}) && defined(slug.${loc}.current) && count(body.${loc}[]) > 0`;

// Shared card projection (index grid + related). Read time is computed in GROQ
// from the body length when not explicitly set, so no body text is transferred.
const cardProjection = (loc: Locale) => `{
  "id": _id,
  "title": title.${loc},
  "slug": slug.${loc}.current,
  "excerpt": excerpt.${loc},
  category,
  publishedAt,
  "readingMinutes": coalesce(readingMinutes.${loc}, math::max([1, round(length(pt::text(body.${loc})) / 1000)])),
  "image": heroImage.${loc}{
    "alt": alt,
    "url": asset->url,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
  }
}`;

export function indexQuery(loc: Locale) {
  return `*[${PUBLISHED} && ${localeExists(loc)}] | order(publishedAt desc) ${cardProjection(loc)}`;
}

export function slugsQuery(loc: Locale) {
  return `*[${PUBLISHED} && ${localeExists(loc)}].slug.${loc}.current`;
}

export function postQuery(loc: Locale) {
  const alt = otherLocale(loc);
  return `*[${PUBLISHED} && slug.${loc}.current == $slug][0]{
    "id": _id,
    "updatedAt": _updatedAt,
    "title": title.${loc},
    "slug": slug.${loc}.current,
    "excerpt": excerpt.${loc},
    "metaTitle": metaTitle.${loc},
    "metaDescription": metaDescription.${loc},
    "canonical": canonical.${loc},
    category,
    author,
    publishedAt,
    noIndex,
    "readingMinutes": coalesce(readingMinutes.${loc}, math::max([1, round(length(pt::text(body.${loc})) / 1000)])),
    "heroImage": heroImage.${loc}{
      "alt": alt,
      "url": asset->url,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    },
    "ogImage": ogImage.${loc}{ "url": asset->url },
    "body": body.${loc},
    "altExists": ${localeExists(alt)},
    "altSlug": slug.${alt}.current
  }`;
}

export function relatedQuery(loc: Locale) {
  return `*[${PUBLISHED} && ${localeExists(loc)} && category == $category && slug.${loc}.current != $slug]
    | order(publishedAt desc) [0...3] ${cardProjection(loc)}`;
}
