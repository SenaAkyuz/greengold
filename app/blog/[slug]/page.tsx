import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteFrame from '@/components/chrome/SiteFrame';
import PostArticle from '@/components/PostArticle';
import { getPost, getRelated, getSlugs } from '@/sanity/lib/data';
import { postMetadata } from '@/lib/seo';
import { postPath } from '@/lib/site';

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getSlugs('en');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost('en', slug);
  if (!post) return {};
  return postMetadata('en', post);
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost('en', slug);
  if (!post) notFound();

  const related = await getRelated('en', post.category, slug);
  const enHref = postPath('en', post.slug);
  const trHref = post.altExists && post.altSlug ? postPath('tr', post.altSlug) : '/tr/blog';

  return (
    <SiteFrame locale="en" enHref={enHref} trHref={trHref} active="blog">
      <PostArticle locale="en" post={post} related={related} />
    </SiteFrame>
  );
}
