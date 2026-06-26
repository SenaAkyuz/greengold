import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

// Sanity publish/unpublish webhook → on-demand revalidation. Configure the
// Sanity webhook (filter: _type == "post") to POST here with the same
// SANITY_REVALIDATE_SECRET. All blog reads are tagged 'post', so one
// revalidateTag refreshes /blog, /tr/blog, every post page and the sitemap.
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature } = await parseBody(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    );
    if (!isValidSignature) {
      return new NextResponse('Invalid signature', { status: 401 });
    }
    revalidateTag('post');
    return NextResponse.json({ revalidated: true });
  } catch (err) {
    return new NextResponse((err as Error).message, { status: 500 });
  }
}
