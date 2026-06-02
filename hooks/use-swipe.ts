'use client';

import { useEffect, useRef } from 'react';

export function useSwipe(onLeft?: () => void, onRight?: () => void, minDistance = 60) {
  const x = useRef(0);
  useEffect(() => {
    const start = (event: TouchEvent) => { x.current = event.touches[0].clientX; };
    const end = (event: TouchEvent) => {
      const diff = event.changedTouches[0].clientX - x.current;
      if (diff > minDistance) onRight?.();
      if (diff < -minDistance) onLeft?.();
    };
    window.addEventListener('touchstart', start, { passive: true });
    window.addEventListener('touchend', end, { passive: true });
    return () => {
      window.removeEventListener('touchstart', start);
      window.removeEventListener('touchend', end);
    };
  }, [onLeft, onRight, minDistance]);
}
