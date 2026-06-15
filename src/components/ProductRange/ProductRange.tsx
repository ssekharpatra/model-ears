'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { PRODUCTS } from '@/lib/constants';
import { ANIM_PRESETS, SCROLL_TRIGGER_DEFAULTS } from '@/lib/animations';
import { useCarousel } from '@/hooks/useCarousel';
import { useCursorFollower } from '@/hooks/useCursorFollower';
import { ProductDescription } from './ProductDescription';
import { OurRangeText } from './OurRangeText';
import { Carousel } from './Carousel';
import { CarouselNav } from './CarouselNav';
import { CursorFollower } from './CursorFollower';

gsap.registerPlugin(ScrollTrigger);

/**
 * ProductRange — Second section with descriptive text,
 * "OUR RANGE" background decoration, product carousel, and cursor tooltip.
 * Client component for carousel state + GSAP scroll animations.
 */
export function ProductRange() {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselWrapperRef = useRef<HTMLDivElement>(null);
  const ourRangeRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselNavRef = useRef<HTMLDivElement>(null);

  const carousel = useCarousel(PRODUCTS);
  const cursorFollower = useCursorFollower();
  
  // State to track if the centered active product is being hovered
  const [isCenterHovered, setIsCenterHovered] = useState(false);
  
  // Ref-based animation lock — avoids stale setTimeout issues
  const isAnimatingRef = useRef(false);

  const handlePrev = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    carousel.goPrev();
    setTimeout(() => { isAnimatingRef.current = false; }, 500);
  }, [carousel]);

  const handleNext = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    carousel.goNext();
    setTimeout(() => { isAnimatingRef.current = false; }, 500);
  }, [carousel]);

  // Keyboard arrow key navigation for the carousel
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    section.addEventListener('keydown', handleKeyDown);
    return () => section.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Scroll-triggered animations using useGSAP (never useEffect)
  useGSAP(
    () => {
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (prefersReducedMotion) {
        // Show elements immediately without animation
        gsap.set([ourRangeRef.current, carouselRef.current, carouselNavRef.current], {
          opacity: 1,
          y: 0,
        });
        return;
      }

      // 1. "OUR RANGE" background text rises majestically when it enters the viewport
      gsap.fromTo(
        ourRangeRef.current,
        ANIM_PRESETS.fadeInUp.from,
        { 
          ...ANIM_PRESETS.fadeInUp.to,
          scrollTrigger: {
            trigger: carouselWrapperRef.current,
            ...SCROLL_TRIGGER_DEFAULTS,
          }
        }
      );

      // 2. All products and Navigation Title glide up together when scrolled deeper
      const act2Tl = gsap.timeline({
        scrollTrigger: {
          trigger: carouselWrapperRef.current,
          start: 'top 50%',
          toggleActions: SCROLL_TRIGGER_DEFAULTS.toggleActions,
        }
      });
      
      act2Tl.fromTo(carouselRef.current, 
        ANIM_PRESETS.fadeInUpSmall.from, 
        { ...ANIM_PRESETS.fadeInUpSmall.to, duration: 1 }, 0)
      .fromTo(carouselNavRef.current, 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.2
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="product-range-section"
      aria-label="Product Range"
      tabIndex={-1}
      className="w-full max-w-[1400px] mx-auto overflow-hidden relative flex flex-col items-center bg-white pt-6 md:pt-12 outline-none"
    >
      <ProductDescription />

      <div ref={carouselWrapperRef} className="relative w-full flex flex-col items-center mt-8 md:mt-12">
        <OurRangeText ref={ourRangeRef} />

        <Carousel
          ref={carouselRef}
          carousel={carousel}
          onPrev={handlePrev}
          onNext={handleNext}
          onMouseMove={cursorFollower.handleMouseMove}
          onMouseEnter={() => {
            cursorFollower.handleMouseEnter();
            setIsCenterHovered(true);
          }}
          onMouseLeave={() => {
            cursorFollower.handleMouseLeave();
            setIsCenterHovered(false);
          }}
        />
      </div>

      <CarouselNav
        ref={carouselNavRef}
        activeModelName={carousel.getVisibleProducts().center.name}
        isCenterHovered={isCenterHovered}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      <CursorFollower
        x={cursorFollower.x}
        y={cursorFollower.y}
        isVisible={cursorFollower.isVisible}
      />
    </section>
  );
}

