import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDictionary, type Locale, locales } from '@/lib/i18n';
import bossesData from '@/data/bosses.json';
import { BossCard } from '@/components/boss-card';
import { AdSlot } from '@/components/ad-slot';
import type { Metadata } from 'next';

interface PageProps {
  params: { lang: Locale; region: string };
}

export function generateStaticParams() {
  const params: { lang: string; region: string }[] = [];
  for (const lang of locales) {
    for (const region of bossesData.regions) {
      params.push({ lang, region: region.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const region = bossesData.regions.find((r) => r.slug === params.region);
  if (!region) return {};
  const name = params.lang === 'en' ? region.name_en : region.name_zh;
  return {
    title: `${name} Walkthrough`,
    description: params.lang === 'en' ? region.description_en : region.description_zh,
  };
}

export default function RegionPage({ params }: PageProps) {
  const { lang, region: regionSlug } = params;
  const dict = getDictionary(lang);
  const region = bossesData.regions.find((r) => r.slug === regionSlug);

  if (!region) notFound();

  const regionBosses = bossesData.bosses.filter((b) => b.region === regionSlug);
  const name = lang === 'en' ? region.name_en : region.name_zh;
  const description = lang === 'en' ? region.description_en : region.description_zh;

  return (
    <div className="reading-area min-h-screen">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-ink-faint font-gothic uppercase tracking-widest mb-6">
          <Link href={`/${lang}/walkthrough`} className="hover:text-gold">
            {dict.nav.walkthrough}
          </Link>
          {' › '}
          <span className="text-ink-subtle">{name}</span>
        </nav>

        <header className="text-center mb-8">
          <div className="text-ink-faint text-xs tracking-[0.3em] mb-2">
            — LV {region.level_range} —
          </div>
          <h1 className="font-gothic text-2xl md:text-3xl text-gold tracking-gothic mb-3">
            {name.toUpperCase()}
          </h1>
          <p className="text-ink-muted font-serif italic">{description}</p>
        </header>

        <div className="ornament mb-8"><span>◆</span></div>

        {/* Bosses in this region */}
        <h2 className="font-gothic text-base text-gold tracking-widest mb-4 text-center">
          — {lang === 'en' ? 'BOSSES IN THIS REGION' : '本区域 BOSS'} —
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
          {regionBosses.map((boss) => (
            <BossCard key={boss.slug} boss={boss} locale={lang} />
          ))}
        </div>

        {/* Ad slot */}
        <div className="my-8">
          <AdSlot type="in-article" />
        </div>

        {/* Walkthrough placeholder */}
        <div className="bg-bg-raised border border-edge rounded-md p-6 md:p-8 text-center">
          <p className="text-ink-subtle font-serif italic">
            {lang === 'en'
              ? 'Detailed walkthrough coming soon. Run: npm run generate:walkthrough -- --region=' + regionSlug
              : '详细攻略生成中。运行: npm run generate:walkthrough -- --region=' + regionSlug}
          </p>
        </div>

        <div className="text-center mt-10 ornament"><span>◆ ❦ ◆</span></div>
      </div>
    </div>
  );
}
