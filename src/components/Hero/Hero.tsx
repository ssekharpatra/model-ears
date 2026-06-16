'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { HeroBanner } from './HeroBanner';
import { HeroHeadphone } from './HeroHeadphone';
import { HERO_ENTRANCE } from '@/lib/animations';

/**
 * Hero Section — Dark banner with product showcase.
 * Client component: orchestrates the Act 1 banner entrance via GSAP,
 * while children handle their own reveals via TextReveal delays.
 */
export function Hero() {
   const sectionRef = useRef<HTMLElement>(null);
   const bannerRef = useRef<HTMLDivElement>(null);

   // Act 1: Banner fade-in + subtle scale-up
   useGSAP(
      () => {
         const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
         ).matches;

         if (prefersReducedMotion) {
            // Show immediately — no animation
            gsap.set(bannerRef.current, {
               opacity: 1,
               scale: 1,
               clearProps: 'willChange',
            });
            return;
         }

         gsap.fromTo(
            bannerRef.current,
            { opacity: 0, scale: 0.97 },
            {
               opacity: 1,
               scale: 1,
               duration: HERO_ENTRANCE.bannerDur,
               delay: HERO_ENTRANCE.banner,
               ease: 'power2.out',
               // Clean up GPU layer after animation completes
               onComplete: () => {
                  if (bannerRef.current) {
                     bannerRef.current.style.willChange = 'auto';
                  }
               },
            },
         );
      },
      { scope: sectionRef },
   );

   return (
      <section
         ref={sectionRef}
         className="w-[96%] max-w-[1920px] mx-auto pt-3 md:pt-4 relative mb-8 md:mb-12 flex flex-col items-center overflow-hidden lg:overflow-visible"
      >
         <HeroBanner ref={bannerRef} />
         <HeroHeadphone />
      </section>
   );
}
