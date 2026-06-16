'use client';

import {
  memo,
  useRef,
  useMemo,
  type ReactNode,
} from 'react';
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  type Transition,
  type Easing,
} from 'framer-motion';
import { TEXT_REVEAL_DEFAULTS } from '@/lib/animations';

// ─── Types ────────────────────────────────────────────────────

interface InViewOptions {
  /** Fraction of element visible before triggering (default: 0.2) */
  threshold?: number;
  /** Root margin — negative values trigger earlier (default: '-80px') */
  margin?: string;
}

/** Supported HTML tags for the `as` prop. */
type RevealTag = 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface TextRevealProps {
  // ─── Trigger Mode (pick one) ───────────────────────────────

  /** Key-change mode: triggers crossfade animation when this value changes */
  revealKey?: string | number;

  /**
   * In-view mode: triggers reveal when element scrolls into viewport.
   * Pass `true` for defaults, or an options object for fine-tuning.
   */
  inView?: boolean | InViewOptions;

  // ─── Animation Config ──────────────────────────────────────

  /** Animation preset (default: 'blur') */
  variant?: 'blur' | 'slide-up' | 'slide-down' | 'fade';

  /** Duration in seconds (default: 0.7) */
  duration?: number;

  /** Easing function (default: 'easeInOut') */
  ease?: Easing;

  /** Blur radius in px for the blur variant (default: 12) */
  blurRadius?: number;

  /** Scale offset for enter/exit — 0.05 means 1.05→1→0.95 (default: 0.05) */
  scaleOffset?: number;

  /** Delay before animation starts, in seconds (default: 0) */
  delay?: number;

  // ─── Rendering ─────────────────────────────────────────────

  /** AnimatePresence mode — only used in key-change mode (default: 'popLayout') */
  mode?: 'popLayout' | 'wait' | 'sync';

  /** HTML element to render as (default: 'span') */
  as?: RevealTag;

  /** Additional className */
  className?: string;

  /** Enable Framer Motion layout animation (default: true for key-change, false for in-view) */
  layout?: boolean;

  /** Content to animate */
  children: ReactNode;

  /** Callback fired when reveal/enter animation completes */
  onRevealComplete?: () => void;
}

// ─── Pre-built Motion Components ──────────────────────────────
// Created at module level to avoid React's "no component creation during
// render" rule. Each supported `as` tag maps to its motion equivalent.

const MOTION_TAGS = {
  span: motion.span,
  div: motion.div,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
} as const;

// ─── Variant Builders ─────────────────────────────────────────

function buildVariants(
  variant: NonNullable<TextRevealProps['variant']>,
  blurRadius: number,
  scaleOffset: number,
) {
  switch (variant) {
    case 'blur':
      return {
        initial: { opacity: 0, filter: `blur(${blurRadius}px)`, scale: 1 + scaleOffset },
        animate: { opacity: 1, filter: 'blur(0px)', scale: 1 },
        exit: { opacity: 0, filter: `blur(${blurRadius}px)`, scale: 1 - scaleOffset },
      };
    case 'slide-up':
      return {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
      };
    case 'slide-down':
      return {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
      };
    case 'fade':
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };
  }
}

// ─── Sub-components ───────────────────────────────────────────

/**
 * KeyChangeReveal — AnimatePresence-based crossfade on key change.
 * Used for dynamic content swaps (e.g., carousel model name).
 */
function KeyChangeReveal({
  revealKey,
  variants,
  transition,
  mode,
  tag,
  layout,
  className,
  children,
  onRevealComplete,
}: {
  revealKey: string | number;
  variants: ReturnType<typeof buildVariants>;
  transition: Transition;
  mode: 'popLayout' | 'wait' | 'sync';
  tag: RevealTag;
  layout: boolean;
  className?: string;
  children: ReactNode;
  onRevealComplete?: () => void;
}) {
  const MotionTag = MOTION_TAGS[tag];

  return (
    <AnimatePresence mode={mode}>
      <MotionTag
        key={revealKey}
        layout={layout}
        initial={variants.initial}
        animate={variants.animate}
        exit={variants.exit}
        transition={transition}
        onAnimationComplete={onRevealComplete}
        className={className}
      >
        {children}
      </MotionTag>
    </AnimatePresence>
  );
}

/**
 * InViewReveal — One-shot viewport-triggered reveal.
 * Uses native IntersectionObserver via Framer Motion's useInView.
 */
function InViewReveal({
  inViewOpts,
  variants,
  transition,
  tag,
  className,
  children,
  onRevealComplete,
}: {
  inViewOpts: InViewOptions;
  variants: ReturnType<typeof buildVariants>;
  transition: Transition;
  tag: RevealTag;
  className?: string;
  children: ReactNode;
  onRevealComplete?: () => void;
}) {
  // Ref needs to be typed broadly for useInView (IntersectionObserver) while
  // satisfying each specific motion element's ref prop. The cast is safe —
  // IO only needs Element, which all HTML elements satisfy.
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    amount: inViewOpts.threshold ?? TEXT_REVEAL_DEFAULTS.inViewThreshold,
    margin: (inViewOpts.margin ?? TEXT_REVEAL_DEFAULTS.inViewMargin) as
      `${number}px`,
  });

  const MotionTag = MOTION_TAGS[tag];

  return (
    <MotionTag
      ref={ref}
      initial={variants.initial}
      animate={isInView ? variants.animate : variants.initial}
      transition={transition}
      onAnimationComplete={isInView ? onRevealComplete : undefined}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

// ─── Main Component ───────────────────────────────────────────

/**
 * TextReveal — Global animation container for text reveals.
 *
 * Two trigger modes:
 * 1. **Key-change** (`revealKey`): blur-scale-opacity crossfade when content changes.
 * 2. **In-view** (`inView`): one-shot reveal when element scrolls into viewport.
 *
 * Both modes share the same animation variants and automatically respect
 * `prefers-reduced-motion`. Uses Framer Motion exclusively — no GSAP dependency.
 *
 * @example
 * ```tsx
 * // Key-change mode (carousel model name)
 * <TextReveal revealKey={modelName} variant="blur">{modelName}</TextReveal>
 *
 * // In-view mode (section title)
 * <TextReveal inView variant="blur" as="h2">THE TEARDOWN</TextReveal>
 * ```
 */
export const TextReveal = memo(function TextReveal({
  revealKey,
  inView,
  variant = 'blur',
  duration = TEXT_REVEAL_DEFAULTS.duration,
  ease = TEXT_REVEAL_DEFAULTS.ease as Easing,
  blurRadius = TEXT_REVEAL_DEFAULTS.blurRadius,
  scaleOffset = TEXT_REVEAL_DEFAULTS.scaleOffset,
  delay = 0,
  mode = 'popLayout',
  as = 'span',
  className,
  layout,
  children,
  onRevealComplete,
}: TextRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  // Compute animation variants — memoized to avoid re-creation per render
  const variants = useMemo(
    () => buildVariants(variant, blurRadius, scaleOffset),
    [variant, blurRadius, scaleOffset],
  );

  // Shared transition config
  const transition = useMemo<Transition>(
    () => ({
      duration: prefersReducedMotion ? 0 : duration,
      ease,
      ...(delay > 0 && !prefersReducedMotion ? { delay } : {}),
      ...(layout !== false && revealKey !== undefined
        ? {
            layout: {
              type: 'tween' as const,
              duration: prefersReducedMotion ? 0 : duration,
              ease,
            },
          }
        : {}),
    }),
    [duration, ease, delay, prefersReducedMotion, layout, revealKey],
  );

  // Reduced motion: render immediately, no animation
  if (prefersReducedMotion && inView) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  // ── Key-change mode ──
  if (revealKey !== undefined) {
    return (
      <KeyChangeReveal
        revealKey={revealKey}
        variants={variants}
        transition={transition}
        mode={mode}
        tag={as}
        layout={layout !== false}
        className={className}
        onRevealComplete={onRevealComplete}
      >
        {children}
      </KeyChangeReveal>
    );
  }

  // ── In-view mode ──
  if (inView) {
    const inViewOpts: InViewOptions =
      typeof inView === 'object' ? inView : {};

    return (
      <InViewReveal
        inViewOpts={inViewOpts}
        variants={variants}
        transition={transition}
        tag={as}
        className={className}
        onRevealComplete={onRevealComplete}
      >
        {children}
      </InViewReveal>
    );
  }

  // ── No trigger — static render ──
  const Tag = as;
  return <Tag className={className}>{children}</Tag>;
});
