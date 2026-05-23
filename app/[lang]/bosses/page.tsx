import { getDictionary, type Locale } from '@/lib/i18n';
import bossesData from '@/data/bosses.json';
import { BossFilter } from '@/components/boss-filter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Bosses — Elden Ring Boss Guide',
  description: 'Complete list of all 165 Elden Ring bosses with phase strategies, attack patterns, and recommended loadouts. Including Shadow of the Erdtree DLC.',
};

export default function BossesPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = getDictionary(lang);
  const bosses = bossesData.bosses;
  const dlcRegions = bossesData.regions.filter((r) => r.dlc).map((r) => r.slug);
  const filterLabels = {
    all: lang === 'en' ? 'All' : '全部',
    main: dict.boss.main_story,
    legend: dict.boss.legend,
    field: dict.boss.field,
    dlc: dict.boss.dlc,
  };

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

        {/* Interactive filter + grid */}
        <BossFilter
          bosses={bosses}
          locale={lang}
          dlcRegions={dlcRegions}
          labels={filterLabels}
        />

        <div className="text-center mt-10 ornament"><span>◆</span></div>
      </div>
    </div>
  );
}
