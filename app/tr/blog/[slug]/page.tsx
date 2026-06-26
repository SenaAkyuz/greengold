import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteFrame from '@/components/chrome/SiteFrame';
import PostArticle from '@/components/PostArticle';
import { getPost, getRelated, getSlugs } from '@/sanity/lib/data';
import { postMetadata } from '@/lib/seo';
import { postPath } from '@/lib/site';

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getSlugs('tr');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost('tr', slug);
  if (!post) return {};
  return postMetadata('tr', post);
}

export default async function TrPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost('tr', slug);
  if (!post) notFound();

  const related = await getRelated('tr', post.category, slug);
  const trHref = postPath('tr', post.slug);
  const enHref = post.altExists && post.altSlug ? postPath('en', post.altSlug) : '/blog';

  return (
    <SiteFrame locale="tr" enHref={enHref} trHref={trHref} active="blog">
      <PostArticle locale="tr" post={post} related={related} />
    </SiteFrame>
  );
}
