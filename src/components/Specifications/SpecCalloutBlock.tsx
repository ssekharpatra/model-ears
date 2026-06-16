import { type Ref } from "react";
import { type SpecCallout } from "@/lib/specs";

interface SpecCalloutBlockProps {
   callout: SpecCallout;
   variant?: "desktop" | "mobile";
   /** Optional ref for GSAP targeting of the numeric value (used in desktop scrub animation) */
   numberRef?: Ref<HTMLSpanElement>;
}

/**
 * SpecCalloutBlock — Reusable UI block for specification labels.
 * Used in both the desktop absolute layout and the mobile stacked grid layout.
 * Abstracts the typography and spacing differences.
 */
export function SpecCalloutBlock({
   callout: c,
   variant = "desktop",
   numberRef,
}: SpecCalloutBlockProps) {
   const isLeft = variant === "desktop" && c.label.dir === "l";
   const alignClass = isLeft ? "justify-end" : "justify-start";

   return (
      <>
         <div
            className={`flex items-center gap-2 ${variant === "desktop" ? alignClass : ""}`}
         >
            <span className="font-saira text-[10px] tracking-[0.3em] text-brand-orange">
               {c.index}
            </span>
            <span className="font-saira text-[10px] uppercase tracking-[0.3em] text-white/50">
               {c.name}
            </span>
         </div>

         <div
            className={`flex items-baseline gap-1 ${
               variant === "desktop" ? `mt-1 ${alignClass}` : "mt-2"
            }`}
         >
            <span
               ref={numberRef}
               className={`font-saira font-medium tabular-nums tracking-tight leading-none ${
                  variant === "desktop" ? "text-4xl lg:text-5xl" : "text-3xl"
               }`}
            >
               {/*
                * On desktop, GSAP will overwrite this value during scroll scrub.
                * On mobile, it just displays the final value.
                */}
               {Math.round(c.value)}
            </span>
            <span
               className={`font-saira font-medium text-white/70 ${
                  variant === "desktop" ? "text-sm" : "text-xs"
               }`}
            >
               {c.unit}
            </span>
         </div>

         <p
            className={`font-roboto text-[11px] leading-snug text-white/45 mt-1 ${
               variant === "desktop"
                  ? `max-w-[110px] ${isLeft ? "text-right ml-auto" : "text-left mr-auto"}`
                  : "text-left"
            }`}
         >
            {c.detail}
         </p>
      </>
   );
}
