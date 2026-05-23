'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getDictionary, type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export function MobileBottomNav({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const pathname = usePathname();

  const items = [
    {
      key: 'bosses',
      href: `/${locale}/bosses`,
      label: dict.nav.bosses,
      icon: '⚔',
    },
    {
      key: 'walkthrough',
      href: `/${locale}/walkthrough`,
      label: dict.nav.walkthrough,
      icon: '❦',
    },
    {
      key: 'builds',
      href: `/${locale}/builds`,
      label: dict.nav.builds,
      icon: '✦',
    },
    {
      key: 'weapons',
      href: `/${locale}/weapons`,
      label: dict.nav.weapons,
      icon: '◆',
    },
    {
      key: 'more',
      href: `/${locale}/contact`,
      label: dict.nav.more,
      icon: '☰',
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-bg-deepest border-t border-edge z-40 grid grid-cols-5 pb-safe">
      {items.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.key}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center py-2 transition-colors',
              active
                ? 'text-gold bg-bg-raised border-t border-gold-dim'
                : 'text-ink-subtle'
            )}
          >
            <span className="text-base mb-0.5">{item.icon}</span>
            <span className="font-gothic text-[9px] uppercase tracking-widest">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
