'use client';

import Image from 'next/image';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { HERO_ENTRANCE } from '@/lib/animations';

/**
 * HeroHeadphone — Large headphone image that overflows the dark banner.
 * Positioned absolutely over the banner, extends above/below the clip-path.
 * Uses Next.js Image with priority for LCP optimization.
 *
 * Act 5 of hero entrance: drops from above with scale-up (the climax).
 * After entrance completes, parallax cursor-follow effect activates.
 */
export function HeroHeadphone() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(imageWrapperRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          clearProps: 'willChange',
        });
        return;
      }

      // ── Act 5: Headphone entrance — drop + fade + scale simultaneously ──
      gsap.fromTo(
        imageWrapperRef.current,
        { opacity: 0, y: -80, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: HERO_ENTRANCE.headphoneDur,
          delay: HERO_ENTRANCE.headphone,
          ease: 'power3.out',
          onComplete: () => {
            if (imageWrapperRef.current) {
              imageWrapperRef.current.style.willChange = 'transform';
            }
            initParallax();
          },
        },
      );

      function initParallax() {
        const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
        if (isTouchDevice) return;

        // Create quick setters for performance — batches into a single rAF
        const xTo = gsap.quickTo(imageWrapperRef.current, 'x', {
          duration: 0.6,
          ease: 'power3',
        });
        const yTo = gsap.quickTo(imageWrapperRef.current, 'y', {
          duration: 0.6,
          ease: 'power3',
        });

        const handleMouseMove = (e: MouseEvent) => {
          const { innerWidth, innerHeight } = window;

          // Normalize mouse coordinates to [-1, 1] range
          const xRatio = (e.clientX / innerWidth) * 2 - 1;
          const yRatio = (e.clientY / innerHeight) * 2 - 1;

          // Apply boundaries: max 30px movement
          xTo(xRatio * 30);
          yTo(yRatio * 30);
        };

        window.addEventListener('mousemove', handleMouseMove);
      }
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full top-[15px] h-[420px] md:h-[540px] lg:h-[652px] pointer-events-none flex justify-center items-center z-10 overflow-visible"
    >
      <div
        id="hero-headphone-wrapper"
        className="absolute inset-0 w-full h-full"
      >
        <div
          ref={imageWrapperRef}
          className="w-full h-full relative will-change-[transform,opacity]"
          style={{ opacity: 0 }}
        >
          {/* Mobile: full headphone image */}
          <Image
            src="/assets/images/hero/hero-headphone-full.webp"
            alt="Model XRS Headphone"
            width={1143}
            height={803}
            priority
            sizes="75vw"
            className="md:hidden absolute top-1/2 left-1/2
              -translate-x-[50%]
              -translate-y-[50%]
              h-[70%]
              w-auto max-w-none object-contain
              pointer-events-none"
          />
          {/* Desktop: cropped headphone image */}
          <Image
            src="/assets/images/hero/hero-headphone.webp"
            alt="Model XRS Headphone"
            width={1143}
            height={803}
            priority
            sizes="(max-width: 1024px) 75vw, 50vw"
            className="hidden md:block absolute top-1/2 left-1/2
              md:-translate-x-[55%] lg:-translate-x-[60%]
              md:-translate-y-[48%]
              md:h-[85%] lg:h-[125%]
              w-auto max-w-none object-contain
              pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}
