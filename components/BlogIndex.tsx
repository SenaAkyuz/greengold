'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/site';
import { categoryLabel } from '@/lib/format';
import { getStrings } from '@/components/chrome/strings';
import type { Card } from '@/sanity/lib/data';
import BlogCard from './BlogCard';

const CATEGORIES = ['climate', 'forestry', 'carbon-credits', 'community'];

export default function BlogIndex({
  locale,
  posts,
}: {
  locale: Locale;
  posts: Card[];
}) {
  const s = getStrings(locale).blog;
  const [filter, setFilter] = useState<string>('all');

  const visible = posts.filter((p) => filter === 'all' || p.category === filter);

  return (
    <main id="main" className="blog-index">
      <div className="blog-index-inner">
        <header className="blog-index-head">
          <h1>{s.headTitle}</h1>
          <p>{s.tagline}</p>
        </header>

        <div className="blog-filter" role="tablist" aria-label={s.filterAria}>
          <button
            className={`filter-chip${filter === 'all' ? ' is-active' : ''}`}
            data-filter="all"
            onClick={() => setFilter('all')}
          >
            {s.filterAll}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-chip${filter === cat ? ' is-active' : ''}`}
              data-filter={cat}
              onClick={() => setFilter(cat)}
            >
              {categoryLabel(locale, cat)}
            </button>
          ))}
        </div>

        <div className="blog-grid" id="blogGrid">
          {visible.map((post) => (
            <BlogCard key={post.id} locale={locale} post={post} />
          ))}
        </div>
        <p
          className="blog-empty"
          id="blogEmpty"
          style={{ display: visible.length === 0 ? 'block' : 'none' }}
        >
          {s.empty}
        </p>
      </div>
    </main>
  );
}
