import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';
import { locales } from '@/lib/i18n';
import bossesData from '@/data/bosses.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.baseUrl;
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Static pages per locale
  const staticPaths = ['', '/bosses', '/walkthrough', '/contact'];

  for (const lang of locales) {
    for (const p of staticPaths) {
      entries.push({
        url: `${base}/${lang}${p}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: p === '' ? 1.0 : 0.8,
      });
    }
  }

  // Boss detail pages
  for (const lang of locales) {
    for (const boss of bossesData.bosses) {
      entries.push({
        url: `${base}/${lang}/bosses/${boss.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: boss.featured ? 0.9 : 0.7,
      });
    }
  }

  // Region walkthrough pages
  for (const lang of locales) {
    for (const region of bossesData.regions) {
      entries.push({
        url: `${base}/${lang}/walkthrough/${region.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
