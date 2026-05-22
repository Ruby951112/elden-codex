import Link from 'next/link';
import Image from 'next/image';
import { getDictionary, type Locale } from '@/lib/i18n';
import { siteConfig } from '@/lib/site-config';
import bossesData from '@/data/bosses.json';
import { BossCard } from '@/components/boss-card';

export default function HomePage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = getDictionary(lang);
  const featured = bossesData.bosses.filter((b) => b.featured).slice(0, 4);
  const totalBosses = 165;
  const totalRegions = bossesData.regions.length;

  return (
    <div className="flex flex-col">
      {/* Hero — desktop: side-by-side, mobile: stacked */}
      <section className="bg-gradient-to-b from-bg-deepest via-bg-base to-bg-raised border-b border-edge">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Cover image */}
            <div className="shrink-0 w-44 h-44 md:w-64 md:h-64 border border-edge-strong rounded overflow-hidden relative bg-bg-deepest"
                 style={{ boxShadow: '0 0 50px rgba(201, 165, 89, 0.12)' }}>
              <Image
                src={siteConfig.heroImage}
                alt="Elden Ring"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 176px, 256px"
              />
            </div>

            {/* Copy */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="text-ink-faint text-xs tracking-widest mb-3">
                ◆ ❦ ◆
              </div>
              <h1 className="font-gothic text-2xl md:text-4xl text-gold tracking-gothic mb-3">
                {dict.site.hero_title.toUpperCase()}
              </h1>
              <p className="text-ink-muted font-serif italic text-sm md:text-base max-w-md mb-6">
                {dict.site.tagline}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link
                  href={`/${lang}/walkthrough`}
                  className="font-gothic text-xs uppercase tracking-widest px-6 py-3 bg-bg-raised border border-edge-strong text-gold hover:bg-gold/10 hover:border-gold transition-colors text-center"
                >
                  {dict.site.hero_cta_primary}
                </Link>
                <Link
                  href={`/${lang}/bosses?filter=dlc`}
                  className="font-gothic text-xs uppercase tracking-widest px-6 py-3 border border-edge text-ink-subtle hover:text-gold hover:border-edge-strong transition-colors text-center"
                >
                  {dict.site.hero_cta_secondary}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="reading-area">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
          <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-3xl mx-auto">
            <StatCard icon="⚔" value={totalBosses.toString()} label={dict.stats.bosses} sub={dict.stats.bosses_sub} />
            <StatCard icon="❦" value={totalRegions.toString()} label={dict.stats.regions} sub={dict.stats.regions_sub} />
            <StatCard icon="✦" value={dict.stats.dlc} label="" sub={dict.stats.dlc_sub} />
          </div>
        </div>
      </section>

      {/* Featured bosses */}
      <section className="reading-area">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="text-center mb-6 md:mb-8">
            <div className="ornament mb-3"><span>◆</span></div>
            <h2 className="font-gothic text-base md:text-lg text-gold tracking-widest">
              — {dict.sections.featured_bosses.toUpperCase()} —
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 max-w-5xl mx-auto">
            {featured.map((boss) => (
              <BossCard key={boss.slug} boss={boss} locale={lang} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href={`/${lang}/bosses`}
              className="inline-block font-gothic text-xs uppercase tracking-widest text-gold hover:text-gold-bright border-b border-gold-dim pb-1"
            >
              {dict.sections.all_bosses} →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, value, label, sub }: { icon: string; value: string; label: string; sub: string }) {
  return (
    <div className="bg-bg-raised border border-edge rounded-md p-3 md:p-4 text-center">
      <div className="text-xl md:text-2xl text-gold mb-1">{icon}</div>
      <div className="font-gothic text-xs md:text-sm text-ink-primary">{value} {label}</div>
      <div className="text-[10px] md:text-xs text-ink-subtle mt-0.5 font-serif">{sub}</div>
    </div>
  );
}
