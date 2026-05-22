import Link from 'next/link';
import { getDictionary, type Locale } from '@/lib/i18n';
import bossesData from '@/data/bosses.json';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Walkthrough — Optimal Path Through the Lands Between',
  description: 'Region-by-region walkthrough for Elden Ring. Recommended level ranges, key items, and progression order.',
};

export default function WalkthroughPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = getDictionary(lang);
  const regions = bossesData.regions;

  return (
    <div className="reading-area min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-10">
          <div className="ornament mb-3"><span>◆ ❦ ◆</span></div>
          <h1 className="font-gothic text-2xl md:text-3xl text-gold tracking-gothic mb-2">
            {lang === 'en' ? 'THE OPTIMAL PATH' : '最优路线'}
          </h1>
          <p className="text-ink-subtle font-serif italic text-sm max-w-md mx-auto">
            {lang === 'en'
              ? 'Region-by-region progression from grace to Elden Throne'
              : '从赐福到艾尔登王座的逐区域流程'}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {regions.map((region, idx) => (
            <Link
              key={region.slug}
              href={`/${lang}/walkthrough/${region.slug}`}
              className="block bg-bg-raised border border-edge rounded-md p-4 md:p-5 hover:border-edge-strong transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="font-gothic text-2xl md:text-3xl text-gold-dim shrink-0 w-10 text-center">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline gap-2 mb-1">
                    <h3 className="font-gothic text-base md:text-lg text-ink-primary group-hover:text-gold transition-colors tracking-widest">
                      {lang === 'en' ? region.name_en.toUpperCase() : region.name_zh}
                    </h3>
                    <span className="text-xs text-ink-faint font-gothic">
                      LV {region.level_range}
                    </span>
                  </div>
                  <p className="text-sm text-ink-muted font-serif italic">
                    {lang === 'en' ? region.description_en : region.description_zh}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10 ornament"><span>◆</span></div>
      </div>
    </div>
  );
}
