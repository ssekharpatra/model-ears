import { HERO_TITLE_LINE1, HERO_TITLE_LINE2 } from "@/lib/constants";
import { HERO_ENTRANCE } from "@/lib/animations";
import { TextReveal } from "@/components/ui/TextReveal";

/**
 * HeroTitle — Large "MODEL XRS" background text.
 * Positioned behind the headphone image (z-index layering).
 * Act 3 of hero entrance: word-by-word blur reveal via GSAP SplitText.
 */
export function HeroTitle() {
   return (
      <div className="absolute inset-0 flex items-center justify-center md:justify-start pl-0 md:pl-[8%] lg:pl-[22%] pb-[15%] md:pb-[9%] pointer-events-none">
         <TextReveal
            split="words"
            variant="blur"
            delay={HERO_ENTRANCE.titleWord1}
            stagger={0.15}
            as="h1"
            inView={{ margin: '0px' }}
            className="text-white text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal leading-[0.85] text-center select-none font-schein"
            style={{ letterSpacing: "-0.02em" }}
         >
            {HERO_TITLE_LINE1}
            <br />
            {HERO_TITLE_LINE2}
         </TextReveal>
      </div>
   );
}
