import { notFound } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getDictionary, type Locale, locales } from '@/lib/i18n';
import { readBossContent, estimateReadingMinutes } from '@/lib/mdx';
import { siteConfig } from '@/lib/site-config';
import bossesData from '@/data/bosses.json';
import { RecommendedGear } from '@/components/recommended-gear';
import { AdSlot } from '@/components/ad-slot';
import { ShareButton } from '@/components/share-button';
import { ReadingProgress } from '@/components/reading-progress';
import { BackToTop } from '@/components/back-to-top';
import { ArticleNav } from '@/components/article-nav';
import type { Metadata } from 'next';

interface PageProps {
  params: { lang: Locale; slug: string };
}

export function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  for (const lang of locales) {
    for (const boss of bossesData.bosses) {
      params.push({ lang, slug: boss.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const boss = bossesData.bosses.find((b) => b.slug === params.slug);
  if (!boss) return {};
  const name = params.lang === 'en' ? boss.name_en : boss.name_zh;
  const summary = params.lang === 'en' ? boss.summary_en : boss.summary_zh;

  return {
    title: `${name} — Boss Guide`,
    description: summary,
    keywords: [
      `Elden Ring ${boss.name_en}`,
      `${boss.name_en} guide`,
      `${boss.name_en} build`,
      `how to beat ${boss.name_en}`,
      `${boss.name_en} weakness`,
      'Elden Ring boss',
    ],
    alternates: {
      canonical: `${siteConfig.baseUrl}/${params.lang}/bosses/${params.slug}`,
      languages: {
        'en': `${siteConfig.baseUrl}/en/bosses/${params.slug}`,
        'zh-CN': `${siteConfig.baseUrl}/zh/bosses/${params.slug}`,
        'x-default': `${siteConfig.baseUrl}/en/bosses/${params.slug}`,
      },
    },
    openGraph: {
      type: 'article',
      title: `${name} — Boss Guide`,
      description: summary,
      url: `${siteConfig.baseUrl}/${params.lang}/bosses/${params.slug}`,
      images: ['/images/elden-ring-cover.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} — Elden Ring Boss Guide`,
      description: summary,
    },
  };
}

export default function BossPage({ params }: PageProps) {
  const { lang, slug } = params;
  const dict = getDictionary(lang);
  const boss = bossesData.bosses.find((b) => b.slug === slug);

  if (!boss) {
    notFound();
  }

  const content = readBossContent(slug, lang);
  const name = lang === 'en' ? boss.name_en : boss.name_zh;
  const location = lang === 'en' ? boss.location_en : boss.location_zh;
  const summary = lang === 'en' ? boss.summary_en : boss.summary_zh;
  const readMins = content ? estimateReadingMinutes(content.body, lang) : 0;

  // Prev/next in the (region-grouped) boss list for end-of-article continuation.
  const bossIndex = bossesData.bosses.findIndex((b) => b.slug === slug);
  const prevBoss = bossIndex > 0 ? bossesData.bosses[bossIndex - 1] : undefined;
  const nextBoss =
    bossIndex >= 0 && bossIndex < bossesData.bosses.length - 1
      ? bossesData.bosses[bossIndex + 1]
      : undefined;
  const kickerPrev = lang === 'en' ? 'Previous' : '上一篇';
  const kickerNext = lang === 'en' ? 'Next' : '下一篇';
  // FIX: weakness is a non-localized array in bosses.json
  const weakness = Array.isArray(boss.weakness) ? boss.weakness.join(', ') : (boss as any).weakness || '';

  // Article schema for SEO
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${name} — Elden Ring Boss Guide`,
    description: summary,
    image: `${siteConfig.baseUrl}/images/elden-ring-cover.png`,
    datePublished: '2026-05-22',
    dateModified: new Date().toISOString().slice(0, 10),
    author: {
      '@type': 'Organization',
      name: siteConfig.projectName,
      url: siteConfig.baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.projectName,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.baseUrl}/images/elden-ring-cover.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.baseUrl}/${lang}/bosses/${slug}`,
    },
    inLanguage: lang === 'zh' ? 'zh-CN' : 'en-US',
    about: {
      '@type': 'VideoGame',
      name: 'Elden Ring',
      publisher: 'Bandai Namco Entertainment',
      gamePlatform: ['PC', 'PlayStation', 'Xbox'],
    },
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: lang === 'en' ? 'Home' : '首页',
        item: `${siteConfig.baseUrl}/${lang}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: dict.nav.bosses,
        item: `${siteConfig.baseUrl}/${lang}/bosses`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: name,
      },
    ],
  };

  return (
    <>
      <ReadingProgress />
      <BackToTop label={lang === 'en' ? 'Back to top' : '回到顶部'} />
      <Script
        id={`schema-article-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Script
        id={`schema-breadcrumb-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="reading-area min-h-screen">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="text-xs text-ink-faint font-gothic uppercase tracking-widest mb-6">
            <Link href={`/${lang}/bosses`} className="hover:text-gold">
              {dict.nav.bosses}
            </Link>
            {' › '}
            <span className="text-ink-subtle">{name}</span>
          </nav>

          {/* Title block */}
          <header className="text-center mb-8">
            <div className="text-ink-faint text-xs tracking-[0.3em] mb-2">
              — {boss.type === 'legend' ? (lang === 'en' ? 'LEGEND BOSS' : '传说之主') : boss.type.toUpperCase()} —
            </div>
            <h1 className="font-gothic text-2xl md:text-3xl text-gold tracking-gothic mb-3">
              {name.toUpperCase()}
            </h1>
            {readMins > 0 && (
              <div className="text-ink-faint text-xs tracking-widest">
                ❦ {lang === 'en' ? `${readMins} min read` : `约 ${readMins} 分钟阅读`}
              </div>
            )}
            <div className="flex justify-center mt-4">
              <ShareButton locale={lang} />
            </div>
          </header>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-8">
            <StatBlock label={dict.boss.location} value={location} small />
            <StatBlock label={dict.boss.runes} value={boss.runes.toLocaleString()} />
            <StatBlock label={dict.boss.hp} value={String(boss.hp ?? '—')} />
            <StatBlock
              label={dict.boss.difficulty}
              value={'★'.repeat(Math.min(5, boss.difficulty))}
              danger
            />
          </div>

          {/* Weakness pill */}
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-gothic text-ink-subtle uppercase tracking-widest mr-2">
              {lang === 'en' ? 'Weak to' : '弱点'}:
            </span>
            <span className="inline-block font-serif italic text-sm text-gold">{weakness}</span>
          </div>

          {/* Ornament */}
          <div className="ornament mb-8"><span>◆</span></div>

          {/* MDX content */}
          <div className="prose-codex">
            {content ? (
              <MDXRemote source={content.body} />
            ) : (
              <div className="text-center py-12 text-ink-subtle font-serif italic">
                <p>
                  {lang === 'en'
                    ? 'Strategy content is being generated. Check back soon, Tarnished.'
                    : '攻略内容生成中,稍后再来查看,褪色者。'}
                </p>
                <p className="text-xs mt-4 text-ink-faint">
                  {lang === 'en'
                    ? 'Run: npm run generate:bosses -- --slug=' + slug
                    : '运行: npm run generate:bosses -- --slug=' + slug}
                </p>
              </div>
            )}
          </div>

          {/* Mid-content ad slot */}
          <div className="my-10">
            <AdSlot type="in-article" />
          </div>

          {/* Recommended gear (affiliate) */}
          <div className="mt-12">
            <div className="text-center mb-4">
              <div className="ornament mb-2"><span>◆</span></div>
              <h2 className="font-gothic text-base text-gold tracking-widest">
                — {dict.sections.recommended_gear.toUpperCase()} —
              </h2>
            </div>
            <RecommendedGear locale={lang} context={slug} />
          </div>

          {/* Prev / next boss continuation */}
          <ArticleNav
            prev={
              prevBoss
                ? {
                    href: `/${lang}/bosses/${prevBoss.slug}`,
                    kicker: kickerPrev,
                    title: lang === 'en' ? prevBoss.name_en : prevBoss.name_zh,
                  }
                : undefined
            }
            next={
              nextBoss
                ? {
                    href: `/${lang}/bosses/${nextBoss.slug}`,
                    kicker: kickerNext,
                    title: lang === 'en' ? nextBoss.name_en : nextBoss.name_zh,
                  }
                : undefined
            }
          />

          {/* Footer ornament */}
          <div className="text-center mt-12 ornament"><span>◆ ❦ ◆</span></div>
        </div>
      </article>
    </>
  );
}

function StatBlock({
  label,
  value,
  small = false,
  danger = false,
}: {
  label: string;
  value: string;
  small?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="bg-bg-raised border border-edge rounded-md p-3">
      <div className="text-[10px] text-ink-faint font-gothic uppercase tracking-widest mb-1">
        {label}
      </div>
      <div
        className={`font-serif ${small ? 'text-sm' : 'text-base md:text-lg'} ${
          danger ? 'text-danger' : 'text-gold'
        }`}
      >
        {value}
      </div>
    </div>
  );
}
