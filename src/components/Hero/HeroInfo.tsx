import { HERO_DESCRIPTION, HERO_PRICE } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

/**
 * HeroInfo — Right-aligned info panel with description, price, and CTA.
 * Positioned at bottom-right of the hero banner.
 */
export function HeroInfo() {
   return (
      <div className="absolute bottom-8 right-10 z-20 flex flex-col gap-6 text-right max-w-xs">
         <p className="text-text-gray text-sm leading-normal font-semibold tracking-normal w-[248px] ml-auto font-roboto">
            {HERO_DESCRIPTION}
         </p>
         <div className="flex items-center justify-end gap-6">
            <span className="text-white text-2xl font-medium tracking-tight font-saira">
               {HERO_PRICE}
            </span>
            <Button>Buy Now</Button>
         </div>
      </div>
   );
}
