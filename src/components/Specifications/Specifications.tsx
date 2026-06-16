"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useMousePosition } from "@/hooks/useMousePosition";
import {
   SPEC_CALLOUTS,
   SPEC_SECONDARY,
   SPEC_HEADING_LINE1,
   SPEC_HEADING_LINE2,
   SPEC_GHOST_WORD,
   SPEC_INTRO,
   SPEC_INTRO_MOBILE,
   type SpecCallout,
} from "@/lib/specs";
import { TextReveal } from "@/components/ui/TextReveal";

gsap.registerPlugin(ScrollTrigger);

/** Octagonal corner cut matching the hero banner. */
const PANEL_CLIP = `polygon(
  24px 0,
  calc(100% - 24px) 0,
  100% 24px,
  100% calc(100% - 24px),
  calc(100% - 24px) 100%,
  24px 100%,
  0 calc(100% - 24px),
  0 24px
)`;

/** Build an SVG path "d" string from a polyline of points. */
function toPath(points: SpecCallout["points"]): string {
   return points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");
}

interface PartRefs {
   dot: SVGCircleElement | null;
   ring: SVGCircleElement | null;
   path: SVGPathElement | null;
   label: HTMLDivElement | null;
   number: HTMLSpanElement | null;
}

/**
 * Specifications — "The Teardown".
 * A pinned, scroll-scrubbed technical schematic: the MODEL XRS sits on a dark
 * panel while orange leader lines draw themselves out to spec readouts that
 * count up. Desktop pins + scrubs; mobile reveals a stacked list; reduced
 * motion renders everything static.
 */
export function Specifications() {
   const sectionRef = useRef<HTMLElement>(null);
   const stageRef = useRef<HTMLDivElement>(null);
   const headphoneRef = useRef<HTMLDivElement>(null);
   const ghostRef = useRef<HTMLDivElement>(null);
   const railFillRef = useRef<HTMLDivElement>(null);
   const partsRef = useRef<Record<string, PartRefs>>({});

   const { handleMouseMove } = useMousePosition();

   const setPartRef =
      (id: string, key: keyof PartRefs) => (el: PartRefs[keyof PartRefs]) => {
         if (!partsRef.current[id]) {
            partsRef.current[id] = {
               dot: null,
               ring: null,
               path: null,
               label: null,
               number: null,
            };
         }
         // @ts-expect-error — key/element types align at call sites
         partsRef.current[id][key] = el;
      };

   const formatValue = (v: number) => Math.round(v).toString();

   useGSAP(
      () => {
         const parts = SPEC_CALLOUTS.map((c) => partsRef.current[c.id]);
         const allLabels = parts
            .map((p) => p?.label)
            .filter(Boolean) as HTMLDivElement[];
         const allPaths = parts
            .map((p) => p?.path)
            .filter(Boolean) as SVGPathElement[];
         const allDots = parts
            .map((p) => p?.dot)
            .filter(Boolean) as SVGCircleElement[];
         const allRings = parts
            .map((p) => p?.ring)
            .filter(Boolean) as SVGCircleElement[];

         const settleFinalNumbers = () => {
            SPEC_CALLOUTS.forEach((c) => {
               const n = partsRef.current[c.id]?.number;
               if (n) n.textContent = formatValue(c.value);
            });
         };

         const mm = gsap.matchMedia();

         // ---- Desktop: pinned, scroll-scrubbed teardown ----
         mm.add(
            "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
            () => {
               gsap.set(allLabels, { opacity: 0, y: 16 });
               gsap.set(allDots, { scale: 0, transformOrigin: "center" });
               gsap.set(allRings, {
                  scale: 0,
                  opacity: 0,
                  transformOrigin: "center",
               });
               gsap.set(allPaths, { strokeDashoffset: 1 });

               // Native `position: sticky` keeps the panel in view; we scrub the
               // timeline across the tall track. This avoids GSAP `pin`, which breaks
               // when an ancestor has `overflow-x: hidden` (it becomes a scroller).
               const tl = gsap.timeline({
                  scrollTrigger: {
                     trigger: sectionRef.current,
                     start: "top top",
                     end: "bottom bottom",
                     scrub: 1,
                  },
               });

               // Continuous tracks across the whole scrub.
               tl.fromTo(
                  headphoneRef.current,
                  { scale: 0.9, yPercent: 5, rotate: -1.5 },
                  { scale: 1.06, yPercent: -3, rotate: 1.5, ease: "none" },
                  0,
               );
               tl.fromTo(
                  ghostRef.current,
                  { xPercent: 4 },
                  { xPercent: -4, ease: "none" },
                  0,
               );

               // Sequential callout reveals.
               SPEC_CALLOUTS.forEach((c, i) => {
                  const refs = partsRef.current[c.id];
                  if (!refs) return;
                  const seg = 0.12 + i * 0.2;

                  tl.to(
                     refs.path,
                     { strokeDashoffset: 0, ease: "none", duration: 0.12 },
                     seg,
                  );
                  tl.to(
                     refs.dot,
                     { scale: 1, ease: "back.out(2)", duration: 0.06 },
                     seg,
                  );
                  tl.fromTo(
                     refs.ring,
                     { scale: 0, opacity: 0.8 },
                     {
                        scale: 2.4,
                        opacity: 0,
                        ease: "power2.out",
                        duration: 0.18,
                     },
                     seg,
                  );
                  tl.to(
                     refs.label,
                     { opacity: 1, y: 0, ease: "power2.out", duration: 0.1 },
                     seg + 0.05,
                  );

                  const counter = { v: 0 };
                  if (refs.number) refs.number.textContent = "0";
                  tl.to(
                     counter,
                     {
                        v: c.value,
                        duration: 0.1,
                        ease: "none",
                        onUpdate: () => {
                           if (refs.number)
                              refs.number.textContent = formatValue(counter.v);
                        },
                     },
                     seg + 0.05,
                  );
               });
               // Secondary spec ledger — staggered fade-in near end of scrub
               const secondaryItems = gsap.utils.toArray<HTMLElement>(
                  "[data-spec-secondary]",
               );
               if (secondaryItems.length) {
                  gsap.set(secondaryItems, { opacity: 0, y: 8 });
                  tl.to(
                     secondaryItems,
                     {
                        opacity: 1,
                        y: 0,
                        stagger: 0.06,
                        duration: 0.1,
                        ease: "power2.out",
                     },
                     0.85,
                  );
               }

               // Bottom progress bar spans the ENTIRE timeline (position 0 →
               // full duration) so it fills linearly with scroll: 0% as the scrub
               // starts, 100% exactly when the last reveal completes.
               if (railFillRef.current) {
                  tl.fromTo(
                     railFillRef.current,
                     { scaleX: 0 },
                     { scaleX: 1, ease: "none", duration: tl.duration() },
                     0,
                  );
               }

               return () => settleFinalNumbers();
            },
         );

         // ---- Desktop, reduced motion: fully drawn, static ----
         mm.add(
            "(min-width: 768px) and (prefers-reduced-motion: reduce)",
            () => {
               gsap.set(headphoneRef.current, {
                  scale: 1,
                  yPercent: 0,
                  rotate: 0,
               });
               gsap.set(allPaths, { strokeDashoffset: 0 });
               gsap.set(allDots, { scale: 1, transformOrigin: "center" });
               gsap.set(allRings, { opacity: 0 });
               gsap.set(allLabels, { opacity: 1, y: 0 });
               if (railFillRef.current)
                  gsap.set(railFillRef.current, { scaleX: 1 });
               settleFinalNumbers();
            },
         );

         // ---- Mobile: no pin, stacked list with light reveals ----
         mm.add("(max-width: 767px)", () => {
            gsap.set(allPaths, { strokeDashoffset: 0 });
            gsap.set(allDots, { scale: 1, transformOrigin: "center" });
            gsap.set(allRings, { opacity: 0 });
            settleFinalNumbers();

            gsap.from(headphoneRef.current, {
               opacity: 0,
               y: 40,
               duration: 0.9,
               ease: "power3.out",
               scrollTrigger: { trigger: stageRef.current, start: "top 80%" },
            });

            const items = gsap.utils.toArray<HTMLElement>("[data-spec-card]");
            items.forEach((item) => {
               gsap.from(item, {
                  opacity: 0,
                  y: 30,
                  duration: 0.6,
                  ease: "power2.out",
                  scrollTrigger: { trigger: item, start: "top 88%" },
               });
            });
         });

         // Recalculate trigger positions once fonts and the large webp settle —
         // critical inside slower / embedded preview frames.
         const refresh = () => ScrollTrigger.refresh();
         window.addEventListener("load", refresh);
         if (document.fonts?.ready) document.fonts.ready.then(refresh);
         const rafId = requestAnimationFrame(() =>
            requestAnimationFrame(refresh),
         );

         return () => {
            window.removeEventListener("load", refresh);
            cancelAnimationFrame(rafId);
            mm.revert();
         };
      },
      { scope: sectionRef },
   );

   return (
      <section
         ref={sectionRef}
         id="specifications-section"
         aria-label="Technical Specifications"
         className="relative w-full bg-white md:h-[360vh]"
      >
         <div className="flex justify-center py-12 md:py-0 md:sticky md:top-0 md:h-screen md:items-center">
            <div
               onMouseMove={handleMouseMove}
               className="relative w-[96%] max-w-[1920px] mx-auto flex flex-col md:h-[88vh] md:max-h-[920px] text-white overflow-hidden drop-shadow-2xl"
               style={{
                  clipPath: PANEL_CLIP,
                  background:
                     "radial-gradient(circle 900px at var(--mouse-x, 70%) var(--mouse-y, 40%), #2a1508 0%, #101010 68%, #0b0b0b 100%)",
               }}
            >
               <div
                  ref={ghostRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-[35%] md:top-1/2 -translate-y-1/2 flex justify-center select-none z-0"
               >
                  <span className="font-schein font-bold uppercase leading-none tracking-[0.02em] text-[16vw] md:text-[20vw] text-white/[0.035] whitespace-nowrap">
                     {SPEC_GHOST_WORD}
                  </span>
               </div>

               <header className="relative z-20 px-6 pt-8 md:absolute md:top-10 md:left-12 md:p-0 max-w-xl">
                  <TextReveal
                     split="words"
                     variant="blur"
                     stagger={0.06}
                     as="h2"
                     className="font-schein font-bold uppercase leading-[0.92] tracking-[0.005em] text-4xl md:text-5xl lg:text-6xl text-balance"
                  >
                     {SPEC_HEADING_LINE1} {SPEC_HEADING_LINE2}
                  </TextReveal>
                  <TextReveal
                     split="words"
                     variant="blur"
                     stagger={0.02}
                     delay={0.3}
                     as="p"
                     className="md:hidden font-roboto text-sm leading-relaxed text-white/60 mt-4 max-w-md text-pretty"
                  >
                     {SPEC_INTRO_MOBILE}
                  </TextReveal>
                  <TextReveal
                     split="words"
                     variant="blur"
                     stagger={0.02}
                     delay={0.3}
                     as="p"
                     className="hidden md:block font-roboto text-base leading-relaxed text-white/60 mt-4 max-w-md text-pretty"
                  >
                     {SPEC_INTRO}
                  </TextReveal>
               </header>

               <div
                  ref={stageRef}
                  className="relative z-10 mx-auto mt-6 w-full max-w-[440px] aspect-square md:mt-0 md:mx-0 md:max-w-none md:w-auto md:h-[72%] md:absolute md:top-[54%] md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
               >
                  <div
                     ref={headphoneRef}
                     className="absolute inset-0 z-10 will-change-transform"
                  >
                     <Image
                        src="/assets/images/headphones/model-xrs.webp"
                        alt="MODEL XRS headphones, technical schematic view"
                        fill
                        sizes="(max-width: 768px) 90vw, 680px"
                        className="object-contain"
                        priority={false}
                     />
                  </div>

                  <svg
                     viewBox="0 0 1000 1000"
                     className="hidden md:block absolute inset-0 z-20 w-full h-full pointer-events-none overflow-visible"
                     aria-hidden="true"
                  >
                     {SPEC_CALLOUTS.map((c) => (
                        <g key={c.id}>
                           <path
                              ref={setPartRef(c.id, "path")}
                              d={toPath(c.points)}
                              fill="none"
                              stroke="#f67300"
                              strokeWidth={2.5}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              pathLength={1}
                              strokeDasharray={1}
                              vectorEffect="non-scaling-stroke"
                           />
                           <circle
                              ref={setPartRef(c.id, "ring")}
                              cx={c.anchor.x}
                              cy={c.anchor.y}
                              r={9}
                              fill="none"
                              stroke="#f67300"
                              strokeWidth={2}
                              vectorEffect="non-scaling-stroke"
                           />
                           <circle
                              ref={setPartRef(c.id, "dot")}
                              cx={c.anchor.x}
                              cy={c.anchor.y}
                              r={6}
                              fill="#f67300"
                           />
                        </g>
                     ))}
                  </svg>

                  <div className="hidden md:block absolute inset-0 z-30 pointer-events-none">
                     {SPEC_CALLOUTS.map((c) => (
                        <div
                           key={c.id}
                           ref={setPartRef(c.id, "label")}
                           className={`absolute w-40 ${c.label.dir === "l" ? "text-right" : "text-left"}`}
                           style={{
                              left: `${c.label.x}%`,
                              top: `${c.label.y}%`,
                              transform: `translate(${c.label.dir === "l" ? "-100%" : "0"}, -50%)`,
                           }}
                        >
                           <div
                              className={`flex items-center gap-2 ${c.label.dir === "l" ? "justify-end" : "justify-start"}`}
                           >
                              <span className="font-saira text-[10px] tracking-[0.3em] text-brand-orange">
                                 {c.index}
                              </span>
                              <span className="font-saira text-[10px] uppercase tracking-[0.3em] text-white/50">
                                 {c.name}
                              </span>
                           </div>
                           <div
                              className={`flex items-baseline gap-1 mt-1 ${c.label.dir === "l" ? "justify-end" : "justify-start"}`}
                           >
                              <span
                                 ref={setPartRef(c.id, "number")}
                                 className="font-saira font-medium text-4xl lg:text-5xl leading-none tabular-nums tracking-tight"
                              >
                                 {formatValue(c.value)}
                              </span>
                              <span className="font-saira text-sm font-medium text-white/70">
                                 {c.unit}
                              </span>
                           </div>
                           <p className="font-roboto text-[11px] leading-snug text-white/45 mt-1">
                              {c.detail}
                           </p>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="md:hidden relative z-20 grid grid-cols-2 gap-px bg-white/10 mt-8 mx-6 rounded-sm overflow-hidden">
                  {SPEC_CALLOUTS.map((c) => (
                     <div
                        key={c.id}
                        data-spec-card
                        className="bg-[#101010] p-4"
                     >
                        <div className="flex items-center gap-2">
                           <span className="font-saira text-[10px] tracking-[0.3em] text-brand-orange">
                              {c.index}
                           </span>
                           <span className="font-saira text-[10px] uppercase tracking-[0.3em] text-white/50">
                              {c.name}
                           </span>
                        </div>
                        <div className="flex items-baseline gap-1 mt-2">
                           <span className="font-saira font-medium text-3xl leading-none tabular-nums tracking-tight">
                              {formatValue(c.value)}
                           </span>
                           <span className="font-saira text-xs font-medium text-white/70">
                              {c.unit}
                           </span>
                        </div>
                        <p className="font-roboto text-[11px] leading-snug text-white/45 mt-1">
                           {c.detail}
                        </p>
                     </div>
                  ))}
               </div>

               <div className="relative z-20 mt-8 md:mt-0 md:absolute md:bottom-0 md:inset-x-0 border-t border-white/10 px-6 md:px-12 py-4">
                  <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 md:justify-between">
                     {SPEC_SECONDARY.map((s) => (
                        <li
                           key={s.label}
                           data-spec-secondary
                           className="flex items-baseline gap-2"
                        >
                           <span className="font-saira text-[10px] uppercase tracking-[0.25em] text-white/40">
                              {s.label}
                           </span>
                           <span className="font-saira text-sm font-medium text-white/85">
                              {s.value}
                           </span>
                        </li>
                     ))}
                  </ul>
               </div>

               {/* Scrub progress bar — sits as the panel's bottom border and tracks
            the section timeline exactly (starts when the scrub begins, fills
            to 100% when it ends). */}
               <div className="absolute bottom-0 inset-x-0 h-[3px] bg-white/10 z-30">
                  <div
                     ref={railFillRef}
                     className="h-full w-full bg-brand-orange origin-left"
                     style={{ transform: "scaleX(0)" }}
                  />
               </div>
            </div>
         </div>
      </section>
   );
}
