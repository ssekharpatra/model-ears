import { forwardRef, useImperativeHandle, useRef } from "react";
import { HERO_DESCRIPTION, HERO_PRICE } from "@/lib/constants";
import { HERO_ENTRANCE } from "@/lib/animations";
import { TextReveal } from "@/components/ui/TextReveal";
import { Button } from "@/components/ui/Button";

/** Ref handle exposing price and button elements for GSAP targeting. */
export interface HeroInfoHandle {
   price: HTMLSpanElement | null;
   button: HTMLDivElement | null;
}

/**
 * HeroInfo — Right-aligned info panel with description, price, and CTA.
 * Positioned at bottom-right of the hero banner.
 * Act 4: description word-by-word via TextReveal; price + button via parent GSAP timeline.
 */
export const HeroInfo = forwardRef<HeroInfoHandle>(function HeroInfo(_, ref) {
   const priceRef = useRef<HTMLSpanElement>(null);
   const buttonRef = useRef<HTMLDivElement>(null);

   useImperativeHandle(ref, () => ({
      get price() {
         return priceRef.current;
      },
      get button() {
         return buttonRef.current;
      },
   }));

   return (
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:bottom-8 md:right-10 z-20 flex flex-col gap-3 md:gap-6 text-center md:text-right max-w-xs">
         <TextReveal
            split="words"
            variant="blur"
            delay={HERO_ENTRANCE.description}
            stagger={0.02}
            as="p"
            inView={{ margin: "0px" }}
            className="hidden md:block text-white/60 text-sm leading-normal font-semibold tracking-normal w-[248px] ml-auto font-roboto"
         >
            {HERO_DESCRIPTION}
         </TextReveal>
         <div className="flex items-center justify-center md:justify-end gap-4 md:gap-6">
            <span
               ref={priceRef}
               className="text-white text-2xl font-medium tracking-tight font-saira"
               style={{ opacity: 0 }}
            >
               {HERO_PRICE}
            </span>
            <div ref={buttonRef} style={{ opacity: 0 }}>
               <Button>Buy Now</Button>
            </div>
         </div>
      </div>
   );
});
