import Link from 'next/link';
import { type Locale } from '@/lib/i18n';

export const metadata = {
  title: 'Weapons — Coming Soon',
  description: 'Comprehensive Elden Ring weapon database with stats, scaling, and movesets — launching Q1 2027.',
};

export default function WeaponsPage({ params: { lang } }: { params: { lang: Locale } }) {
  const features = lang === 'en'
    ? [
        '300+ weapons with full scaling data',
        'Filter by class, scaling, weight, weapon art',
        'Damage calculator with stat input',
        'Best weapons per build path',
        'DLC weapons including Backhand Blades & Beast Claws',
      ]
    : [
        '300+ 武器,完整加成数据',
        '按类型、加成、重量、战技筛选',
        '伤害计算器,自定义属性输入',
        '每种流派的最佳武器推荐',
        'DLC 武器包括逆刃刀、兽爪等',
      ];

  return (
    <main className="reading-area min-h-screen">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-12 md:py-16">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="ornament mb-3"><span>◆ ❦ ◆</span></div>
          <div className="inline-block px-3 py-1 bg-gold/10 border border-gold/30 rounded text-gold text-xs font-mono tracking-wider mb-4">
            {lang === 'en' ? 'COMING Q1 2027' : '2027 年 Q1 上线'}
          </div>
          <h1 className="font-gothic text-3xl md:text-4xl text-gold tracking-gothic mb-4">
            {lang === 'en' ? 'WEAPONS DATABASE' : '武器数据库'}
          </h1>
          <p className="text-ink-muted font-serif italic">
            {lang === 'en'
              ? 'The most thorough Elden Ring weapon reference is being forged.'
              : '最详尽的艾尔登法环武器图鉴正在锻造中。'}
          </p>
        </div>

        {/* Feature preview */}
        <div className="bg-bg-raised border border-edge-base rounded-lg p-6 mb-8">
          <h2 className="font-gothic text-lg text-gold mb-4 tracking-gothic">
            {lang === 'en' ? "WHAT'S COMING" : '将要包含的功能'}
          </h2>
          <ul className="space-y-3">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-ink-body">
                <span className="text-gold font-mono shrink-0">◆</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* External resource recommendation */}
        <div className="bg-bg-raised/50 border border-edge-base/50 rounded-lg p-5 mb-8">
          <h3 className="font-serif text-sm text-ink-muted mb-2 italic">
            {lang === 'en' ? 'In the meantime, we recommend:' : '在此之前,我们推荐:'}
          </h3>
          <a
            href="https://eldenring.wiki.fextralife.com/Weapons"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="block text-gold hover:text-gold-light transition-colors"
          >
            Fextralife Elden Ring Weapons Wiki →
          </a>
        </div>

        {/* Email signup CTA */}
        <div className="text-center bg-bg-raised border border-gold/20 rounded-lg p-6 md:p-8">
          <h2 className="font-gothic text-xl text-gold mb-3 tracking-gothic">
            {lang === 'en' ? 'NOTIFY ME' : '上线提醒'}
          </h2>
          <p className="text-ink-muted text-sm mb-5">
            {lang === 'en'
              ? 'Drop a note in the feedback form and we will let you know when it launches.'
              : '在反馈表单留个邮箱,上线时我们会通知你。'}
          </p>
          <Link
            href={`/${lang}/contact`}
            className="inline-block px-6 py-3 bg-gold/10 hover:bg-gold/20 border border-gold/40 hover:border-gold/60 rounded text-gold font-gothic tracking-wider transition-all"
          >
            {lang === 'en' ? 'NOTIFY ME →' : '提醒我 →'}
          </Link>
        </div>

        <div className="text-center mt-12 ornament"><span>◆</span></div>
      </div>
    </main>
  );
}
