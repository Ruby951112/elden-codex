import Link from 'next/link';
import { notFound } from 'next/navigation';
import { type Locale, locales, getDictionary } from '@/lib/i18n';
import buildsData from '@/data/builds.json';
import { AdSlot } from '@/components/ad-slot';
import { RecommendedGear } from '@/components/recommended-gear';

export async function generateStaticParams() {
  const params = [];
  for (const lang of locales) {
    for (const build of buildsData.builds) {
      params.push({ lang, slug: build.slug });
    }
  }
  return params;
}

export function generateMetadata({ params: { lang, slug } }: { params: { lang: Locale; slug: string } }) {
  const build = buildsData.builds.find((b) => b.slug === slug);
  if (!build) return { title: 'Build Not Found' };
  const name = lang === 'en' ? build.name_en : build.name_zh;
  const summary = lang === 'en' ? build.summary_en : build.summary_zh;
  return {
    title: `${name} — Elden Codex`,
    description: summary,
  };
}

export default function BuildDetailPage({
  params: { lang, slug },
}: {
  params: { lang: Locale; slug: string };
}) {
  const build = buildsData.builds.find((b) => b.slug === slug);
  if (!build) return notFound();

  const dict = getDictionary(lang);
  const name = lang === 'en' ? build.name_en : build.name_zh;
  const playstyle = lang === 'en' ? build.playstyle_en : build.playstyle_zh;
  const summary = lang === 'en' ? build.summary_en : build.summary_zh;
  const weapon = lang === 'en' ? build.primary_weapon_en : build.primary_weapon_zh;
  const startingClass = lang === 'en' ? build.starting_class_en : build.starting_class_zh;
  const stats = lang === 'en' ? build.stat_priority : build.stat_priority_zh;
  const weakness = lang === 'en' ? build.weakness : build.weakness_zh;

  return (
    <main className="reading-area min-h-screen">
      <article className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-ink-faint mb-6">
          <Link href={`/${lang}`} className="hover:text-gold">
            {lang === 'en' ? 'Home' : '首页'}
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/${lang}/builds`} className="hover:text-gold">
            {lang === 'en' ? 'Builds' : '流派'}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink-muted">{name}</span>
        </nav>

        {/* Title */}
        <header className="mb-8">
          <div className="ornament mb-2"><span>◆</span></div>
          <h1 className="font-gothic text-3xl md:text-4xl text-gold tracking-gothic mb-3">
            {name}
          </h1>
          <p className="text-ink-muted font-serif italic">{playstyle}</p>
        </header>

        {/* Stat blocks */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="bg-bg-raised border border-edge-base rounded p-3">
            <div className="text-xs text-ink-faint uppercase tracking-wide mb-1">
              {lang === 'en' ? 'Tier' : '梯度'}
            </div>
            <div className={`font-mono text-lg ${build.tier === 'S' ? 'text-gold' : 'text-ink-body'}`}>
              {build.tier}
            </div>
          </div>
          <div className="bg-bg-raised border border-edge-base rounded p-3">
            <div className="text-xs text-ink-faint uppercase tracking-wide mb-1">
              {lang === 'en' ? 'Difficulty' : '难度'}
            </div>
            <div className="font-mono text-lg text-ink-body">
              {'★'.repeat(build.difficulty)}{'☆'.repeat(3 - build.difficulty)}
            </div>
          </div>
          <div className="bg-bg-raised border border-edge-base rounded p-3">
            <div className="text-xs text-ink-faint uppercase tracking-wide mb-1">
              {lang === 'en' ? 'Start' : '初始'}
            </div>
            <div className="text-sm text-ink-body">{startingClass}</div>
          </div>
          <div className="bg-bg-raised border border-edge-base rounded p-3">
            <div className="text-xs text-ink-faint uppercase tracking-wide mb-1">
              {lang === 'en' ? 'Type' : '类型'}
            </div>
            <div className="text-sm text-ink-body capitalize">{build.archetype}</div>
          </div>
        </div>

        {/* Summary */}
        <p className="text-ink-body font-serif text-lg leading-relaxed mb-8 border-l-2 border-gold/30 pl-4 italic">
          {summary}
        </p>

        {/* Primary weapon section */}
        <section className="mb-8">
          <h2 className="font-gothic text-2xl text-gold mb-3 tracking-gothic">
            {lang === 'en' ? 'PRIMARY WEAPON' : '核心武器'}
          </h2>
          <div className="bg-bg-raised border border-edge-base rounded p-4">
            <div className="text-ink-body text-lg mb-1">{weapon}</div>
            <div className="text-ink-muted text-sm">
              {lang === 'en' ? 'Buff: ' : '附魔:'}
              <span className="text-ink-body">{build.weapon_buff}</span>
            </div>
          </div>
        </section>

        {/* Stat priority */}
        <section className="mb-8">
          <h2 className="font-gothic text-2xl text-gold mb-3 tracking-gothic">
            {lang === 'en' ? 'STAT PRIORITY' : '属性加点优先级'}
          </h2>
          <ol className="space-y-2">
            {stats.map((stat, i) => (
              <li
                key={i}
                className="flex items-center gap-3 bg-bg-raised border border-edge-base rounded p-3"
              >
                <span className="font-gothic text-gold text-lg w-6">{i + 1}.</span>
                <span className="text-ink-body">{stat}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Ad slot */}
        <div className="my-10">
          <AdSlot type="in-article" slot="builds-mid" />
        </div>

        {/* Weakness */}
        <section className="mb-8">
          <h2 className="font-gothic text-2xl text-danger mb-3 tracking-gothic">
            {lang === 'en' ? 'WEAKNESS' : '弱点'}
          </h2>
          <p className="text-ink-body bg-danger/5 border-l-2 border-danger/40 pl-4 py-3 italic">
            {weakness}
          </p>
        </section>

        {/* Recommended gear (affiliate) */}
        <RecommendedGear context={`build:${slug}`} locale={lang} />

        {/* Back link */}
        <div className="text-center mt-12">
          <Link
            href={`/${lang}/builds`}
            className="inline-block text-gold hover:text-gold-light font-serif italic"
          >
            ← {lang === 'en' ? 'Back to all builds' : '返回流派列表'}
          </Link>
        </div>

        <div className="text-center mt-8 ornament"><span>◆</span></div>
      </article>
    </main>
  );
}
