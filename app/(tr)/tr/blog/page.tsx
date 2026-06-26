import type { Metadata } from 'next';
import SiteFrame from '@/components/chrome/SiteFrame';
import BlogIndex from '@/components/BlogIndex';
import { getIndexPosts } from '@/sanity/lib/data';
import { indexMetadata } from '@/lib/seo';

export const revalidate = 60;
export const metadata: Metadata = indexMetadata('tr');

export default async function TrBlogIndexPage() {
  const posts = await getIndexPosts('tr');
  return (
    <SiteFrame locale="tr" enHref="/blog" trHref="/tr/blog" active="blog">
      <BlogIndex locale="tr" posts={posts} />
    </SiteFrame>
  );
}
