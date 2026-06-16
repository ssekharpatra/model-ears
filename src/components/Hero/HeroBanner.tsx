"use client";

import { forwardRef, type RefObject } from "react";
import { HeroLogo } from "./HeroLogo";
import { HeroTitle } from "./HeroTitle";
import { HeroInfo, type HeroInfoHandle } from "./HeroInfo";
import { useMousePosition } from "@/hooks/useMousePosition";

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
      const { handleMouseMove } = useMousePosition();

      return (
         <div
            ref={ref}
            id="hero-banner"
            className="w-full h-[400px] md:h-[520px] lg:h-[620px] relative flex flex-col z-0 drop-shadow-2xl will-change-[transform,opacity]"
            onMouseMove={handleMouseMove}
            style={{
               // Inline opacity:0 prevents FOUC — applies before CSS/JS loads
               opacity: 0,
               background:
                  "radial-gradient(circle 800px at var(--mouse-x, 0%) var(--mouse-y, 50%), #2a1508 0%, #101010 70%, #101010 100%)",
               clipPath: `polygon(
           24px 0,
           calc(100% - 24px) 0,
           100% 24px,
           100% calc(100% - 24px),
           calc(100% - 24px) 100%,
           24px 100%,
           0 calc(100% - 24px),
           0 24px
         )`,
            }}
         >
            <HeroLogo ref={logoRef} />
            <HeroTitle />
            <HeroInfo ref={infoRef} />
         </div>
      );
   },
);
