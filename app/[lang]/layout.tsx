import { notFound } from 'next/navigation';
import { locales, isValidLocale, type Locale } from '@/lib/i18n';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
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

  return (
    <div className="min-h-screen flex flex-col bg-bg-base">
      <SiteHeader locale={locale} />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <SiteFooter locale={locale} />
      <MobileBottomNav locale={locale} />
    </div>
  );
}
