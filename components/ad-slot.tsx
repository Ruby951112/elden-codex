'use client';

import { useEffect, useRef } from 'react';
import { siteConfig } from '@/lib/site-config';

interface AdSlotProps {
  /**
   * Ad placement type:
   * - in-article: between content sections (best for engagement)
   * - sidebar: vertical sticky (desktop only)
   * - footer: end-of-article banner
   */
  type?: 'in-article' | 'sidebar' | 'footer';
  /** Specific ad unit slot ID from AdSense (optional, falls back to type-based default) */
  slot?: string;
  /** Hide ads in dev preview */
  className?: string;
}

/**
 * AdSense slot. Renders only when:
 *   - NEXT_PUBLIC_ADSENSE_ENABLED === 'true'
 *   - NEXT_PUBLIC_ADSENSE_CLIENT_ID is set
 *
 * Otherwise renders a subtle placeholder during dev.
 * After setting up AdSense, add the script tag once in app/layout.tsx:
 *
 *   <Script
 *     src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
 *     crossOrigin="anonymous"
 *     strategy="afterInteractive"
 *   />
 */
export function AdSlot({ type = 'in-article', slot, className }: AdSlotProps) {
  const insRef = useRef<HTMLModElement>(null);
  const { enabled, clientId } = siteConfig.monetization.adsense;

  useEffect(() => {
    if (!enabled || !clientId || !insRef.current) return;
    try {
      // @ts-expect-error AdSense global
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // adsbygoogle not loaded yet, will retry on next mount
    }
  }, [enabled, clientId]);

  // Dev mode / not configured — show subtle in-theme placeholder
  if (!enabled || !clientId) {
    return (
      <div
        className={`border border-dashed border-edge bg-bg-deepest/30 rounded-md p-6 text-center ${className || ''}`}
      >
        <div className="text-[10px] font-gothic uppercase tracking-widest text-ink-faint">
          [ AdSense slot: {type} ]
        </div>
      </div>
    );
  }

  // Real ad
  return (
    <ins
      ref={insRef}
      className={`adsbygoogle block ${className || ''}`}
      style={{ display: 'block', textAlign: 'center', minHeight: 90 }}
      data-ad-client={clientId}
      data-ad-slot={slot || getDefaultSlot(type)}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}

function getDefaultSlot(type: string): string {
  // User configures these in env once they get AdSense slots
  if (type === 'sidebar') return process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || '';
  if (type === 'footer') return process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER || '';
  return process.env.NEXT_PUBLIC_ADSENSE_SLOT_INARTICLE || '';
}
