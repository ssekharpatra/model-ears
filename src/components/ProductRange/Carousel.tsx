import { forwardRef } from 'react';
import Image from 'next/image';
import { CarouselItem } from './CarouselItem';
import { useCarousel } from '@/hooks/useCarousel';

interface CarouselProps {
  carousel: ReturnType<typeof useCarousel>;
  onMouseMove: (e: MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

/**
 * Carousel — 3-item product carousel with ghost element for height stability.
 * Animated in via GSAP ScrollTrigger. 
 * Supports click navigation on side items + prev/next buttons.
 */
export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
  function Carousel({ carousel, onMouseMove, onMouseEnter, onMouseLeave }, ref) {
    const { getVisibleProducts, goPrev, goNext } = carousel;
    const visible = getVisibleProducts();

    return (
      <div
        ref={ref}
        id="carousel-container-anim"
        className="z-10 relative w-full max-w-7xl mx-auto opacity-0 translate-y-[300px]"
      >
        {/* Ghost element for steady height — prevents layout jitter */}
        <div className="w-full px-4 md:px-12 pt-16 md:pt-[8rem] pb-8 invisible pointer-events-none opacity-0 flex justify-center">
          <div className="w-[50%] md:w-[48%] flex flex-col items-center">
            <Image
              src={visible.center.image}
              alt=""
              aria-hidden="true"
              width={359}
              height={359}
              className="w-[95%] md:w-[90%] h-auto object-contain"
            />
          </div>
        </div>

        {/* Absolute Carousel Container */}
        <div
          className="absolute inset-0 w-full px-4 md:px-12 pt-16 md:pt-[8rem] pb-8 flex items-center justify-between gap-6 md:gap-[15%]"
        >
          {/* Left Product (Blurred) */}
          <CarouselItem
            product={visible.left}
            isActive={false}
            position="left"
            onClick={goPrev}
          />

          {/* Center Product (Active) */}
          <CarouselItem
            product={visible.center}
            isActive={true}
            position="center"
            onClick={() => {}}
            onMouseMove={(e) => onMouseMove(e.nativeEvent as any)}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />

          {/* Right Product (Blurred) */}
          <CarouselItem
            product={visible.right}
            isActive={false}
            position="right"
            onClick={goNext}
          />
        </div>
      </div>
    );
  }
);
