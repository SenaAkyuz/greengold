import Image from 'next/image';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import { urlFor, dimsFromRef } from '@/sanity/lib/image';

type ImageValue = {
  asset?: { _ref?: string };
  alt?: string;
};

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: ImageValue }) => {
      const ref = value?.asset?._ref;
      if (!ref) return null;
      const dims = dimsFromRef(ref) || { width: 1280, height: 853 };
      return (
        <figure className="post-body-figure">
          <Image
            src={urlFor(value).width(1280).url()}
            alt={value.alt || ''}
            width={dims.width}
            height={dims.height}
            sizes="(max-width: 800px) 100vw, 760px"
          />
          {value.alt ? <figcaption>{value.alt}</figcaption> : null}
        </figure>
      );
    },
  },
  marks: {
    link: ({ value, children }) => {
      const href: string = value?.href || '';
      const isExternal =
        /^https?:\/\//.test(href) && !href.includes('foundationgreengold');
      return (
        <a
          href={href}
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </a>
      );
    },
  },
};

export default function PortableBody({ value }: { value?: unknown[] }) {
  if (!value || value.length === 0) return null;
  return <PortableText value={value as PortableTextBlock[]} components={components} />;
}
