import Image from 'next/image';
import type { Locale } from '@/lib/site';
import { SITE_URL, SITE_NAME, postPath } from '@/lib/site';
import { categoryLabel, formatDate, readTimeLabel } from '@/lib/format';
import { getStrings } from '@/components/chrome/strings';
import type { Card, Post } from '@/sanity/lib/data';
import PortableBody from './PortableBody';
import BlogCard from './BlogCard';

export default function PostArticle({
  locale,
  post,
  related,
}: {
  locale: Locale;
  post: Post;
  related: Card[];
}) {
  const s = getStrings(locale).blog;
  const canonical = post.canonical || `${SITE_URL}${postPath(locale, post.slug)}`;
  const heroUrl = post.heroImage?.url;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription || post.excerpt || '',
    image: heroUrl ? [heroUrl] : undefined,
    author: { '@type': 'Organization', name: post.author || SITE_NAME },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo_final_r1.avif` },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    inLanguage: locale,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
  };

  return (
    <main id="main" className="post-page">
      <article className="post-article">
        <nav className="post-back">
          <a href={s.indexPath}>{s.backToAll}</a>
        </nav>
        <span className="post-cat-tag" data-category={post.category}>
          {categoryLabel(locale, post.category)}
        </span>
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">
          <time dateTime={post.publishedAt?.slice(0, 10)}>
            {formatDate(locale, post.publishedAt)}
          </time>
          <span className="dot">·</span>
          <span>{readTimeLabel(locale, post.readingMinutes)}</span>
        </div>

        {heroUrl && (
          <figure className="post-hero">
            <Image
              src={heroUrl}
              alt={post.heroImage?.alt || post.title}
              width={post.heroImage?.width || 1600}
              height={post.heroImage?.height || 900}
              priority
              sizes="(max-width: 900px) 100vw, 860px"
            />
          </figure>
        )}

        <div className="post-body">
          <PortableBody value={post.body} />
        </div>

        {related.length > 0 && (
          <section className="related-posts" aria-label={s.relatedHead}>
            <div className="related-posts__head">
              <h2>{s.relatedHead}</h2>
              <a className="related-posts__all" href={s.indexPath}>
                {s.viewAll}
              </a>
            </div>
            <div className="blog-grid related-posts__grid">
              {related.map((card) => (
                <BlogCard key={card.id} locale={locale} post={card} withExcerpt={false} />
              ))}
            </div>
          </section>
        )}

        <div className="post-foot-cta">
          <a className="btn btn--primary" href={s.footCtaHref}>
            {s.footCta}
          </a>
        </div>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
