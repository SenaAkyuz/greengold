import { apiVersion } from '../env';

// Turkish-aware slugifier. Used by both the EN and TR slug fields — EN titles
// have no Turkish characters so it is a no-op there, while TR titles are
// simplified (ç→c, ş→s, ğ→g, ı→i, İ→i, ö→o, ü→u …) before slugifying.
const TR_MAP: Record<string, string> = {
  ç: 'c', Ç: 'c',
  ğ: 'g', Ğ: 'g',
  ı: 'i', I: 'i', İ: 'i', i: 'i',
  ö: 'o', Ö: 'o',
  ş: 's', Ş: 's',
  ü: 'u', Ü: 'u',
};

export function trSlugify(input: string): string {
  return input
    .replace(/[çÇğĞıIİiöÖşŞüÜ]/g, (ch) => TR_MAP[ch] ?? ch)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
}

// A slug must be unique across BOTH locales and BOTH the draft and published
// copies of every other post — so /blog/<slug> and /tr/blog/<slug> never clash.
// `context` is Sanity's SlugValidationContext (typed loosely to avoid coupling).
export async function isUniqueAcrossLocales(
  slug: string,
  context: any,
): Promise<boolean> {
  const { document, getClient } = context;
  const client = getClient({ apiVersion });
  const id = (document?._id || '').replace(/^drafts\./, '');
  const params = { draft: `drafts.${id}`, published: id, slug };
  const query = `!defined(*[
    _type == "post" &&
    !(_id in [$draft, $published]) &&
    (slug.en.current == $slug || slug.tr.current == $slug)
  ][0]._id)`;
  return client.fetch(query, params);
}
