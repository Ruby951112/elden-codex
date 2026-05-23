import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getDictionary, type Locale, locales } from '@/lib/i18n';
import { readWalkthroughContent, estimateReadingMinutes } from '@/lib/mdx';
import bossesData from '@/data/bosses.json';
import { BossCard } from '@/components/boss-card';
import { AdSlot } from '@/components/ad-slot';
import { ReadingProgress } from '@/components/reading-progress';
import { BackToTop } from '@/components/back-to-top';
import { ArticleNav } from '@/components/article-nav';
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
    description:
      params.lang === 'en'
        ? `${region.name_en} walkthrough — recommended level ${region.level_range}.`
        : `${region.name_zh} 流程攻略 — 推荐等级 ${region.level_range}。`,
  };
}

export default function RegionPage({ params }: PageProps) {
  const { lang, region: regionSlug } = params;
  const dict = getDictionary(lang);
  const region = bossesData.regions.find((r) => r.slug === regionSlug);

  if (!region) notFound();

  const regionBosses = bossesData.bosses.filter((b) => b.region === regionSlug);
  const content = readWalkthroughContent(regionSlug, lang);
  const readMins = content ? estimateReadingMinutes(content.body, lang) : 0;
  const name = lang === 'en' ? region.name_en : region.name_zh;
  const description =
    lang === 'en'
      ? `Recommended level ${region.level_range}`
      : `推荐等级 ${region.level_range}`;

  // Prev/next region by progression order for end-of-article continuation.
  const ordered = [...bossesData.regions].sort((a, b) => a.order - b.order);
  const regionIndex = ordered.findIndex((r) => r.slug === regionSlug);
  const prevRegion = regionIndex > 0 ? ordered[regionIndex - 1] : undefined;
  const nextRegion =
    regionIndex >= 0 && regionIndex < ordered.length - 1 ? ordered[regionIndex + 1] : undefined;
  const kickerPrev = lang === 'en' ? 'Previous' : '上一篇';
  const kickerNext = lang === 'en' ? 'Next' : '下一篇';

  return (
    <div className="reading-area min-h-screen">
      <ReadingProgress />
      <BackToTop label={lang === 'en' ? 'Back to top' : '回到顶部'} />
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
          {readMins > 0 && (
            <div className="text-ink-faint text-xs tracking-widest mt-2">
              ❦ {lang === 'en' ? `${readMins} min read` : `约 ${readMins} 分钟阅读`}
            </div>
          )}
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

        {/* Walkthrough content */}
        <div className="prose-codex">
          {content ? (
            <MDXRemote source={content.body} />
          ) : (
            <div className="bg-bg-raised border border-edge rounded-md p-6 md:p-8 text-center">
              <p className="text-ink-subtle font-serif italic">
                {lang === 'en'
                  ? 'Detailed walkthrough is being generated. Check back soon, Tarnished.'
                  : '详细攻略生成中,稍后再来查看,褪色者。'}
              </p>
              <p className="text-xs mt-4 text-ink-faint">
                {lang === 'en'
                  ? 'Run: npm run generate:walkthrough -- --region=' + regionSlug
                  : '运行: npm run generate:walkthrough -- --region=' + regionSlug}
              </p>
            </div>
          )}
        </div>

        {/* Prev / next region continuation */}
        <ArticleNav
          prev={
            prevRegion
              ? {
                  href: `/${lang}/walkthrough/${prevRegion.slug}`,
                  kicker: kickerPrev,
                  title: lang === 'en' ? prevRegion.name_en : prevRegion.name_zh,
                }
              : undefined
          }
          next={
            nextRegion
              ? {
                  href: `/${lang}/walkthrough/${nextRegion.slug}`,
                  kicker: kickerNext,
                  title: lang === 'en' ? nextRegion.name_en : nextRegion.name_zh,
                }
              : undefined
          }
        />

        <div className="text-center mt-10 ornament"><span>◆ ❦ ◆</span></div>
      </div>
    </div>
  );
}
