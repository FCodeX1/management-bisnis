'use client';

import { useEffect, useRef } from 'react';

export function usePullToRefresh(onRefresh: () => void, threshold = 72) {
  const startY = useRef(0);
  useEffect(() => {
    const start = (event: TouchEvent) => { if (window.scrollY === 0) startY.current = event.touches[0].clientY; };
    const end = (event: TouchEvent) => {
      const diff = event.changedTouches[0].clientY - startY.current;
      if (window.scrollY === 0 && diff > threshold) onRefresh();
    };
    window.addEventListener('touchstart', start, { passive: true });
    window.addEventListener('touchend', end, { passive: true });
    return () => {
      window.removeEventListener('touchstart', start);
      window.removeEventListener('touchend', end);
    };
  }, [onRefresh, threshold]);
}
