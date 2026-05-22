import Link from 'next/link';
import { type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface Boss {
  slug: string;
  name_en: string;
  name_zh: string;
  location_en: string;
  location_zh: string;
  type: string;
  summary_en: string;
  summary_zh: string;
  difficulty: number;
}

const typeStyles: Record<string, { label_en: string; label_zh: string; classes: string }> = {
  legend: {
    label_en: 'LEGEND',
    label_zh: '传说',
    classes: 'bg-gold/10 text-gold border-gold-dim',
  },
  optional: {
    label_en: 'OPTIONAL',
    label_zh: '选择',
    classes: 'bg-danger-bg text-danger border-danger-border',
  },
  field: {
    label_en: 'FIELD',
    label_zh: '野外',
    classes: 'bg-bg-raised text-ink-muted border-edge',
  },
  dlc: {
    label_en: 'DLC',
    label_zh: 'DLC',
    classes: 'bg-dlc-bg text-dlc border-dlc-border',
  },
};

export function BossCard({ boss, locale }: { boss: Boss; locale: Locale }) {
  const name = locale === 'en' ? boss.name_en : boss.name_zh;
  const location = locale === 'en' ? boss.location_en : boss.location_zh;
  const summary = locale === 'en' ? boss.summary_en : boss.summary_zh;
  const typeStyle = typeStyles[boss.type] || typeStyles.field;
  const typeLabel = locale === 'en' ? typeStyle.label_en : typeStyle.label_zh;

  return (
    <Link
      href={`/${locale}/bosses/${boss.slug}`}
      className="block bg-bg-raised border border-edge rounded-md p-3 md:p-4 hover:border-edge-strong transition-colors group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-gothic text-sm md:text-base text-ink-primary group-hover:text-gold transition-colors mb-1 leading-snug">
            {name.toUpperCase()}
          </h3>
          <p className="text-xs text-ink-faint font-serif italic">{location}</p>
        </div>
        <span
          className={cn(
            'shrink-0 font-gothic text-[9px] px-2 py-0.5 rounded border tracking-widest whitespace-nowrap',
            typeStyle.classes
          )}
        >
          {typeLabel}
        </span>
      </div>

      <p className="text-xs md:text-sm text-ink-muted font-serif italic leading-relaxed mb-3">
        {summary}
      </p>

      {/* Difficulty indicator */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-gothic uppercase tracking-widest text-ink-faint">
          {locale === 'en' ? 'Difficulty' : '难度'}
        </span>
        <div className="flex-1 h-[3px] bg-bg-deepest rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold-dim to-danger"
            style={{ width: `${boss.difficulty * 10}%` }}
          />
        </div>
        <span className="text-[10px] font-serif text-ink-subtle">{boss.difficulty}/10</span>
      </div>
    </Link>
  );
}
