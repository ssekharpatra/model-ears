'use client';

import { useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook to track mouse position on an element
 * and update CSS custom properties for the radial gradient.
 * Uses requestAnimationFrame for smooth 60fps updates.
 */
export function useMousePosition() {
  const rafId = useRef<number | null>(null);

  // Cleanup pending rAF on unmount
  useEffect(() => {
    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = e.currentTarget;

      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }

      rafId.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty('--mouse-x', `${x}%`);
        el.style.setProperty('--mouse-y', `${y}%`);
        rafId.current = null;
      });
    },
    []
  );

  return { handleMouseMove };
}
