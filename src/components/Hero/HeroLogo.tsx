import { BRAND_NAME } from '@/lib/constants';
import { HERO_ENTRANCE } from '@/lib/animations';
import { TextReveal } from '@/components/ui/TextReveal';

/**
 * HeroLogo — Crescent moon SVG icon + "MODEL EARS" brand name.
 * Inline SVG for pixel-perfect rendering at any size.
 * Act 2 of hero entrance: blur-reveals at 0.3s delay.
 */
export function HeroLogo() {
  return (
    <div className="w-full flex justify-center items-center pt-10 z-20">
      <TextReveal
        inView={{ margin: '0px' }}
        variant="blur"
        delay={HERO_ENTRANCE.logo}
        as="div"
        className="flex items-center gap-4"
      >
        {/* Crescent moon logo — inline SVG */}
        <svg
          width="16"
          height="18"
          viewBox="0 0 16 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="h-[18px] w-auto"
        >
          <path
            d="M13.5 10.5C13.5 14.366 10.366 17.5 6.5 17.5C3.634 17.5 1.17 15.755 0.15 13.3C1.1 14.35 2.5 15 4 15C7.314 15 10 12.314 10 9C10 5.686 7.314 3 4 3C2.5 3 1.1 3.65 0.15 4.7C1.17 2.245 3.634 0.5 6.5 0.5C10.366 0.5 13.5 3.634 13.5 7.5"
            fill="white"
          />
        </svg>
        <span className="text-white font-normal text-sm uppercase tracking-[0.15em] font-schein">
          {BRAND_NAME}
        </span>
      </TextReveal>
    </div>
  );
}
