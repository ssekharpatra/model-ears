'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface CursorFollowerState {
  x: number;
  y: number;
  isVisible: boolean;
}

/**
 * Custom hook for the cursor-following tooltip.
 * Tracks mouse position and detects hover over carousel items.
 * Uses lerp (linear interpolation) for smooth natural following.
 * Optimized: rAF loop only runs while hovering + wind-down.
 */
export function useCursorFollower() {
  const [state, setState] = useState<CursorFollowerState>({
    x: 0,
    y: 0,
    isVisible: false,
  });

  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);
  const isHovering = useRef(false);

  const lerp = (start: number, end: number, factor: number) =>
    start + (end - start) * factor;

  /** Start the animation loop if not already running */
  const startLoop = useCallback(() => {
    if (rafId.current !== null) return;

    const tick = () => {
      currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, 0.15);
      currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, 0.15);

      setState({
        x: currentPos.current.x,
        y: currentPos.current.y,
        isVisible: isHovering.current,
      });

      // Keep running while hovering, or until position converges (wind-down)
      const dx = Math.abs(currentPos.current.x - targetPos.current.x);
      const dy = Math.abs(currentPos.current.y - targetPos.current.y);
      if (isHovering.current || dx > 0.5 || dy > 0.5) {
        rafId.current = requestAnimationFrame(tick);
      } else {
        rafId.current = null;
      }
    };

    rafId.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    targetPos.current.x = e.clientX;
    targetPos.current.y = e.clientY;
  }, []);

  const handleMouseEnter = useCallback(() => {
    isHovering.current = true;
    startLoop();
  }, [startLoop]);

  const handleMouseLeave = useCallback(() => {
    isHovering.current = false;
    // Loop continues for wind-down, then stops automatically
  }, []);

  return {
    ...state,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
  };
}
