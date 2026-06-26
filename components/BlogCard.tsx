import Image from 'next/image';
import type { Locale } from '@/lib/site';
import { postPath } from '@/lib/site';
import { categoryLabel, formatDate, readTimeLabel } from '@/lib/format';
import type { Card } from '@/sanity/lib/data';

// Matches the legacy .blog-card markup exactly. `withExcerpt` is false for the
// related-posts grid (which omits the excerpt, as the static pages do).
export default function BlogCard({
  locale,
  post,
  withExcerpt = true,
}: {
  locale: Locale;
  post: Card;
  withExcerpt?: boolean;
}) {
  const href = postPath(locale, post.slug);
  const hasMedia = Boolean(post.image?.url);
  return (
    <a
      className={`blog-card${hasMedia ? '' : ' blog-card--no-media'}`}
      href={href}
      data-category={post.category}
    >
      {hasMedia && post.image?.url && (
        <div className="blog-card-media">
          <Image
            src={post.image.url}
            alt={post.image.alt || post.title}
            width={post.image.width || 1200}
            height={post.image.height || 800}
            sizes="(max-width: 700px) 100vw, 380px"
          />
        </div>
      )}
      <div className="blog-card-body">
        <span className="blog-card-cat">{categoryLabel(locale, post.category)}</span>
        <h3 className="blog-card-title">{post.title}</h3>
        {withExcerpt && post.excerpt && (
          <p className="blog-card-excerpt">{post.excerpt}</p>
        )}
        <div className="blog-card-meta">
          {formatDate(locale, post.publishedAt)} · {readTimeLabel(locale, post.readingMinutes)}
        </div>
      </div>
    </a>
  );
}
