// Faz 5 migration. DRY-RUN by default (parses _msrc, writes NOTHING to Sanity).
//   node scripts/migrate.mjs --dry     -> parse + manifest (ADIM B)
//   node scripts/migrate.mjs --write   -> real upload (ADIM C, only after approval)
import { readFileSync, readdirSync, existsSync, writeFileSync, createReadStream } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';
import { JSDOM } from 'jsdom';
import { Schema } from '@sanity/schema';
import { htmlToBlocks } from '@sanity/block-tools';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const MSRC = join(root, '_msrc');
const WRITE = process.argv.includes('--write');

// ---- block schema for html -> Portable Text ----
const schema = Schema.compile({
  name: 'default',
  types: [
    {
      name: 'blockContent',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Number', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              { name: 'link', type: 'object', fields: [{ name: 'href', type: 'url' }] },
            ],
          },
        },
        { type: 'image' },
      ],
    },
    { name: 'image', type: 'image', fields: [{ name: 'alt', type: 'string' }] },
  ],
});
const blockContentType = schema.get('blockContent');

const warnings = [];
const imageSrcs = new Set();

function imgBasename(src) {
  if (!src) return null;
  return basename(src.split('?')[0]);
}
function recordImage(src, where) {
  const b = imgBasename(src);
  if (!b) return null;
  imageSrcs.add(b);
  if (!existsSync(join(MSRC, 'blog/img', b))) {
    warnings.push(`MISSING IMAGE FILE: ${b} (referenced by ${where})`);
  }
  return b;
}

function htmlToPT(html) {
  const rules = [
    {
      deserialize(el, next, block) {
        if (el.nodeName && el.nodeName.toLowerCase() === 'img') {
          const src = el.getAttribute('src');
          const alt = el.getAttribute('alt') || '';
          recordImage(src, 'body');
          return block({ _type: 'image', _migrationSrc: imgBasename(src), alt });
        }
        return undefined;
      },
    },
  ];
  return htmlToBlocks(html, blockContentType, {
    parseHtml: (h) => new JSDOM(h).window.document,
    rules,
  });
}

function ptPreview(blocks, n = 300) {
  const text = (blocks || [])
    .filter((b) => b._type === 'block')
    .map((b) => (b.children || []).map((c) => c.text || '').join(''))
    .join(' ');
  return text.slice(0, n);
}

// ---- index excerpts (slug -> excerpt) ----
function loadExcerpts(indexPath, prefix) {
  const map = {};
  if (!existsSync(indexPath)) return map;
  const doc = new JSDOM(readFileSync(indexPath, 'utf8')).window.document;
  for (const card of doc.querySelectorAll('a.blog-card')) {
    const href = card.getAttribute('href') || '';
    const slug = href.replace(prefix, '').replace(/^\/+|\/+$/g, '');
    const ex = card.querySelector('.blog-card-excerpt');
    if (slug) map[slug] = ex ? ex.textContent.trim() : '';
  }
  return map;
}
const enExcerpts = loadExcerpts(join(MSRC, 'blog/index.html'), '/blog');
const trExcerpts = loadExcerpts(join(MSRC, 'tr/blog/index.html'), '/tr/blog');

// ---- parse one post file ----
function parsePost(file, dir, excerpts) {
  const slug = basename(file, '.html');
  const html = readFileSync(join(dir, file), 'utf8');
  const doc = new JSDOM(html).window.document;
  const q = (sel) => doc.querySelector(sel);
  const attr = (sel, a) => (q(sel) ? q(sel).getAttribute(a) : null);
  const text = (sel) => (q(sel) ? q(sel).textContent.trim() : null);

  const title = text('h1.post-title');
  const category = attr('.post-cat-tag', 'data-category');
  const dt = attr('.post-meta time', 'datetime');
  const metaText = text('.post-meta') || '';
  const rtMatch = metaText.match(/(\d+)\s*(?:min read|dakika)/i);
  const titleTag = (text('title') || '').replace(/\s*\|\s*Green Gold Foundation\s*$/, '').trim();
  const heroEl = q('.post-hero img');
  const heroSrc = heroEl ? heroEl.getAttribute('src') : null;
  const heroAlt = heroEl ? heroEl.getAttribute('alt') || '' : '';
  const bodyEl = q('.post-body');
  const body = bodyEl ? htmlToPT(bodyEl.innerHTML) : [];

  if (!title) warnings.push(`${file}: missing h1.post-title`);
  if (!category) warnings.push(`${file}: missing category`);
  if (!dt) warnings.push(`${file}: missing publishedAt <time datetime>`);
  if (!rtMatch) warnings.push(`${file}: unparsable reading time ("${metaText}")`);
  if (!heroSrc) warnings.push(`${file}: no .post-hero img`);
  if (!bodyEl || body.length === 0) warnings.push(`${file}: empty body`);

  if (heroSrc) recordImage(heroSrc, `${file} hero`);
  const og = attr('meta[property="og:image"]', 'content');
  if (og) recordImage(og, `${file} og`);

  return {
    slug,
    title,
    category,
    publishedAt: dt ? `${dt}T09:00:00.000Z` : null,
    readingMinutes: rtMatch ? parseInt(rtMatch[1], 10) : null,
    metaTitle: titleTag || null,
    metaDescription: attr('meta[name="description"]', 'content'),
    canonical: attr('link[rel="canonical"]', 'href'),
    ogImage: og ? imgBasename(og) : null,
    heroImage: heroSrc ? { src: imgBasename(heroSrc), alt: heroAlt } : null,
    excerpt: excerpts[slug] || attr('meta[name="description"]', 'content') || '',
    body,
  };
}

function listPosts(dir) {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.html') && f !== 'index.html')
    .sort();
}

const enFiles = listPosts(join(MSRC, 'blog'));
const trFiles = listPosts(join(MSRC, 'tr/blog'));
const en = {};
const tr = {};
for (const f of enFiles) en[basename(f, '.html')] = parsePost(f, join(MSRC, 'blog'), enExcerpts);
for (const f of trFiles) tr[basename(f, '.html')] = parsePost(f, join(MSRC, 'tr/blog'), trExcerpts);

// ---- merge by slug ----
const slugs = new Set([...Object.keys(en), ...Object.keys(tr)]);
const docs = [];
for (const slug of slugs) {
  const e = en[slug];
  const t = tr[slug];
  const enSlug = e ? slug : null;
  const trSlug = t ? slug : null;
  const id = `post-${enSlug || trSlug}`;
  docs.push({
    _id: id,
    category: (e || t).category,
    publishedAt: (e || t).publishedAt,
    author: 'Green Gold Foundation',
    en: e || null,
    tr: t || null,
    locales: [e ? 'en' : null, t ? 'tr' : null].filter(Boolean),
  });
}
docs.sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));

// ---- manifest ----
const pairs = docs.filter((d) => d.locales.length === 2).length;
const enOnly = docs.filter((d) => d.locales.length === 1 && d.locales[0] === 'en');
const trOnly = docs.filter((d) => d.locales.length === 1 && d.locales[0] === 'tr');

const lines = [];
lines.push(`# Faz 5 DRY-RUN manifest`);
lines.push('');
lines.push(`EN files: ${enFiles.length} | TR files: ${trFiles.length}`);
lines.push(`Total documents: ${docs.length} (expected 45)`);
lines.push(`  pairs (en+tr): ${pairs} | EN-only: ${enOnly.length} | TR-only: ${trOnly.length}`);
lines.push(`Unique images to upload: ${imageSrcs.size}`);
lines.push(`Parse warnings: ${warnings.length}`);
lines.push('');
lines.push(`## EN-only (${enOnly.length})`);
enOnly.forEach((d) => lines.push(`  - ${d._id} [${d.category}] ${d.publishedAt?.slice(0, 10)}`));
lines.push(`## TR-only (${trOnly.length})`);
trOnly.forEach((d) => lines.push(`  - ${d._id} [${d.category}] ${d.publishedAt?.slice(0, 10)}`));
lines.push('');
lines.push(`## Document table`);
lines.push(`id | locales | category | date | hero(en/tr) | og(en/tr)`);
for (const d of docs) {
  const hero = `${d.en?.heroImage ? 'Y' : '-'}/${d.tr?.heroImage ? 'Y' : '-'}`;
  const og = `${d.en?.ogImage ? 'Y' : '-'}/${d.tr?.ogImage ? 'Y' : '-'}`;
  lines.push(`${d._id} | ${d.locales.join('+')} | ${d.category} | ${d.publishedAt?.slice(0, 10)} | ${hero} | ${og}`);
}
lines.push('');
if (warnings.length) {
  lines.push(`## Warnings`);
  warnings.forEach((w) => lines.push(`  ! ${w}`));
  lines.push('');
}

// spot-check: 1 en-only, 1 tr-only, 1 pair
function spot(d, label) {
  lines.push(`## SPOT-CHECK (${label}): ${d._id}`);
  for (const loc of ['en', 'tr']) {
    const p = d[loc];
    if (!p) continue;
    lines.push(`  [${loc}] title: ${p.title}`);
    lines.push(`  [${loc}] slug: ${p.slug} | cat: ${p.category} | date: ${p.publishedAt} | read: ${p.readingMinutes}`);
    lines.push(`  [${loc}] metaTitle: ${p.metaTitle}`);
    lines.push(`  [${loc}] metaDescription: ${p.metaDescription}`);
    lines.push(`  [${loc}] canonical: ${p.canonical}`);
    lines.push(`  [${loc}] hero: ${p.heroImage ? p.heroImage.src + ' (alt: ' + p.heroImage.alt + ')' : 'NONE'} | og: ${p.ogImage}`);
    lines.push(`  [${loc}] excerpt: ${p.excerpt?.slice(0, 120)}`);
    lines.push(`  [${loc}] body blocks: ${p.body.length} | preview: ${ptPreview(p.body)}`);
  }
  lines.push('');
}
if (enOnly[0]) spot(enOnly[0], 'EN-only');
if (trOnly[0]) spot(trOnly[0], 'TR-only');
const aPair = docs.find((d) => d.locales.length === 2);
if (aPair) spot(aPair, 'pair');

const manifestText = lines.join('\n');
writeFileSync(join(MSRC, 'manifest.txt'), manifestText);
writeFileSync(join(MSRC, 'docs.json'), JSON.stringify(docs, null, 2));
console.log(manifestText);
console.log(`\n[dry-run] wrote _msrc/manifest.txt and _msrc/docs.json. No Sanity writes.`);

if (WRITE) {
  const { createClient } = await import('@sanity/client');
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

  // 1) upload each unique image once (Sanity also dedupes by content hash).
  //    The global og-image.png is NOT a blog asset → skipped (render falls back).
  const toUpload = new Set();
  const add = (b) => { if (b && b !== 'og-image.png') toUpload.add(b); };
  for (const d of docs) {
    for (const loc of ['en', 'tr']) {
      const p = d[loc];
      if (!p) continue;
      if (p.heroImage) add(p.heroImage.src);
      add(p.ogImage);
      for (const blk of p.body) if (blk._type === 'image') add(blk._migrationSrc);
    }
  }
  console.log(`\nUploading ${toUpload.size} images...`);
  const assetMap = {};
  let up = 0;
  for (const b of toUpload) {
    const path = join(MSRC, 'blog/img', b);
    if (!existsSync(path)) { console.log(`  SKIP missing ${b}`); continue; }
    const asset = await client.assets.upload('image', createReadStream(path), { filename: b });
    assetMap[b] = asset._id;
    if (++up % 10 === 0) console.log(`  ${up}/${toUpload.size}`);
  }
  console.log(`Uploaded ${up} images.`);

  // 2) assemble + createOrReplace 45 documents (idempotent).
  const imgRef = (b, alt) =>
    b && assetMap[b]
      ? { _type: 'image', asset: { _type: 'reference', _ref: assetMap[b] }, ...(alt !== undefined ? { alt } : {}) }
      : undefined;
  const loca = (e, t) => {
    const o = {};
    if (e !== undefined && e !== null) o.en = e;
    if (t !== undefined && t !== null) o.tr = t;
    return Object.keys(o).length ? o : undefined;
  };
  const finalizeBody = (blocks) =>
    blocks
      .map((blk) => {
        if (blk._type === 'image') {
          const ref = imgRef(blk._migrationSrc, blk.alt);
          return ref ? { ...ref, _key: blk._key } : null;
        }
        return blk;
      })
      .filter(Boolean);

  let created = 0;
  for (const d of docs) {
    const e = d.en;
    const t = d.tr;
    const doc = {
      _id: d._id,
      _type: 'post',
      category: d.category,
      author: d.author,
      publishedAt: d.publishedAt,
      status: 'published',
      noIndex: false,
    };
    doc.title = loca(e?.title, t?.title);
    doc.slug = loca(
      e ? { _type: 'slug', current: e.slug } : undefined,
      t ? { _type: 'slug', current: t.slug } : undefined,
    );
    doc.excerpt = loca(e?.excerpt, t?.excerpt);
    doc.metaDescription = loca(e?.metaDescription, t?.metaDescription);
    // metaTitle only when it differs from the title (else schema falls back to title).
    const mt = loca(
      e && e.metaTitle && e.metaTitle !== e.title ? e.metaTitle : undefined,
      t && t.metaTitle && t.metaTitle !== t.title ? t.metaTitle : undefined,
    );
    if (mt) doc.metaTitle = mt;
    const rm = loca(e?.readingMinutes, t?.readingMinutes);
    if (rm) doc.readingMinutes = rm;
    const hero = loca(
      e?.heroImage ? imgRef(e.heroImage.src, e.heroImage.alt) : undefined,
      t?.heroImage ? imgRef(t.heroImage.src, t.heroImage.alt) : undefined,
    );
    if (hero) doc.heroImage = hero;
    const og = loca(
      e?.ogImage && e.ogImage !== 'og-image.png' ? imgRef(e.ogImage) : undefined,
      t?.ogImage && t.ogImage !== 'og-image.png' ? imgRef(t.ogImage) : undefined,
    );
    if (og) doc.ogImage = og;
    doc.body = loca(e ? finalizeBody(e.body) : undefined, t ? finalizeBody(t.body) : undefined);

    await client.createOrReplace(doc);
    if (++created % 10 === 0) console.log(`  ${created}/${docs.length} docs`);
  }
  console.log(`Created/replaced ${created} documents.`);
}
