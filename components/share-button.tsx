'use client';

import { useEffect, useRef, useState } from 'react';
import { type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/**
 * Copies the current page URL to the clipboard and shows a brief confirmation.
 * Falls back to a temp-textarea + execCommand for non-secure contexts where
 * navigator.clipboard is unavailable.
 */
export function ShareButton({ locale, className }: { locale: Locale; className?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function copy() {
    const url = window.location.href;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement('textarea');
        ta.value = url;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked — silently ignore
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={locale === 'en' ? 'Copy link' : '复制链接'}
      className={cn(
        'inline-flex items-center gap-2 font-gothic text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border transition-colors',
        copied
          ? 'text-gold border-gold-dim bg-gold/10'
          : 'text-ink-subtle border-edge hover:text-gold hover:border-edge-strong',
        className
      )}
    >
      {copied ? <CheckIcon /> : <LinkIcon />}
      <span>
        {copied
          ? locale === 'en'
            ? 'Link copied'
            : '链接已复制'
          : locale === 'en'
            ? 'Share'
            : '分享'}
      </span>
    </button>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M10 13a5 5 0 0 0 7.07 0l2-2a5 5 0 0 0-7.07-7.07l-1 1" strokeLinecap="round" />
      <path d="M14 11a5 5 0 0 0-7.07 0l-2 2a5 5 0 0 0 7.07 7.07l1-1" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
