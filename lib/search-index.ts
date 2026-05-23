import bossesData from '@/data/bosses.json';
import buildsData from '@/data/builds.json';
import type { Locale } from '@/lib/i18n';

export type SearchCategory = 'boss' | 'build' | 'region';

export interface SearchItem {
  category: SearchCategory;
  slug: string;
  title_en: string;
  title_zh: string;
  subtitle_en: string;
  subtitle_zh: string;
  /** Pre-lowercased haystack (titles + subtitles + extra terms, both languages). */
  keywords: string;
}

const hay = (...parts: string[]) => parts.join(' ').toLowerCase();

/**
 * Flat, in-memory index over all locally-stored content. ~94 items today, so a
 * naive substring filter is instant — no search lib needed. Weapons/items can be
 * added as another `category` once they have data + detail pages.
 */
export const searchIndex: SearchItem[] = [
  ...bossesData.bosses.map((b): SearchItem => ({
    category: 'boss',
    slug: b.slug,
    title_en: b.name_en,
    title_zh: b.name_zh,
    subtitle_en: b.location_en,
    subtitle_zh: b.location_zh,
    keywords: hay(b.name_en, b.name_zh, b.location_en, b.location_zh, ...b.weakness),
  })),
  ...buildsData.builds.map((b): SearchItem => ({
    category: 'build',
    slug: b.slug,
    title_en: b.name_en,
    title_zh: b.name_zh,
    subtitle_en: b.primary_weapon_en,
    subtitle_zh: b.primary_weapon_zh,
    keywords: hay(b.name_en, b.name_zh, b.primary_weapon_en, b.primary_weapon_zh, b.archetype),
  })),
  ...bossesData.regions.map((r): SearchItem => ({
    category: 'region',
    slug: r.slug,
    title_en: r.name_en,
    title_zh: r.name_zh,
    subtitle_en: `LV ${r.level_range}`,
    subtitle_zh: `LV ${r.level_range}`,
    keywords: hay(r.name_en, r.name_zh),
  })),
];

const SECTION: Record<SearchCategory, string> = {
  boss: 'bosses',
  build: 'builds',
  region: 'walkthrough',
};

/** Build the detail-page href for a result in the current locale. */
export function hrefFor(item: SearchItem, locale: Locale): string {
  return `/${locale}/${SECTION[item.category]}/${item.slug}`;
}

/** Substring match across both languages, ranked so prefix matches surface first. */
export function searchContent(query: string, locale: Locale, limit = 20): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return searchIndex
    .filter((it) => it.keywords.includes(q))
    .map((it) => {
      const title = (locale === 'en' ? it.title_en : it.title_zh).toLowerCase();
      return { it, rank: title.startsWith(q) ? 0 : title.includes(q) ? 1 : 2 };
    })
    .sort((a, b) => a.rank - b.rank)
    .slice(0, limit)
    .map((s) => s.it);
}
