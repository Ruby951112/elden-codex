'use client';

import { useState } from 'react';
import { type Locale } from '@/lib/i18n';
import { BossCard } from '@/components/boss-card';

interface Boss {
  slug: string;
  name_en: string;
  name_zh: string;
  location_en: string;
  location_zh: string;
  type: string;
  region: string;
  remembrance: boolean;
  summary_en: string;
  summary_zh: string;
  difficulty: number;
}

type FilterKey = 'all' | 'main' | 'legend' | 'field' | 'dlc';

// "Main story" path bosses (story progression / shardbearers / final bosses).
const MAIN_TYPES = ['main', 'main-side', 'demigod', 'final', 'final-dlc'];

const ORDER: FilterKey[] = ['all', 'main', 'legend', 'field', 'dlc'];

export function BossFilter({
  bosses,
  locale,
  dlcRegions,
  labels,
}: {
  bosses: Boss[];
  locale: Locale;
  dlcRegions: string[];
  labels: Record<FilterKey, string>;
}) {
  const [active, setActive] = useState<FilterKey>('all');
  const dlc = new Set(dlcRegions);

  const matchesKey = (boss: Boss, key: FilterKey): boolean => {
    switch (key) {
      case 'all':
        return true;
      case 'main':
        return MAIN_TYPES.includes(boss.type);
      case 'legend':
        return boss.remembrance; // bosses that drop a Remembrance
      case 'field':
        return boss.type.startsWith('field') || boss.type === 'evergaol';
      case 'dlc':
        return dlc.has(boss.region);
    }
  };

  const counts = ORDER.reduce((acc, key) => {
    acc[key] = bosses.filter((b) => matchesKey(b, key)).length;
    return acc;
  }, {} as Record<FilterKey, number>);

  const filtered = bosses.filter((b) => matchesKey(b, active));

  return (
    <>
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-6 md:mb-8 justify-center">
        {ORDER.map((key) => {
          const isActive = key === active;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              aria-pressed={isActive}
              className={`font-gothic text-[10px] px-3 py-1 rounded-full border tracking-widest uppercase cursor-pointer transition-colors ${
                isActive
                  ? 'bg-gold/10 text-gold border-gold-dim'
                  : 'bg-bg-raised text-ink-subtle border-edge hover:border-edge-strong'
              }`}
            >
              {labels[key]}
              <span className={`ml-1.5 tabular-nums ${isActive ? 'text-gold/70' : 'text-ink-faint'}`}>
                {counts[key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4 max-w-5xl mx-auto">
        {filtered.map((boss) => (
          <BossCard key={boss.slug} boss={boss} locale={locale} />
        ))}
      </div>
    </>
  );
}
