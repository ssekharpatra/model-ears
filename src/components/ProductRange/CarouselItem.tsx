import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product } from '@/types';

const MotionImage = motion.create(Image);

interface CarouselItemProps {
  product: Product;
  isActive: boolean;
  onClick: () => void;
  onMouseMove?: (e: React.MouseEvent) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

/**
 * CarouselItem — Individual product in the carousel.
 * Uses framer-motion for FLIP animations across layout changes.
 */
export function CarouselItem({
  product,
  isActive,
  onClick,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
}: CarouselItemProps) {
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isActive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <motion.div
      layout
      animate={{
        opacity: isActive ? 1 : 0.6,
        filter: isActive ? 'blur(0px)' : 'blur(3px)',
      }}
      whileHover={{
        opacity: 1,
        filter: 'blur(0px)',
      }}
      transition={{ 
        layout: { type: "tween", duration: 0.5, ease: "easeInOut" },
        default: { type: "tween", duration: 0.4, ease: "easeInOut" }
      }}
      className={`carousel-item relative flex flex-col items-center ${
        isActive 
          ? 'z-20 cursor-default is-active w-[55%] sm:w-[50%] md:w-[48%]' 
          : 'cursor-pointer w-[18%] sm:w-[20%] md:w-[15%]'
      }`}
      data-title={product.name}
      onClick={!isActive ? onClick : undefined}
      onMouseMove={isActive ? onMouseMove : undefined}
      onMouseEnter={isActive ? onMouseEnter : undefined}
      onMouseLeave={isActive ? onMouseLeave : undefined}
      role={!isActive ? "button" : "group"}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-current={isActive ? "true" : "false"}
      aria-label={product.name}
    >
      <a
        href="#"
        className="relative w-full flex justify-center items-center group/link outline-none"
        onClick={(e) => e.preventDefault()}
        tabIndex={-1}
        aria-hidden={!isActive}
      >
        {isActive && (
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full aspect-square bg-[radial-gradient(circle,_rgba(246,115,0,0.19)_0%,_transparent_50%)] opacity-0 group-hover/link:opacity-100 transition-opacity duration-700 ease-in-out pointer-events-none z-0" 
          />
        )}
        <MotionImage
          layout
          transition={{ layout: { type: "tween", duration: 0.5, ease: "easeInOut" } }}
          src={product.image}
          alt={product.alt}
          width={400}
          height={400}
          sizes={isActive ? "(max-width: 768px) 50vw, 48vw" : "(max-width: 768px) 20vw, 15vw"}
          className={`relative z-10 h-auto object-contain drop-shadow-md ${
            isActive ? 'w-[95%] md:w-[90%]' : 'w-full'
          }`}
        />
      </a>
    </motion.div>
  );
}
