import { forwardRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CarouselButton } from "./CarouselButton";

interface CarouselNavProps {
   activeModelName: string;
   isCenterHovered?: boolean;
   onPrev: () => void;
   onNext: () => void;
}

/**
 * CarouselNav — Active model title display + prev/next navigation buttons.
 * Title shows a diagonal arrow on hover. Animated in via GSAP ScrollTrigger.
 */
export const CarouselNav = forwardRef<HTMLDivElement, CarouselNavProps>(
   function CarouselNav(
      { activeModelName, isCenterHovered, onPrev, onNext },
      ref,
   ) {
      const [firstWord, ...restWords] = activeModelName.split(" ");
      const suffix = restWords.join(" ");

      return (
         <div
            ref={ref}
            id="carousel-nav-anim"
            className="z-20 flex flex-col items-center gap-4 md:gap-6 mt-1 opacity-0 translate-y-[150px]"
         >
            {/* Active Model Title */}
            <a
               href="#"
               className="flex items-center text-black hover:opacity-80 transition-opacity no-underline group"
               onClick={(e) => e.preventDefault()}
            >
               <h3
                  id="active-model-title"
                  className="text-4xl md:text-[42px] font-medium uppercase font-schein flex items-center tracking-wide"
               >
                  <span className="mr-4">{firstWord}</span>
                  <AnimatePresence mode="popLayout">
                     <motion.span
                        key={suffix}
                        initial={{
                           opacity: 0,
                           filter: "blur(12px)",
                           scale: 1.05,
                        }}
                        animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                        exit={{ opacity: 0, filter: "blur(12px)", scale: 0.95 }}
                        transition={{ duration: 0.7, ease: "easeInOut" }}
                        className="inline-block whitespace-nowrap"
                     >
                        {suffix}
                     </motion.span>
                  </AnimatePresence>
                  {/* Diagonal arrow — appears on hover */}
                  <svg
                     className={`w-8 h-8 md:w-12 md:h-12 ml-2 md:ml-4 text-black transition-opacity duration-300 ${
                        isCenterHovered
                           ? "opacity-100"
                           : "opacity-0 group-hover:opacity-100"
                     }`}
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="2.5"
                     strokeLinecap="square"
                     strokeLinejoin="miter"
                     aria-hidden="true"
                  >
                     <line x1="7" y1="17" x2="17" y2="7" />
                     <polyline points="7 7 17 7 17 17" />
                  </svg>
               </h3>
            </a>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-4 md:gap-6 mb-8">
               <CarouselButton
                  direction="prev"
                  onClick={onPrev}
                  ariaLabel="Previous Product"
               />
               <CarouselButton
                  direction="next"
                  onClick={onNext}
                  ariaLabel="Next Product"
               />
            </div>
         </div>
      );
   },
);
