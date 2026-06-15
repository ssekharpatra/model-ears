import { HERO_TITLE_LINE1, HERO_TITLE_LINE2 } from "@/lib/constants";

/**
 * HeroTitle — Large "MODEL XRS" background text.
 * Positioned behind the headphone image (z-index layering).
 * Non-interactive, decorative only.
 */
export function HeroTitle() {
   return (
      <div className="absolute inset-0 flex items-center justify-start pl-[8%] lg:pl-[22%] pb-[9%] pointer-events-none">
         <h1
            className="text-white text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-normal leading-[0.85] text-center select-none font-schein"
            style={{ letterSpacing: "-0.02em" }}
         >
            {HERO_TITLE_LINE1}
            <br />
            {HERO_TITLE_LINE2}
         </h1>
      </div>
   );
}
