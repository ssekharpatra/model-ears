'use client';

import Image from 'next/image';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * HeroHeadphone — Large headphone image that overflows the dark banner.
 * Positioned absolutely over the banner, extends above/below the clip-path.
 * Uses Next.js Image with priority for LCP optimization.
 * Implements a parallax cursor follow effect using GSAP.
 */
export function HeroHeadphone() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Create quick setters for performance
      const xTo = gsap.quickTo(imageWrapperRef.current, 'x', { duration: 0.6, ease: 'power3' });
      const yTo = gsap.quickTo(imageWrapperRef.current, 'y', { duration: 0.6, ease: 'power3' });

      const handleMouseMove = (e: MouseEvent) => {
        const { innerWidth, innerHeight } = window;
        
        // Normalize mouse coordinates to [-1, 1] range
        const xRatio = (e.clientX / innerWidth) * 2 - 1;
        const yRatio = (e.clientY / innerHeight) * 2 - 1;

        // Apply boundaries: max 30px movement
        const moveX = xRatio * 30;
        const moveY = yRatio * 30;

        xTo(moveX);
        yTo(moveY);
      };

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full top-[15px] h-[652px] pointer-events-none flex justify-center items-center z-10 overflow-visible"
    >
      <div id="hero-headphone-wrapper" className="absolute inset-0 w-full h-full">
        <div ref={imageWrapperRef} className="w-full h-full relative">
          <Image
            src="/assets/images/hero/hero-headphone.webp"
            alt="Model XRS Headphone"
            width={1143}
            height={803}
            priority
            className="absolute top-1/2 left-1/2
              -translate-x-[60%]
              -translate-y-[48%]
              h-[75%] lg:h-[125%]
              w-auto max-w-none object-contain
              pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}
