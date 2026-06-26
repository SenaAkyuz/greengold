import { NextResponse, type NextRequest } from 'next/server';
import { projectId, dataset, apiVersion } from '@/sanity/env';
import { previousSlugQuery } from '@/sanity/lib/queries';
import type { Locale } from '@/lib/site';

// Redirect old post slugs (recorded in a post's previousSlugs) to the current
// slug with a 301, per locale. A current or unknown slug returns null from the
// query and falls through untouched.
export const config = {
  matcher: ['/blog/:path*', '/tr/blog/:path*'],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isTR = pathname.startsWith('/tr/blog');
  const loc: Locale = isTR ? 'tr' : 'en';
  const prefix = isTR ? '/tr/blog' : '/blog';

  const slug = pathname.slice(prefix.length).replace(/^\/+|\/+$/g, '');
  if (!slug || slug.includes('/')) return NextResponse.next(); // index or non-post

  const query = previousSlugQuery(loc);
  const url =
    `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}` +
    `?query=${encodeURIComponent(query)}&%24slug=${encodeURIComponent(JSON.stringify(slug))}`;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (res.ok) {
      const { result } = await res.json();
      if (result && typeof result === 'string' && result !== slug) {
        return NextResponse.redirect(new URL(`${prefix}/${result}`, req.url), 301);
      }
    }
  } catch {
    // fail open — never block a blog request on the lookup
  }
  return NextResponse.next();
}
