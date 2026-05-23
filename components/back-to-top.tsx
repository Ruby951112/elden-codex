'use client';

import { useEffect, useState } from 'react';

/**
 * Floating "return to top" control that fades in after the reader scrolls past
 * the first viewport. On mobile it sits above the fixed bottom nav (bottom-24);
 * on desktop it tucks into the bottom-right corner. Honors reduced-motion.
 */
export function BackToTop({ label }: { label: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={scrollTop}
      aria-label={label}
      title={label}
      className={`fixed right-4 bottom-24 md:bottom-6 z-40 h-11 w-11 flex items-center justify-center rounded-full
        bg-bg-raised border border-edge-strong text-gold text-lg shadow-lg
        transition-all duration-300 hover:border-gold hover:bg-bg-deepest
        ${visible ? 'opacity-90 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}
    >
      ↑
    </button>
  );
}
