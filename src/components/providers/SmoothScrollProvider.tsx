'use client';

import { ReactLenis } from 'lenis/react';
import { useEffect, useRef, useSyncExternalStore } from 'react';
import { gsap } from 'gsap';

/** Subscribe to the prefers-reduced-motion media query. */
function subscribeToReducedMotion(callback: () => void) {
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Server snapshot — assume no reduced motion preference during SSR. */
function getServerSnapshot() {
  return false;
}

/**
 * SmoothScrollProvider — Global Lenis smooth scroll wrapper.
 *
 * Architecture:
 * - Disables Lenis's internal RAF loop (`autoRaf: false`)
 * - Drives Lenis updates via GSAP's ticker → single unified animation loop
 * - This eliminates the 1–2 frame jitter caused by dual RAF loops
 * - Respects `prefers-reduced-motion` — falls back to native scroll
 */
export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<React.ComponentRef<typeof ReactLenis>>(null);

  // React 19 idiomatic way to read external browser state (no setState-in-effect)
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerSnapshot,
  );

  // Sync Lenis with GSAP ticker (only when smooth scroll is active)
  useEffect(() => {
    if (prefersReducedMotion) return;

    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => gsap.ticker.remove(update);
  }, [prefersReducedMotion]);

  // When reduced motion is preferred, skip Lenis entirely → native scroll
  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        lerp: 0.1,
        duration: 1.2,
        autoRaf: false,
        syncTouch: true,
        touchMultiplier: 2,
      }}
    >
      {children}
    </ReactLenis>
  );
}
