import { forwardRef } from "react";
import { useMousePosition } from "@/hooks/useMousePosition";

interface InteractivePanelProps extends React.HTMLAttributes<HTMLDivElement> {
   children: React.ReactNode;
   /**
    * Optional custom radial gradient string.
    * Use var(--mouse-x) and var(--mouse-y) for the tracking center.
    */
   gradient?: string;
}

/**
 * InteractivePanel — Reusable dark container block with:
 * - Octagonal responsive clip-path
 * - Deep drop shadow
 * - Mouse-following radial gradient background
 *
 * Automatically tracks mouse position internally using `useMousePosition`.
 * Can be animated by GSAP via `forwardRef`.
 */
export const InteractivePanel = forwardRef<
   HTMLDivElement,
   InteractivePanelProps
>(function InteractivePanel(
   { children, className = "", style, gradient, ...props },
   ref,
) {
   const { handleMouseMove } = useMousePosition();

   return (
      <div
         ref={ref}
         onMouseMove={handleMouseMove}
         className={`clip-octagon drop-shadow-2xl overflow-hidden ${className}`}
         style={{
            background:
               gradient ||
               "radial-gradient(circle 800px at var(--mouse-x, 50%) var(--mouse-y, 50%), #2a1508 0%, #101010 70%, #101010 100%)",
            ...style,
         }}
         {...props}
      >
         {children}
      </div>
   );
});
