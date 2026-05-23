import Link from 'next/link';
import { type Locale, getDictionary } from '@/lib/i18n';
import buildsData from '@/data/builds.json';

export const metadata = {
  title: 'Builds — Elden Codex',
  description: 'Curated Elden Ring build guides — Strength, Dex Bleed, Mage, Faith, Arcane, and more.',
};

export default function BuildsPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = getDictionary(lang);
  const builds = buildsData.builds;

  const tierLabel = lang === 'en' ? 'Tier' : '梯度';
  const difficultyLabel = lang === 'en' ? 'Difficulty' : '难度';
  const archetypeLabel = lang === 'en' ? 'Archetype' : '主属性';

  return (
    <main className="reading-area min-h-screen">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Page header */}
        <header className="text-center mb-10">
          <div className="ornament mb-3"><span>◆ ❦ ◆</span></div>
          <h1 className="font-gothic text-3xl md:text-4xl text-gold tracking-gothic mb-3">
            {lang === 'en' ? 'BUILDS' : '流派攻略'}
          </h1>
          <p className="text-ink-muted font-serif italic max-w-2xl mx-auto">
            {lang === 'en'
              ? 'Hand-picked build paths for every playstyle — from beginner-friendly bonk to endgame meta.'
              : '为每种玩法精选的构筑路线 —— 从新手友好的力战到终局热门的法师。'}
          </p>
        </header>

        {/* Builds grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {builds.map((build) => {
            const name = lang === 'en' ? build.name_en : build.name_zh;
            const playstyle = lang === 'en' ? build.playstyle_en : build.playstyle_zh;
            const summary = lang === 'en' ? build.summary_en : build.summary_zh;
            const weapon = lang === 'en' ? build.primary_weapon_en : build.primary_weapon_zh;

            return (
              <Link
                key={build.slug}
                href={`/${lang}/builds/${build.slug}`}
                className="group block bg-bg-raised border border-edge-base rounded-lg p-5 md:p-6 hover:border-gold/40 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h2 className="font-gothic text-xl md:text-2xl text-gold tracking-tight group-hover:text-gold-light transition-colors">
                    {name}
                  </h2>
                  <span className={`shrink-0 text-xs font-mono px-2 py-1 rounded ${
                    build.tier === 'S'
                      ? 'bg-gold/15 text-gold border border-gold/30'
                      : 'bg-edge-base/30 text-ink-muted border border-edge-base'
                  }`}>
                    {build.tier}-{tierLabel}
                  </span>
                </div>

                <p className="text-ink-body font-serif text-sm md:text-base mb-4 italic">
                  {playstyle}
                </p>

                <div className="space-y-1.5 text-sm text-ink-muted mb-4">
                  <div className="flex justify-between gap-2">
                    <span className="text-ink-faint">{lang === 'en' ? 'Weapon' : '武器'}</span>
                    <span className="text-ink-body text-right">{weapon}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-ink-faint">{archetypeLabel}</span>
                    <span className="text-ink-body text-right capitalize">{build.archetype}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-ink-faint">{difficultyLabel}</span>
                    <span className="text-ink-body text-right">
                      {'★'.repeat(build.difficulty)}{'☆'.repeat(3 - build.difficulty)}
                    </span>
                  </div>
                </div>

                <p className="text-ink-body text-sm leading-relaxed border-t border-edge-base/50 pt-3">
                  {summary}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12 ornament"><span>◆</span></div>
      </div>
    </main>
  );
}
