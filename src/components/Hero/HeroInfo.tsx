import { HERO_DESCRIPTION, HERO_PRICE } from "@/lib/constants";
import { HERO_ENTRANCE } from "@/lib/animations";
import { TextReveal } from "@/components/ui/TextReveal";
import { Button } from "@/components/ui/Button";

/**
 * HeroInfo — Right-aligned info panel with description, price, and CTA.
 * Positioned at bottom-right of the hero banner.
 * Act 4 of hero entrance: description → price → button cascade with staggered delays.
 */
export function HeroInfo() {
   return (
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:bottom-8 md:right-10 z-20 flex flex-col gap-3 md:gap-6 text-center md:text-right max-w-xs">
         <TextReveal
            inView={{ margin: '0px' }}
            variant="blur"
            delay={HERO_ENTRANCE.description}
            as="p"
            className="hidden md:block text-white/60 text-sm leading-normal font-semibold tracking-normal w-[248px] ml-auto font-roboto"
         >
            {HERO_DESCRIPTION}
         </TextReveal>
         <div className="flex items-center justify-center md:justify-end gap-4 md:gap-6">
            <TextReveal
               inView={{ margin: '0px' }}
               variant="blur"
               delay={HERO_ENTRANCE.price}
               as="span"
               className="text-white text-2xl font-medium tracking-tight font-saira"
            >
               {HERO_PRICE}
            </TextReveal>
            <TextReveal
               inView={{ margin: '0px' }}
               variant="blur"
               delay={HERO_ENTRANCE.button}
               as="div"
            >
               <Button>Buy Now</Button>
            </TextReveal>
         </div>
      </div>
   );
}
