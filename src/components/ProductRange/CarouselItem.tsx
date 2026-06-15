import Image from 'next/image';
import { Product } from '@/types';

interface CarouselItemProps {
  product: Product;
  isActive: boolean;
  position: 'left' | 'center' | 'right';
  onClick: () => void;
  onMouseMove?: (e: React.MouseEvent) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

/**
 * CarouselItem — Individual product in the carousel.
 * Active (center): full size, no blur, prominent, with hover gradient.
 * Inactive (sides): smaller, blurred, with NO hover gradient.
 */
export function CarouselItem({
  product,
  isActive,
  position,
  onClick,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
}: CarouselItemProps) {
  const orderClass =
    position === 'left'
      ? 'order-1'
      : position === 'center'
        ? 'order-2'
        : 'order-3';

  if (isActive) {
    return (
      <div
        className={`carousel-item is-active ${orderClass} w-[50%] md:w-[48%] relative z-20 flex flex-col items-center cursor-pointer transition-all duration-500`}
        data-title={product.name}
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <a
          href="#"
          className="relative w-full flex justify-center items-center group/link"
          onClick={(e) => e.preventDefault()}
        >
          {/* Hover gradient overlay (Only on active) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full aspect-square bg-[radial-gradient(circle,_rgba(246,115,0,0.19)_0%,_transparent_50%)] opacity-0 group-hover/link:opacity-100 transition-opacity duration-300 pointer-events-none z-0" />
          <Image
            src={product.image}
            alt={product.alt}
            width={359}
            height={359}
            className="relative z-10 w-[95%] md:w-[90%] h-auto object-contain transition-all duration-500"
          />
        </a>
      </div>
    );
  }

  return (
    <div
      className={`carousel-item ${orderClass} w-[20%] md:w-[15%] opacity-60 blur-[3px] hover:blur-none hover:opacity-100 cursor-pointer transition-all duration-500`}
      data-title={product.name}
      onClick={onClick}
    >
      <a
        href="#"
        className="relative w-full flex justify-center items-center group/link"
        onClick={(e) => e.preventDefault()}
      >
        {/* No hover gradient overlay for inactive items */}
        <Image
          src={product.image}
          alt={product.alt}
          width={400}
          height={400}
          className="relative z-10 w-full h-auto object-contain drop-shadow-md transition-all duration-500"
        />
      </a>
    </div>
  );
}
