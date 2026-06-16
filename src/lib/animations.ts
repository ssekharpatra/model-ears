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
 * Framer Motion text-reveal defaults (used by TextReveal component).
 * Centralizes magic numbers for the blur-scale-opacity crossfade.
 */
export const TEXT_REVEAL_DEFAULTS = {
  duration: 0.7,
  ease: 'easeInOut',
  blurRadius: 12,
  scaleOffset: 0.05,
  inViewThreshold: 0.2,
  inViewMargin: '-80px',
} as const;

/**
 * Hero entrance sequence delays (seconds from page load).
 * Each act overlaps slightly with the previous for continuous motion.
 * Total sequence: ~2.8s — cinematic but not sluggish.
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
