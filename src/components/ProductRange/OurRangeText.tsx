import { forwardRef } from 'react';

/**
 * OurRangeText — Giant decorative "OUR RANGE" text behind the carousel.
 * Animated in via GSAP ScrollTrigger (starts hidden, slides up).
 */
export const OurRangeText = forwardRef<HTMLHeadingElement>(
  function OurRangeText(_, ref) {
    return (
      <div className="absolute top-0 left-0 w-full flex justify-center pointer-events-none z-0 overflow-hidden">
        <h2
          ref={ref}
          id="our-range-text"
          className="text-[20vw] md:text-[15vw] lg:text-[14rem] font-bold text-light-gray uppercase tracking-[0.01em] leading-none whitespace-nowrap select-none font-schein opacity-0 translate-y-[300px]"
        >
          OUR RANGE
        </h2>
      </div>
    );
  }
);
