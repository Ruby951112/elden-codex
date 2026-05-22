import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getDictionary, type Locale, locales } from '@/lib/i18n';
import { readBossContent } from '@/lib/mdx';
import bossesData from '@/data/bosses.json';
import { RecommendedGear } from '@/components/recommended-gear';
import { AdSlot } from '@/components/ad-slot';
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
    keywords: [`Elden Ring ${boss.name_en}`, `${boss.name_en} guide`, `${boss.name_en} build`, 'Elden Ring boss'],
    openGraph: {
      title: `${name} — Boss Guide`,
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
  const weakness = boss.weakness.join(' · ');

  return (
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
        </header>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-8">
          <StatBlock label={dict.boss.location} value={location} small />
          <StatBlock label={dict.boss.runes} value={boss.runes.toLocaleString()} />
          <StatBlock label={dict.boss.hp} value={boss.hp.toLocaleString()} />
          <StatBlock
            label={dict.boss.difficulty}
            value={'★'.repeat(Math.min(5, Math.ceil(boss.difficulty / 2)))}
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

        {/* Footer ornament */}
        <div className="text-center mt-12 ornament"><span>◆ ❦ ◆</span></div>
      </div>
    </article>
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
