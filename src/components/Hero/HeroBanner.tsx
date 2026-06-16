"use client";

import { forwardRef, type RefObject } from "react";
import { HeroLogo } from "./HeroLogo";
import { HeroTitle } from "./HeroTitle";
import { HeroInfo, type HeroInfoHandle } from "./HeroInfo";
import { InteractivePanel } from "@/components/ui/InteractivePanel";
interface HeroBannerProps {
   /** Ref forwarded to the HeroLogo container for GSAP targeting */
   logoRef: RefObject<HTMLDivElement | null>;
   /** Ref forwarded to HeroInfo for GSAP targeting of price/button */
   infoRef: RefObject<HeroInfoHandle | null>;
}

/**
 * HeroBanner — The dark container with:
 * - Octagonal clip-path (45° corner cuts)
 * - Mouse-following radial gradient
 * - Logo, title text, info panel as children
 *
 * Starts hidden (opacity: 0 inline) to prevent FOUC.
 * Parent animates it in via GSAP.
 */
export const HeroBanner = forwardRef<HTMLDivElement, HeroBannerProps>(
   function HeroBanner({ logoRef, infoRef }, ref) {
      return (
         <InteractivePanel
            ref={ref}
            id="hero-banner"
            className="w-full h-[400px] md:h-[520px] lg:h-[620px] relative flex flex-col z-0 will-change-[transform,opacity]"
            style={{
               // Inline opacity:0 prevents FOUC — applies before CSS/JS loads
               opacity: 0,
            }}
            gradient="radial-gradient(circle 800px at var(--mouse-x, 0%) var(--mouse-y, 50%), #2a1508 0%, #101010 70%, #101010 100%)"
         >
            <HeroLogo ref={logoRef} />
            <HeroTitle />
            <HeroInfo ref={infoRef} />
         </InteractivePanel>
      );
   },
);
