import { HeroBanner } from "./HeroBanner";
import { HeroHeadphone } from "./HeroHeadphone";

/**
 * Hero Section — Dark banner with product showcase.
 * Server component wrapper, child components handle interactivity.
 */
export function Hero() {
   return (
      <section className="w-[96%] max-w-[1920px] mx-auto pt-3 md:pt-4 relative mb-8 md:mb-12 flex flex-col items-center overflow-hidden lg:overflow-visible">
         <HeroBanner />
         <HeroHeadphone />
      </section>
   );
}
