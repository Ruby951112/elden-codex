import { getDictionary, type Locale } from '@/lib/i18n';
import bossesData from '@/data/bosses.json';
import { BossCard } from '@/components/boss-card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Bosses — Elden Ring Boss Guide',
  description: 'Complete list of all 165 Elden Ring bosses with phase strategies, attack patterns, and recommended loadouts. Including Shadow of the Erdtree DLC.',
};

export default function BossesPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = getDictionary(lang);
  const bosses = bossesData.bosses;

  return (
    <div className="reading-area min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <div className="ornament mb-3"><span>◆ ❦ ◆</span></div>
          <h1 className="font-gothic text-2xl md:text-3xl text-gold tracking-gothic mb-2">
            {lang === 'en' ? 'BOSSES OF THE LANDS BETWEEN' : '交界地的 BOSS'}
          </h1>
          <p className="text-ink-subtle font-serif italic text-sm max-w-md mx-auto">
            {lang === 'en'
              ? 'Complete strategies for all 165 bosses — from Soldier of Godrick to the Elden Beast'
              : '全部 165 个 Boss 完整攻略——从葛瑞克士兵到艾尔登之兽'}
          </p>
        </div>

        {/* Filter pills — placeholder for now, will be interactive in iteration */}
        <div className="flex flex-wrap gap-2 mb-6 md:mb-8 justify-center">
          <FilterPill label={lang === 'en' ? 'All' : '全部'} active />
          <FilterPill label={dict.boss.main_story} />
          <FilterPill label={dict.boss.legend} />
          <FilterPill label={dict.boss.field} />
          <FilterPill label={dict.boss.dlc} />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4 max-w-5xl mx-auto">
          {bosses.map((boss) => (
            <BossCard key={boss.slug} boss={boss} locale={lang} />
          ))}
        </div>

        <div className="text-center mt-10 ornament"><span>◆</span></div>
      </div>
    </div>
  );
}

function FilterPill({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <span
      className={`font-gothic text-[10px] px-3 py-1 rounded-full border tracking-widest uppercase cursor-pointer transition-colors ${
        active
          ? 'bg-gold/10 text-gold border-gold-dim'
          : 'bg-bg-raised text-ink-subtle border-edge hover:border-edge-strong'
      }`}
    >
      {label}
    </span>
  );
}
