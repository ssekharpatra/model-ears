/**
 * Reusable GSAP animation presets.
 * Used with useGSAP hook — never with useEffect.
 */
export const ANIM_PRESETS = {
  /** Large slide-up fade-in (300px) — for "OUR RANGE" text and carousel */
  fadeInUp: {
    from: { opacity: 0, y: 300 },
    to: { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
  },
  /** Small slide-up fade-in (150px) — for carousel nav */
  fadeInUpSmall: {
    from: { opacity: 0, y: 150 },
    to: { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
  },
} as const;

/**
 * ScrollTrigger default config for one-time reveal animations.
 */
export const SCROLL_TRIGGER_DEFAULTS = {
  start: 'top 80%',
  toggleActions: 'play none none none',
} as const;
