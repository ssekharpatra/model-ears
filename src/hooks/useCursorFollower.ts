'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface CursorFollowerState {
  x: number;
  y: number;
  isVisible: boolean;
}

/**
 * Custom hook for the cursor-following tooltip.
 * Tracks global mouse position and detects hover over carousel items.
 * Uses lerp (linear interpolation) for smooth natural following.
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

  const animate = useCallback(() => {
    currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, 0.15);
    currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, 0.15);

    setState({
      x: currentPos.current.x,
      y: currentPos.current.y,
      isVisible: isHovering.current,
    });

    rafId.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafId.current = requestAnimationFrame(animate);
    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [animate]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    targetPos.current.x = e.clientX;
    targetPos.current.y = e.clientY;
  }, []);

  const handleMouseEnter = useCallback(() => {
    isHovering.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHovering.current = false;
  }, []);

  return {
    ...state,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
  };
}
