'use client';

import { useEffect, useState } from 'react';

/**
 * Thin matte-gold bar pinned to the very top (above the sticky header at z-40)
 * that fills as the reader scrolls through a long article. Desktop + mobile.
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const scrollable = el.scrollHeight - el.clientHeight;
      setProgress(scrollable > 0 ? Math.min(100, (el.scrollTop / scrollable) * 100) : 0);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-0.5 z-50 pointer-events-none" aria-hidden="true">
      <div className="h-full bg-gold" style={{ width: `${progress}%` }} />
    </div>
  );
}
