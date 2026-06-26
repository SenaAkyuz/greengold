import type { ReactNode } from 'react';
import type { Locale } from '@/lib/site';
import { getStrings } from './strings';
import Topbar from './Topbar';
import Header from './Header';
import Footer from './Footer';
import CookieBanner from './CookieBanner';

// Wraps a blog page's <main> with the exact legacy chrome (topbar, header,
// footer, cookie banner). enHref/trHref drive the language switcher per page.
export default function SiteFrame({
  locale,
  enHref,
  trHref,
  active,
  children,
}: {
  locale: Locale;
  enHref: string;
  trHref: string;
  active?: 'blog';
  children: ReactNode;
}) {
  const s = getStrings(locale);
  return (
    <>
      <a className="skip-link" href="#main">
        {s.skip}
      </a>
      <Topbar s={s} enHref={enHref} trHref={trHref} />
      <Header s={s} active={active} />
      {children}
      <Footer s={s} />
      <CookieBanner s={s} />
    </>
  );
}
