import type { Locale } from '@/lib/site';
import { localePrefix } from '@/lib/site';

// All chrome/UI copy, extracted 1:1 from the legacy static pages. hrefs are
// prefixed per locale ('' for EN, '/tr' for TR).
export function getStrings(loc: Locale) {
  const p = localePrefix(loc);
  const en = loc === 'en';

  return {
    skip: en ? 'Skip to content' : 'İçeriğe geç',

    topbar: {
      contact: en ? 'Contact' : 'İletişim',
      mail: 'mailto:info@greengoldfondation.com',
      phoneLabel: en
        ? 'Contact number: (+243) 829 000 828'
        : 'İletişim numarası: (+243) 829 000 828',
      phoneHref: 'tel:+243829000828',
      langAria: en ? 'Language' : 'Dil',
    },

    header: {
      logoHref: en ? '/' : '/tr',
      esgLabel: en ? 'ESG Platform' : 'ESG Platformu',
      esgHref: 'https://esg.foundationgreengold.org/',
      menuOpen: en ? 'Open menu' : 'Menüyü aç',
      navAria: en ? 'Main menu' : 'Ana menü',
      requestDemo: en ? 'Request Demo' : 'Demo Talep Et',
      nav: {
        climateMembership: en ? 'Climate Membership' : 'İklim Üyeliği',
        projects: en ? 'Projects' : 'Projeler',
        mission: en ? 'Mission' : 'Misyon',
        about: en ? 'About Us' : 'Hakkımızda',
        takeAction: en ? 'Take Action' : 'Harekete Geç',
        donate: en ? 'Donate' : 'Bağış Yap',
        carbonCredits: en ? 'Carbon Credits' : 'Karbon Kredileri',
        blog: 'Blog',
      },
      mega: {
        tag: en ? 'PROJECTS' : 'PROJELER',
        h5: en
          ? 'Green Gold Foundation impact projects'
          : 'Green Gold Foundation etki projeleri',
        p: en
          ? 'Explore our flagship sustainability initiatives across mobility and hospitality.'
          : 'Mobilite ve konaklama alanlarındaki öncü sürdürülebilirlik girişimlerimizi keşfedin.',
        discover: en ? 'Discover' : 'Keşfet',
        ourProjects: en ? 'Our Projects' : 'Projelerimiz',
      },
      href: {
        climateMembership: `${p}/climate-membership`,
        wings: `${p}/green-gold-wings`,
        wheels: `${p}/green-gold-wheels`,
        stay: `${p}/green-gold-stay`,
        mission: `${p}/mission`,
        about: `${p}/about-us`,
        takeAction: `${p}/take-action`,
        donate: `${p}/donate`,
        carbonCredits: `${p}/carbon-credits`,
        blog: `${p}/blog`,
      },
    },

    footer: {
      brand: en
        ? 'Green Gold Foundation protects forests in the Congo Basin and empowers local communities, helping companies measure, report, and reduce their carbon footprint.'
        : 'Green Gold Foundation, Kongo Havzası’ndaki ormanları korur ve yerel toplulukları güçlendirir; şirketlerin karbon ayak izlerini ölçmelerine, raporlamalarına ve azaltmalarına yardımcı olur.',
      solutions: en ? 'Solutions' : 'Çözümler',
      carbonMeasurement: en ? 'Carbon Measurement' : 'Karbon Ölçümü',
      carbonCreditMarket: en ? 'Carbon Credit Market' : 'Karbon Kredisi Pazarı',
      resources: en ? 'Resources' : 'Kaynaklar',
      faq: en ? 'Frequently Asked Questions' : 'Sıkça Sorulan Sorular',
      company: en ? 'Company' : 'Kurumsal',
      about: en ? 'About Us' : 'Hakkımızda',
      missionImpact: en ? 'Mission & Impact' : 'Misyon ve Etki',
      events: en ? 'Events' : 'Etkinlikler',
      contact: en ? 'Contact' : 'İletişim',
      rights: en
        ? '© 2026 Green Gold Foundation — All rights reserved.'
        : '© 2026 Green Gold Foundation — Tüm hakları saklıdır.',
      legalNotice: en ? 'Legal Notice' : 'Yasal Bildirim',
      privacy: en ? 'Privacy & Data Protection' : 'Gizlilik ve Veri Koruma',
      cookiePolicy: en ? 'Cookie Policy' : 'Çerez Politikası',
      terms: en ? 'Terms of Service' : 'Kullanım Koşulları',
      href: {
        carbonMeasurement: `${p}/carbon-measurement`,
        carbonCredits: `${p}/carbon-credits`,
        faq: `${p}/#faq`,
        about: `${p}/about-us`,
        mission: `${p}/mission`,
        events: `${p}/events`,
        legalNotice: `${p}/legal-notice`,
        privacy: `${p}/privacy`,
        cookiePolicy: `${p}/cookie-policy`,
        terms: `${p}/terms`,
      },
    },

    cookie: {
      textBefore: en
        ? 'We use cookies to operate this site and, with your consent, to analyze traffic. See our '
        : 'Bu siteyi çalıştırmak ve onayınızla trafiği analiz etmek için çerezler kullanıyoruz. ',
      link: en ? 'Cookie Policy' : 'Çerez Politikamıza',
      textAfter: en ? '.' : ' bakın.',
      reject: en ? 'Reject non-essential' : 'Zorunlu olmayanları reddet',
      accept: en ? 'Accept all' : 'Tümünü kabul et',
      href: `${p}/cookie-policy`,
    },

    blog: {
      headTitle: 'Blog',
      tagline: en
        ? 'Destination Net Zero — reduce carbon, restore ecosystems, revive our future.'
        : 'Hedef Net Sıfır — karbonu azalt, ekosistemleri onar, geleceğimizi canlandır.',
      filterAria: en
        ? 'Filter posts by category'
        : 'Yazıları kategoriye göre filtrele',
      filterAll: en ? 'All' : 'Tümü',
      empty: en
        ? 'No posts in this category yet.'
        : 'Bu kategoride henüz yazı yok.',
      backToAll: en ? '← All Posts' : '← Tüm Yazılar',
      relatedHead: en ? 'Related articles' : 'İlgili Yazılar',
      viewAll: en ? 'View all →' : 'Tümünü Gör →',
      footCta: en
        ? 'Calculate Your Carbon Footprint'
        : 'Karbon Ayak İzinizi Hesaplayın →',
      footCtaHref: `${p}/carbon-footprint-calculator`,
      indexPath: `${p}/blog`,
    },
  };
}

export type Strings = ReturnType<typeof getStrings>;
