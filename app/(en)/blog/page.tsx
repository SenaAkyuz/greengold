import type { Metadata } from 'next';
import SiteFrame from '@/components/chrome/SiteFrame';
import BlogIndex from '@/components/BlogIndex';
import { getIndexPosts } from '@/sanity/lib/data';
import { indexMetadata } from '@/lib/seo';

export const revalidate = 60;
export const metadata: Metadata = indexMetadata('en');

export default async function BlogIndexPage() {
  const posts = await getIndexPosts('en');
  return (
    <SiteFrame locale="en" enHref="/blog" trHref="/tr/blog" active="blog">
      <BlogIndex locale="en" posts={posts} />
    </SiteFrame>
  );
}
