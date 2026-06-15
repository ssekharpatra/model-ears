import { HERO_DESCRIPTION, HERO_PRICE } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

/**
 * HeroInfo — Right-aligned info panel with description, price, and CTA.
 * Positioned at bottom-right of the hero banner.
 */
export function HeroInfo() {
   return (
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:bottom-8 md:right-10 z-20 flex flex-col gap-3 md:gap-6 text-center md:text-right max-w-xs">
         <p className="hidden md:block text-text-gray text-sm leading-normal font-semibold tracking-normal w-[248px] ml-auto font-roboto">
            {HERO_DESCRIPTION}
         </p>
         <div className="flex items-center justify-center md:justify-end gap-4 md:gap-6">
            <span className="text-white text-2xl font-medium tracking-tight font-saira">
               {HERO_PRICE}
            </span>
            <Button>Buy Now</Button>
         </div>
      </div>
   );
}
