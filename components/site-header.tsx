'use client';

import Link from 'next/link';
import { useState } from 'react';
import { getDictionary, type Locale } from '@/lib/i18n';
import { siteConfig } from '@/lib/site-config';
import { cn } from '@/lib/utils';

export function SiteHeader({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [open, setOpen] = useState(false);

  const navItems = [
    { key: 'bosses', href: `/${locale}/bosses`, label: dict.nav.bosses },
    { key: 'walkthrough', href: `/${locale}/walkthrough`, label: dict.nav.walkthrough },
    { key: 'builds', href: `/${locale}/builds`, label: dict.nav.builds },
    { key: 'weapons', href: `/${locale}/weapons`, label: dict.nav.weapons },
    { key: 'map', href: `/${locale}/map`, label: dict.nav.map },
  ];

  const otherLocale: Locale = locale === 'en' ? 'zh' : 'en';

  return (
    <header className="bg-bg-deepest border-b border-edge sticky top-0 z-40 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2 md:gap-3 shrink-0">
          <EldenSigil className="w-6 h-6 md:w-7 md:h-7 text-gold" />
          <span className="font-gothic text-gold text-sm md:text-lg tracking-gothic">
            {dict.site.name.toUpperCase()}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="font-gothic text-xs uppercase tracking-widest text-ink-subtle hover:text-gold px-3 py-2 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side: lang + hamburger */}
        <div className="flex items-center gap-3">
          <LangToggle currentLocale={locale} otherLocale={otherLocale} />

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="md:hidden text-ink-subtle hover:text-gold p-1"
            aria-label="Open menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {open ? (
                <path d="M6 6 L18 18 M18 6 L6 18" />
              ) : (
                <>
                  <path d="M4 7 L20 7" />
                  <path d="M4 12 L20 12" />
                  <path d="M4 17 L20 17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-bg-deepest border-t border-edge">
          <nav className="flex flex-col py-2">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-gothic text-xs uppercase tracking-widest text-ink-subtle hover:text-gold hover:bg-bg-raised px-6 py-3 border-b border-edge-subtle"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={`/${locale}/contact`}
              onClick={() => setOpen(false)}
              className="font-gothic text-xs uppercase tracking-widest text-ink-subtle hover:text-gold hover:bg-bg-raised px-6 py-3"
            >
              {dict.nav.contact}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function LangToggle({ currentLocale, otherLocale }: { currentLocale: Locale; otherLocale: Locale }) {
  return (
    <div className="inline-flex bg-bg-deepest border border-edge rounded overflow-hidden">
      <Link
        href={`/${currentLocale}`}
        className={cn(
          'px-2 py-1 text-xs font-gothic transition-colors',
          'bg-gold/10 text-gold'
        )}
      >
        {currentLocale.toUpperCase()}
      </Link>
      <Link
        href={`/${otherLocale}`}
        className="px-2 py-1 text-xs font-gothic text-ink-faint hover:text-gold transition-colors"
      >
        {otherLocale === 'zh' ? '中' : 'EN'}
      </Link>
    </div>
  );
}

export function EldenSigil({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="12" cy="12" r="10" />
      <path d="M 12 4 L 12 20" strokeWidth="0.9" />
      <path d="M 7 8 Q 12 6 17 8" strokeWidth="0.9" />
      <path d="M 6 13 Q 12 10 18 13" strokeWidth="0.9" />
      <path d="M 8 18 Q 12 16 16 18" strokeWidth="0.9" />
    </svg>
  );
}
