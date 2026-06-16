'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { HeroBanner } from './HeroBanner';
import { HeroHeadphone } from './HeroHeadphone';
import { type HeroInfoHandle } from './HeroInfo';
import { HERO_ENTRANCE } from '@/lib/animations';

/**
 * Hero Section — Dark banner with product showcase.
 * Client component: orchestrates the full entrance sequence via one GSAP timeline.
 * Acts 1 (banner), 2 (logo), 5/6 (price/button) are GSAP-driven here.
 * Acts 3 (title) and 4 (description) use self-managed TextReveal components.
 * Act 7 (headphone) is self-managed in HeroHeadphone.
 */
export function Hero() {
   const sectionRef = useRef<HTMLElement>(null);
   const bannerRef = useRef<HTMLDivElement>(null);
   const logoRef = useRef<HTMLDivElement>(null);
   const infoRef = useRef<HeroInfoHandle>(null);

   useGSAP(
      () => {
         const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
         ).matches;

         if (prefersReducedMotion) {
            gsap.set(
               [bannerRef.current, logoRef.current, infoRef.current?.price, infoRef.current?.button],
               { opacity: 1, scale: 1, clearProps: 'willChange' },
            );
            return;
         }

         const tl = gsap.timeline({
            onComplete: () => {
               // Clean up GPU layers after full sequence completes
               if (bannerRef.current) bannerRef.current.style.willChange = 'auto';
            },
         });

         // Act 1: Banner fade-in + subtle scale-up
         tl.fromTo(
            bannerRef.current,
            { opacity: 0, scale: 0.97 },
            {
               opacity: 1,
               scale: 1,
               duration: HERO_ENTRANCE.bannerDur,
               ease: 'power2.out',
            },
            HERO_ENTRANCE.banner,
         );

         // Act 2: Logo blur reveal
         tl.fromTo(
            logoRef.current,
            { opacity: 0, filter: 'blur(8px)' },
            {
               opacity: 1,
               filter: 'blur(0px)',
               duration: 0.6,
               ease: 'power3.out',
            },
            HERO_ENTRANCE.logo,
         );

         // Act 5: Price blur reveal
         if (infoRef.current?.price) {
            tl.fromTo(
               infoRef.current.price,
               { opacity: 0, filter: 'blur(8px)' },
               {
                  opacity: 1,
                  filter: 'blur(0px)',
                  duration: 0.6,
                  ease: 'power3.out',
               },
               HERO_ENTRANCE.price,
            );
         }

         // Act 6: Button blur reveal
         if (infoRef.current?.button) {
            tl.fromTo(
               infoRef.current.button,
               { opacity: 0, filter: 'blur(8px)' },
               {
                  opacity: 1,
                  filter: 'blur(0px)',
                  duration: 0.6,
                  ease: 'power3.out',
               },
               HERO_ENTRANCE.button,
            );
         }
      },
      { scope: sectionRef },
   );

   return (
      <section
         ref={sectionRef}
         className="w-[96%] max-w-[1920px] mx-auto pt-3 md:pt-4 relative mb-8 md:mb-12 flex flex-col items-center overflow-hidden lg:overflow-visible"
      >
         <HeroBanner ref={bannerRef} logoRef={logoRef} infoRef={infoRef} />
         <HeroHeadphone />
      </section>
   );
}
