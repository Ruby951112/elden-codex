'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { hrefFor, searchContent, type SearchCategory, type SearchItem } from '@/lib/search-index';

const CATEGORY_LABEL: Record<SearchCategory, { en: string; zh: string }> = {
  boss: { en: 'BOSS', zh: 'BOSS' },
  build: { en: 'BUILD', zh: '流派' },
  region: { en: 'REGION', zh: '区域' },
};

export function SiteSearch({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const results = useMemo(() => searchContent(query, locale), [query, locale]);

  // Global ⌘K / Ctrl+K to toggle, Escape to close.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Focus the input and lock body scroll while open; reset on close.
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      setQuery('');
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => setActive(0), [query]);
  useEffect(() => {
    itemRefs.current[active]?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const go = (item: SearchItem) => {
    setOpen(false);
    router.push(hrefFor(item, locale));
  };

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault();
      go(results[active]);
    }
  };

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={locale === 'en' ? 'Search' : '搜索'}
        className="flex items-center gap-2 rounded border border-edge bg-bg-deepest px-2 py-1 text-ink-faint hover:text-gold hover:border-edge-strong transition-colors"
      >
        <SearchIcon className="w-4 h-4" />
        <span className="hidden md:inline font-gothic text-[10px] tracking-widest">⌘K</span>
      </button>

      {/* Palette */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm pt-[12vh] px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-bg-deepest border border-edge-strong rounded-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-4 border-b border-edge">
              <SearchIcon className="w-4 h-4 text-ink-faint shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder={locale === 'en' ? 'Search bosses, builds, regions…' : '搜索 boss / 流派 / 区域…'}
                className="flex-1 bg-transparent py-3.5 text-sm text-ink-primary placeholder:text-ink-faint focus:outline-none"
              />
              <kbd className="hidden md:block font-gothic text-[10px] text-ink-faint border border-edge rounded px-1.5 py-0.5">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[55vh] overflow-y-auto py-2">
              {query.trim() === '' ? (
                <p className="px-4 py-6 text-center text-xs text-ink-faint font-serif italic">
                  {locale === 'en'
                    ? 'Type to search across all bosses, builds, and regions.'
                    : '输入以搜索全部 boss、流派和区域。'}
                </p>
              ) : results.length === 0 ? (
                <p className="px-4 py-6 text-center text-xs text-ink-faint font-serif italic">
                  {locale === 'en' ? 'No matches.' : '无匹配结果。'}
                </p>
              ) : (
                results.map((item, i) => {
                  const title = locale === 'en' ? item.title_en : item.title_zh;
                  const subtitle = locale === 'en' ? item.subtitle_en : item.subtitle_zh;
                  const isActive = i === active;
                  return (
                    <button
                      key={`${item.category}:${item.slug}`}
                      ref={(el) => {
                        itemRefs.current[i] = el;
                      }}
                      type="button"
                      onClick={() => go(item)}
                      onMouseMove={() => setActive(i)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                        isActive ? 'bg-gold/10' : 'hover:bg-bg-raised'
                      )}
                    >
                      <span
                        className={cn(
                          'shrink-0 font-gothic text-[9px] px-1.5 py-0.5 rounded border tracking-widest w-14 text-center',
                          item.category === 'boss'
                            ? 'bg-gold/10 text-gold border-gold-dim'
                            : item.category === 'build'
                              ? 'bg-bg-raised text-ink-muted border-edge'
                              : 'bg-dlc-bg text-dlc border-dlc-border'
                        )}
                      >
                        {locale === 'en' ? CATEGORY_LABEL[item.category].en : CATEGORY_LABEL[item.category].zh}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-ink-primary">{title}</span>
                        <span className="block truncate text-xs text-ink-faint font-serif italic">{subtitle}</span>
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer hint */}
            <div className="flex items-center justify-end gap-3 px-4 py-2 border-t border-edge text-[10px] text-ink-faint font-gothic tracking-widest">
              <span>↑↓ {locale === 'en' ? 'NAVIGATE' : '选择'}</span>
              <span>↵ {locale === 'en' ? 'OPEN' : '跳转'}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}
