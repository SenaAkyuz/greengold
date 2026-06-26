// One-off Faz 3 verification seeder. Idempotent (fixed _ids, createOrReplace).
// Creates 2 published test posts so the blog routes can be verified before the
// real Faz 5 migration. Delete with: node scripts/seed.mjs --delete
import { createClient } from '@sanity/client';
import { readFileSync, createReadStream } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// minimal .env.local loader
const env = {};
for (const line of readFileSync(join(root, '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
  if (m) env[m[1]] = m[2];
}

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const IDS = ['test-post-bilingual', 'test-post-en-only'];

if (process.argv.includes('--delete')) {
  await client.delete({ query: `*[_id in $ids]`, params: { ids: IDS } });
  console.log('deleted test posts');
  process.exit(0);
}

const key = (p, i) => `${p}${i}`;
const span = (text, marks = [], i = 0) => ({ _type: 'span', _key: key('s', i), text, marks });
const block = (text, style = 'normal', i = 0) => ({
  _type: 'block', _key: key('b', i), style, markDefs: [], children: [span(text, [], i)],
});
const listItem = (text, i) => ({
  _type: 'block', _key: key('li', i), style: 'normal', listItem: 'bullet', level: 1,
  markDefs: [], children: [span(text, [], i)],
});

function body(lang) {
  const en = lang === 'en';
  return [
    block(en
      ? 'This is a temporary test post created to verify the Next.js + Sanity blog rendering before the real migration.'
      : 'Bu, gerçek taşımadan önce Next.js + Sanity blog render’ını doğrulamak için oluşturulmuş geçici bir test yazısıdır.', 'normal', 1),
    block(en ? 'A Heading Inside the Body' : 'Gövde İçinde Bir Başlık', 'h2', 2),
    block(en
      ? 'Paragraph with a link to the homepage and some bold emphasis follows below.'
      : 'Ana sayfaya bir bağlantı ve biraz kalın vurgu içeren paragraf aşağıda.', 'normal', 3),
    {
      _type: 'block', _key: 'bL', style: 'normal',
      markDefs: [{ _type: 'link', _key: 'lk', href: en ? '/carbon-credits' : '/tr/carbon-credits' }],
      children: [
        span(en ? 'Read about ' : 'Şunu okuyun: ', [], 41),
        { _type: 'span', _key: 'sL', text: en ? 'carbon credits' : 'karbon kredileri', marks: ['lk'] },
        span(en ? ' and ' : ' ve ', [], 42),
        { _type: 'span', _key: 'sB', text: en ? 'this is bold' : 'bu kalın', marks: ['strong'] },
        span('.', [], 43),
      ],
    },
    listItem(en ? 'First bullet point' : 'Birinci madde', 5),
    listItem(en ? 'Second bullet point' : 'İkinci madde', 6),
  ];
}

// upload one hero image (reuse an existing legacy blog image)
const asset = await client.assets.upload(
  'image',
  createReadStream(join(root, 'blog/img/5a5c9f_d4cea330502840d99b8eabad31ddecca.jpg')),
  { filename: 'test-hero.jpg' },
);
const heroRef = { _type: 'image', asset: { _type: 'reference', _ref: asset._id }, alt: 'Test hero image' };

const docs = [
  {
    _id: IDS[0],
    _type: 'post',
    title: { en: 'Test Bilingual Post', tr: 'Test İki Dilli Yazı' },
    slug: { en: { _type: 'slug', current: 'test-climate-post' }, tr: { _type: 'slug', current: 'test-iklim-yazisi' } },
    excerpt: { en: 'A short EN excerpt for the bilingual test post.', tr: 'İki dilli test yazısı için kısa bir TR özet.' },
    heroImage: { en: heroRef, tr: heroRef },
    body: { en: body('en'), tr: body('tr') },
    metaDescription: { en: 'EN meta description for the bilingual test post.', tr: 'İki dilli test yazısı için TR meta açıklama.' },
    category: 'climate',
    author: 'Green Gold Foundation',
    readingMinutes: { en: 4, tr: 4 },
    publishedAt: '2026-01-15T09:00:00.000Z',
    status: 'published',
    noIndex: false,
  },
  {
    _id: IDS[1],
    _type: 'post',
    title: { en: 'Test EN-Only Post' },
    slug: { en: { _type: 'slug', current: 'test-en-only-post' } },
    excerpt: { en: 'This post exists only in English to test the missing-language rule.' },
    heroImage: { en: heroRef },
    body: { en: body('en') },
    metaDescription: { en: 'EN-only test post meta description.' },
    category: 'forestry',
    author: 'Green Gold Foundation',
    readingMinutes: { en: 3 },
    publishedAt: '2026-02-01T09:00:00.000Z',
    status: 'published',
    noIndex: false,
  },
];

for (const doc of docs) {
  await client.createOrReplace(doc);
  console.log('upserted', doc._id);
}
console.log('done');
