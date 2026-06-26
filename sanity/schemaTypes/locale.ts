import { defineType, defineField } from 'sanity';
import { trSlugify, isUniqueAcrossLocales } from '../lib/slug';

// ---------------------------------------------------------------------------
// Field-level i18n WITHOUT any plugin: every localized field is an object with
// an `en` and a `tr` sub-field. Read side (Faz 3) does coalesce(field.tr, field.en).
// EN and TR appear together per field so a translator sees both at once.
// ---------------------------------------------------------------------------

export const localeString = defineType({
  name: 'localeString',
  title: 'Localized string',
  type: 'object',
  fields: [
    defineField({ name: 'en', title: 'English', type: 'string' }),
    defineField({ name: 'tr', title: 'Türkçe', type: 'string' }),
  ],
  options: { columns: 2 },
});

export const localeText = defineType({
  name: 'localeText',
  title: 'Localized text',
  type: 'object',
  fields: [
    defineField({ name: 'en', title: 'English', type: 'text', rows: 3 }),
    defineField({ name: 'tr', title: 'Türkçe', type: 'text', rows: 3 }),
  ],
});

// Per-locale slug. Each locale auto-generates from its own title via the
// Turkish-aware slugifier; defaults match (legacy posts share the slug) but
// each can be edited independently.
export const localeSlug = defineType({
  name: 'localeSlug',
  title: 'Localized slug',
  type: 'object',
  fields: [
    defineField({
      name: 'en',
      title: 'English slug',
      type: 'slug',
      options: {
        source: (doc: any) => doc?.title?.en || '',
        slugify: trSlugify,
        isUnique: isUniqueAcrossLocales,
        maxLength: 96,
      },
    }),
    defineField({
      name: 'tr',
      title: 'Türkçe slug',
      type: 'slug',
      options: {
        source: (doc: any) => doc?.title?.tr || '',
        slugify: trSlugify,
        isUnique: isUniqueAcrossLocales,
        maxLength: 96,
      },
    }),
  ],
});

// Per-locale image (TR posts often use a different hero/OG image). Each side
// carries its own alt text.
export const localeImage = defineType({
  name: 'localeImage',
  title: 'Localized image',
  type: 'object',
  fields: [
    defineField({
      name: 'en',
      title: 'English image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
    defineField({
      name: 'tr',
      title: 'Türkçe image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
  ],
});

export const localeBlockContent = defineType({
  name: 'localeBlockContent',
  title: 'Localized body',
  type: 'object',
  fields: [
    defineField({ name: 'en', title: 'English', type: 'blockContent' }),
    defineField({ name: 'tr', title: 'Türkçe', type: 'blockContent' }),
  ],
});
