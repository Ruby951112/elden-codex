import Link from 'next/link';

export interface ArticleNavLink {
  href: string;
  /** Small overline label, e.g. "Previous" / "上一篇". */
  kicker: string;
  /** The destination's title. */
  title: string;
}

/**
 * End-of-article continuation: prev/next cards so a reader who finishes one
 * guide is handed straight to the adjacent one instead of dead-ending at the
 * footer. Server-rendered, zero client JS. Single column on mobile, two on ≥sm.
 */
export function ArticleNav({ prev, next }: { prev?: ArticleNavLink; next?: ArticleNavLink }) {
  if (!prev && !next) return null;

  return (
    <nav className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-14">
      {prev ? (
        <Link
          href={prev.href}
          className="group flex flex-col gap-1 bg-bg-raised border border-edge rounded-md p-4 transition-colors hover:border-gold-dim"
        >
          <span className="text-[10px] font-gothic uppercase tracking-widest text-ink-faint group-hover:text-gold-dim">
            ‹ {prev.kicker}
          </span>
          <span className="font-serif text-sm text-ink-primary group-hover:text-gold">{prev.title}</span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group flex flex-col gap-1 items-end text-right bg-bg-raised border border-edge rounded-md p-4 transition-colors hover:border-gold-dim"
        >
          <span className="text-[10px] font-gothic uppercase tracking-widest text-ink-faint group-hover:text-gold-dim">
            {next.kicker} ›
          </span>
          <span className="font-serif text-sm text-ink-primary group-hover:text-gold">{next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
