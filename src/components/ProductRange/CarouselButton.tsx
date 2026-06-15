/**
 * CarouselButton — Reusable circular arrow button for carousel navigation.
 * Custom inline SVG matching the reference design:
 * orange-outlined circle with chevron arrow inside.
 * Scalable and customizable for future use.
 */
interface CarouselButtonProps {
  direction: 'prev' | 'next';
  onClick: () => void;
  ariaLabel: string;
}

export function CarouselButton({
  direction,
  onClick,
  ariaLabel,
}: CarouselButtonProps) {
  const isNext = direction === 'next';

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="flex items-center justify-center w-10 h-10 cursor-pointer hover:opacity-70 active:scale-95 transition-all duration-200 bg-transparent border-none p-0"
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={isNext ? '' : 'rotate-180'}
      >
        {/* Circle outline */}
        <circle
          cx="20"
          cy="20"
          r="18.5"
          stroke="#F67300"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Chevron arrow */}
        <polyline
          points="17,13 24,20 17,27"
          stroke="#F67300"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </button>
  );
}
