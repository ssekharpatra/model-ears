'use client';

import { useState, useCallback } from 'react';
import { Product, VisibleProducts } from '@/types';

/**
 * Custom hook for circular carousel state management.
 * Supports prev/next navigation and direct item selection.
 */
export function useCarousel(products: Product[]) {
  const [activeIndex, setActiveIndex] = useState(0);
  const length = products.length;

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % length);
  }, [length]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + length) % length);
  }, [length]);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(((index % length) + length) % length);
    },
    [length]
  );

  const getVisibleProducts = useCallback((): VisibleProducts => {
    return {
      left: products[(activeIndex - 1 + length) % length],
      center: products[activeIndex],
      right: products[(activeIndex + 1) % length],
    };
  }, [activeIndex, products, length]);

  /** Get the actual index for a side item so goTo can be called */
  const getLeftIndex = useCallback(
    () => (activeIndex - 1 + length) % length,
    [activeIndex, length]
  );

  const getRightIndex = useCallback(
    () => (activeIndex + 1) % length,
    [activeIndex, length]
  );

  return {
    activeIndex,
    getVisibleProducts,
    goNext,
    goPrev,
    goTo,
    getLeftIndex,
    getRightIndex,
  };
}
