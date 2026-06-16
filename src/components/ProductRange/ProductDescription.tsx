import { HERO_DESCRIPTION } from "@/lib/constants";
import { TextReveal } from "@/components/ui/TextReveal";

/**
 * ProductDescription — Centered paragraph text between Hero and Carousel.
 * Word-by-word blur reveal on scroll — draws the eye downward toward the carousel.
 */
export function ProductDescription() {
   return (
      <div className="z-20 relative px-6 md:px-4 text-center mt-8 md:mt-24 mb-6 md:mb-12">
         <TextReveal
            split="words"
            variant="blur"
            stagger={0.02}
            as="p"
            className="text-sm md:text-base text-text-gray font-medium leading-[1.3] max-w-3xl mx-auto uppercase tracking-wide font-schein"
         >
            {HERO_DESCRIPTION}
         </TextReveal>
      </div>
   );
}
