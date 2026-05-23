import { notFound } from 'next/navigation';
import Script from 'next/script';
import { locales, isValidLocale, type Locale } from '@/lib/i18n';
import { siteConfig } from '@/lib/site-config';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export function generateMetadata({ params: { lang } }: { params: { lang: string } }) {
  if (!isValidLocale(lang)) return {};

  // Per-locale OG locale + hreflang alternates
  return {
    alternates: {
      canonical: `${siteConfig.baseUrl}/${lang}`,
      languages: {
        'en': `${siteConfig.baseUrl}/en`,
        'zh-CN': `${siteConfig.baseUrl}/zh`,
        'x-default': `${siteConfig.baseUrl}/en`,
      },
    },
    openGraph: {
      locale: lang === 'zh' ? 'zh_CN' : 'en_US',
    },
  };
}

export default function LocaleLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  if (!isValidLocale(lang)) {
    notFound();
  }

  const locale = lang as Locale;

  // JSON-LD: WebSite schema lets Google show sitelinks search box in SERP
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.projectName,
    url: siteConfig.baseUrl,
    description:
      locale === 'en'
        ? 'Phase-by-phase Elden Ring boss strategies, walkthroughs, and build guides.'
        : '阶段化 Elden Ring Boss 攻略、流程指南和流派构筑。',
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
  };

  // JSON-LD: Organization schema (helps Google know who runs the site)
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.projectName,
    url: siteConfig.baseUrl,
    logo: `${siteConfig.baseUrl}/images/elden-ring-cover.png`,
  };

  return (
    <>
      {/* Inject language via inline script — html element is in RootLayout */}
      <Script
        id="set-lang"
        strategy="beforeInteractive"
      >
        {`document.documentElement.lang = '${locale === 'zh' ? 'zh-CN' : 'en'}';`}
      </Script>

      {/* Structured data */}
      <Script
        id="schema-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="schema-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      <div className="min-h-screen flex flex-col bg-bg-base">
        <SiteHeader locale={locale} />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <SiteFooter locale={locale} />
        <MobileBottomNav locale={locale} />
      </div>
    </>
  );
}
