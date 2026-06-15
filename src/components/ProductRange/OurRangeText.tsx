import { forwardRef } from 'react';

/**
 * OurRangeText — Giant decorative "OUR RANGE" text behind the carousel.
 * NOT a heading — purely decorative, hidden from screen readers.
 * Animated in via GSAP ScrollTrigger (starts hidden, slides up).
 */
export const OurRangeText = forwardRef<HTMLDivElement>(
  function OurRangeText(_, ref) {
    return (
      <div className="absolute top-0 left-0 w-full flex justify-center pointer-events-none z-0 overflow-hidden">
        <div
          ref={ref}
          id="our-range-text"
          aria-hidden="true"
          role="presentation"
          className="text-[20vw] md:text-[15vw] lg:text-[14rem] font-bold text-light-gray uppercase tracking-[0.01em] leading-none whitespace-nowrap select-none font-schein opacity-0 translate-y-[300px]"
        >
          OUR RANGE
        </div>
      </div>
    );
  }
);

