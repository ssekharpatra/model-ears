"use client";

import { HeroLogo } from "./HeroLogo";
import { HeroTitle } from "./HeroTitle";
import { HeroInfo } from "./HeroInfo";
import { useMousePosition } from "@/hooks/useMousePosition";

/**
 * HeroBanner — The dark container with:
 * - Octagonal clip-path (45° corner cuts)
 * - Mouse-following radial gradient
 * - Logo, title text, info panel as children
 */
export function HeroBanner() {
   const { handleMouseMove } = useMousePosition();

   return (
      <div
         id="hero-banner"
         className="w-full relative flex flex-col z-0 drop-shadow-2xl"
         onMouseMove={handleMouseMove}
         style={{
            height: "620px",
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
         <HeroLogo />
         <HeroTitle />
         <HeroInfo />
      </div>
   );
}
