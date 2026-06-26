import { defineType, defineField } from 'sanity';

const CATEGORIES = [
  { title: 'Carbon Credits', value: 'carbon-credits' },
  { title: 'Forestry', value: 'forestry' },
  { title: 'Climate', value: 'climate' },
  { title: 'Community', value: 'community' },
];

// "Complete in a locale" = has title + slug + at least one body block.
// A locale that is not complete is treated as ABSENT (site hides it; the
// language switcher falls back to the other locale or the /blog index).
function isLocaleComplete(doc: any, loc: 'en' | 'tr'): boolean {
  const title = doc?.title?.[loc];
  const slug = doc?.slug?.[loc]?.current;
  const body = doc?.body?.[loc];
  return Boolean(title && slug && Array.isArray(body) && body.length > 0);
}

export const post = defineType({
  name: 'post',
  title: 'Blog yazısı',
  type: 'document',
  groups: [
    { name: 'content', title: 'İçerik', default: true },
    { name: 'seo', title: 'SEO' },
    { name: 'settings', title: 'Yayın & Ayarlar' },
  ],
  // Missing-language rule: at least ONE locale must be fully complete.
  validation: (Rule) =>
    Rule.custom((doc: any) =>
      isLocaleComplete(doc, 'en') || isLocaleComplete(doc, 'tr')
        ? true
        : 'En az bir dilde (EN veya TR) başlık + slug + gövde dolu olmalı.',
    ),
  fields: [
    // ---------------- İÇERİK ----------------
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'object',
      group: 'content',
      options: { columns: 2 },
      fields: [
        defineField({
          name: 'en',
          title: 'English',
          type: 'string',
          validation: (Rule) => Rule.max(60).warning('SEO için ~60 karakteri aşma.'),
        }),
        defineField({
          name: 'tr',
          title: 'Türkçe',
          type: 'string',
          validation: (Rule) => Rule.max(60).warning('SEO için ~60 karakteri aşma.'),
        }),
      ],
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'localeSlug',
      group: 'content',
      description:
        'Başlıktan otomatik üretilir (TR sadeleştirme uygulanır). EN ve TR ayrı düzenlenebilir.',
    }),
    defineField({
      name: 'excerpt',
      title: 'Özet',
      type: 'localeText',
      group: 'content',
    }),
    defineField({
      name: 'heroImage',
      title: 'Kapak görseli',
      type: 'localeImage',
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Gövde',
      type: 'localeBlockContent',
      group: 'content',
    }),

    // ---------------- SEO ----------------
    defineField({
      name: 'metaTitle',
      title: 'Meta başlık (boşsa başlık kullanılır)',
      type: 'localeString',
      group: 'seo',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta açıklama',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({
          name: 'en',
          title: 'English',
          type: 'text',
          rows: 2,
          validation: (Rule) => Rule.max(160).warning('SEO için ~150–160 karakter ideal.'),
        }),
        defineField({
          name: 'tr',
          title: 'Türkçe',
          type: 'text',
          rows: 2,
          validation: (Rule) => Rule.max(160).warning('SEO için ~150–160 karakter ideal.'),
        }),
      ],
    }),
    defineField({
      name: 'ogImage',
      title: 'OG görseli (boşsa kapak görseli kullanılır)',
      type: 'localeImage',
      group: 'seo',
    }),
    defineField({
      name: 'canonical',
      title: 'Canonical URL (boşsa kendi URL’si)',
      type: 'localeString',
      group: 'seo',
    }),

    // ---------------- YAYIN & AYARLAR ----------------
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      group: 'settings',
      options: { list: CATEGORIES, layout: 'radio' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Yazar',
      type: 'string',
      group: 'settings',
      initialValue: 'Green Gold Foundation',
    }),
    defineField({
      name: 'readingMinutes',
      title: 'Okuma süresi (dakika)',
      type: 'object',
      group: 'settings',
      description: 'Boşsa gövdeden tahmin edilir (~200 kelime/dk).',
      options: { columns: 2 },
      fields: [
        defineField({ name: 'en', title: 'EN', type: 'number' }),
        defineField({ name: 'tr', title: 'TR', type: 'number' }),
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Yayın tarihi',
      type: 'datetime',
      group: 'settings',
      description: 'İleri bir tarih = planlı yayın (tarihi gelince görünür).',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Durum',
      type: 'string',
      group: 'settings',
      options: {
        list: [
          { title: 'Taslak', value: 'draft' },
          { title: 'Yayında', value: 'published' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'noIndex',
      title: 'Arama motorlarından gizle (noindex)',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
    }),
    defineField({
      name: 'previousSlugs',
      title: 'Eski slug’lar (301 için — otomatik yönetilir, Faz 4)',
      type: 'object',
      group: 'settings',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'en', title: 'EN', type: 'array', of: [{ type: 'string' }] }),
        defineField({ name: 'tr', title: 'TR', type: 'array', of: [{ type: 'string' }] }),
      ],
    }),
  ],

  preview: {
    select: {
      titleEn: 'title.en',
      titleTr: 'title.tr',
      status: 'status',
      category: 'category',
      media: 'heroImage.en',
    },
    prepare({ titleEn, titleTr, status, category, media }) {
      const statusLabel = status === 'published' ? '🟢' : '⚪️';
      return {
        title: titleEn || titleTr || '(başlıksız)',
        subtitle: `${statusLabel} ${status || 'draft'} · ${category || 'kategorisiz'}`,
        media,
      };
    },
  },

  orderings: [
    {
      title: 'Yayın tarihi (yeni → eski)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
});
