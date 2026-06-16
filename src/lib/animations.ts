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

/**
 * Hero entrance sequence delays (seconds from page load).
 * Each act overlaps slightly with the previous for continuous motion.
 */
export const HERO_ENTRANCE = {
  banner: 0,
  bannerDur: 0.4,
  logo: 0.1,
  titleWord1: 0.3,
  titleWord2: 0.5,
  description: 0.8,
  price: 0.95,
  button: 1.1,
  headphone: 0.7,
  headphoneDur: 0.9,
} as const;

/**
 * GSAP SplitText text-reveal defaults (used by TextReveal component).
 * Tuned for word-by-word and line-by-line animations.
 */
export const TEXT_REVEAL_DEFAULTS = {
  wordStagger: 0.06,
  lineStagger: 0.12,
  duration: 0.8,
  ease: 'power2.out',
  blurRadius: 10,
  slideDistance: 20,
  inViewThreshold: 0.2,
  inViewMargin: '-80px',
} as const;
