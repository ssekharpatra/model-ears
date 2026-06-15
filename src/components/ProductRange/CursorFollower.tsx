import { CURSOR_TOOLTIP_TEXT } from '@/lib/constants';

interface CursorFollowerProps {
  x: number;
  y: number;
  isVisible: boolean;
}

/**
 * CursorFollower — Fixed-position orange tooltip that follows the mouse
 * when hovering over carousel product items.
 * Contains horizontally-scrolling marquee text.
 */
export function CursorFollower({ x, y, isVisible }: CursorFollowerProps) {
  return (
    <div
      id="follower-tooltip"
      className="fixed top-0 left-0 pointer-events-none z-[100] bg-brand-orange text-white text-[10px] md:text-xs h-7 md:h-8 rounded-full transition-opacity duration-300 font-semibold tracking-wide shadow-md flex items-center overflow-hidden w-28 md:w-36 uppercase font-schein"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: `translate(${x + 14}px, ${y + 14}px)`,
      }}
    >
      <div className="flex whitespace-nowrap w-max animate-marquee-lr items-center">
        <span className="pr-2 whitespace-nowrap">
          {CURSOR_TOOLTIP_TEXT.repeat(3)}
        </span>
        <span className="pr-2 whitespace-nowrap">
          {CURSOR_TOOLTIP_TEXT.repeat(3)}
        </span>
      </div>
    </div>
  );
}
