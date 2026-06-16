'use client';

import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import { TEXT_REVEAL_DEFAULTS } from '@/lib/animations';

gsap.registerPlugin(SplitText);


/** Supported HTML tags for the wrapper element. */
type RevealTag = 'div' | 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface InViewOptions {
  /** Fraction of element visible before triggering (default: 0.2) */
  threshold?: number;
  /** Root margin string (default: '-80px') */
  margin?: string;
}

interface TextRevealProps {
  /** What to split the text by */
  split: 'words' | 'lines';

  /** Animation preset (default: 'blur') */
  variant?: 'blur' | 'slide-up' | 'fade';

  /** Delay between each word/line in seconds (default: 0.04 for words, 0.1 for lines) */
  stagger?: number;

  /** Duration per element in seconds (default: 0.6) */
  duration?: number;

  /** Initial delay before the stagger sequence starts, in seconds (default: 0) */
  delay?: number;

  /** Easing function (default: 'power3.out') */
  ease?: string;

  /** HTML element to render as (default: 'div') */
  as?: RevealTag;

  /** Additional className for the wrapper element */
  className?: string;

  /** Inline styles passed through to the wrapper element */
  style?: React.CSSProperties;

  /** InView options — pass object for fine-tuning, or omit for defaults */
  inView?: InViewOptions;

  /**
   * Text content to animate.
   * Must be a string or simple inline children.
   * SplitText operates on innerHTML — complex React trees will be flattened.
   */
  children: ReactNode;

  /** Callback when the full stagger sequence completes */
  onRevealComplete?: () => void;
}


function getFromVars(
  variant: NonNullable<TextRevealProps['variant']>,
): gsap.TweenVars {
  switch (variant) {
    case 'blur':
      return {
        opacity: 0,
        filter: `blur(${TEXT_REVEAL_DEFAULTS.blurRadius}px)`,
      };
    case 'slide-up':
      return {
        opacity: 0,
        y: TEXT_REVEAL_DEFAULTS.slideDistance,
      };
    case 'fade':
      return {
        opacity: 0,
      };
  }
}


/**
 * TextReveal — Word-by-word or line-by-line text reveal.
 *
 * Uses GSAP SplitText for DOM splitting and `gsap.from()` with `stagger`
 * for the animation. Triggered by IntersectionObserver (once).
 *
 * - **words**: Each word animates individually with configurable stagger
 * - **lines**: Each visual line (as rendered in the browser) animates individually
 *
 * SplitText handles accessibility automatically:
 * - Sets `aria-label` on the container with original text
 * - Sets `aria-hidden="true"` on split children
 *
 * @example
 * ```tsx
 * // Word-by-word blur reveal
 * <TextReveal split="words" variant="blur" as="h1">
 *   MODEL XRS PREMIUM
 * </TextReveal>
 *
 * // Line-by-line slide-up
 * <TextReveal split="lines" variant="slide-up" as="p">
 *   Some long paragraph that wraps across multiple lines
 * </TextReveal>
 * ```
 */
export function TextReveal({
  split,
  variant = 'blur',
  stagger,
  duration = TEXT_REVEAL_DEFAULTS.duration,
  delay = 0,
  ease = TEXT_REVEAL_DEFAULTS.ease,
  as: Tag = 'div',
  className,
  style,
  inView,
  children,
  onRevealComplete,
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Resolve default stagger based on split type
  const resolvedStagger =
    stagger ?? (split === 'words'
      ? TEXT_REVEAL_DEFAULTS.wordStagger
      : TEXT_REVEAL_DEFAULTS.lineStagger);

  // Resolve inView options
  const threshold = inView?.threshold ?? TEXT_REVEAL_DEFAULTS.inViewThreshold;
  const margin = inView?.margin ?? TEXT_REVEAL_DEFAULTS.inViewMargin;

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(el, { opacity: 1 });
        onRevealComplete?.();
        return;
      }

      let splitInstance: SplitText | null = null;
      const fromVars = getFromVars(variant);

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry && entry.isIntersecting) {
            observer.disconnect();

            splitInstance = SplitText.create(el, {
              type: split === 'words' ? 'words' : 'lines',
              // SplitText wraps each word/line in a div — mask ensures
              // slide-up text is clipped to its line box
              mask: split === 'lines' ? 'lines' : undefined,
            });

            const targets =
              split === 'words' ? splitInstance.words : splitInstance.lines;

            // Pre-set targets to initial state (invisible)
            gsap.set(targets, fromVars);

            // Set container visible now that children are split & hidden
            gsap.set(el, { opacity: 1 });

            gsap.to(targets, {
              ...Object.fromEntries(
                Object.keys(fromVars).map((key) => {
                  if (key === 'opacity') return [key, 1];
                  if (key === 'filter') return [key, 'blur(0px)'];
                  if (key === 'y') return [key, 0];
                  return [key, undefined];
                }),
              ),
              duration,
              delay,
              ease,
              stagger: resolvedStagger,
              onComplete: () => {
                // Clean up — restore original DOM and clear inline styles
                splitInstance?.revert();
                gsap.set(el, { clearProps: 'opacity' });
                onRevealComplete?.();
              },
            });
          }
        },
        {
          threshold,
          rootMargin: margin,
        },
      );

      observer.observe(el);

      return () => {
        observer.disconnect();
        splitInstance?.revert();
      };
    },
    { scope: containerRef, dependencies: [] },
  );

  return (
    <Tag
      ref={containerRef as React.RefObject<HTMLElement & HTMLDivElement>}
      className={className}
      style={{ opacity: 0, ...style }}
    >
      {children}
    </Tag>
  );
}
