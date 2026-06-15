'use client';

import { useRef, useState } from 'react';
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
  const ourRangeRef = useRef<HTMLHeadingElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselNavRef = useRef<HTMLDivElement>(null);

  const carousel = useCarousel(PRODUCTS);
  const cursorFollower = useCursorFollower();
  
  // State to track if the centered active product is being hovered
  const [isCenterHovered, setIsCenterHovered] = useState(false);

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

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          ...SCROLL_TRIGGER_DEFAULTS,
        },
      });

      // 1. "OUR RANGE" text slides up
      tl.fromTo(
        ourRangeRef.current,
        ANIM_PRESETS.fadeInUp.from,
        ANIM_PRESETS.fadeInUp.to
      );

      // 2. Carousel container slides up (staggered)
      tl.fromTo(
        carouselRef.current,
        ANIM_PRESETS.fadeInUp.from,
        ANIM_PRESETS.fadeInUp.to,
        '-=0.7'
      );

      // 3. Carousel nav slides up (smaller distance)
      tl.fromTo(
        carouselNavRef.current,
        ANIM_PRESETS.fadeInUpSmall.from,
        ANIM_PRESETS.fadeInUpSmall.to,
        '-=0.5'
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="product-range-section"
      className="w-full max-w-[1400px] mx-auto overflow-hidden relative flex flex-col items-center bg-white pt-6 md:pt-12"
    >
      <ProductDescription />

      <div className="relative w-full flex flex-col items-center mt-8 md:mt-12">
        <OurRangeText ref={ourRangeRef} />

        <Carousel
          ref={carouselRef}
          carousel={carousel}
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
        onPrev={carousel.goPrev}
        onNext={carousel.goNext}
      />

      <CursorFollower
        x={cursorFollower.x}
        y={cursorFollower.y}
        isVisible={cursorFollower.isVisible}
      />
    </section>
  );
}
