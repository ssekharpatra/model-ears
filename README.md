# Model Ears — Premium Headphone Showcase

A pixel-perfect, high-performance single-page product showcase for premium headphones, built as a frontend engineering assignment for UPDOT.

**[Live Demo →](https://model-ears.vercel.app)** <!-- Update with actual deployed URL -->

---

## Tech Stack

| Technology               | Version | Why                                                                          |
| ------------------------ | ------- | ---------------------------------------------------------------------------- |
| **Next.js**              | 16      | App Router, server components, built-in image optimization, static export    |
| **React**                | 19      | Latest concurrent features, improved rendering performance                   |
| **TypeScript**           | 5       | Strict mode — zero `any` types, full type safety across components and hooks |
| **Tailwind CSS**         | 4       | `@theme` design tokens, utility-first styling, zero-runtime CSS              |
| **GSAP** + `@gsap/react` | 3.15    | Scroll-triggered reveal animations — `useGSAP` hook for React-safe cleanup   |
| **Framer Motion**        | 12      | Component-level FLIP layout animations for carousel transitions              |

### Why GSAP + Framer Motion together?

Each library excels at different things. **GSAP** handles scroll-triggered viewport animations (the "OUR RANGE" text and carousel sliding up) with fine-grained timeline control. **Framer Motion** handles React layout animations (carousel item position swapping with `layout` prop) and presence transitions (`AnimatePresence`). This split avoids fighting React's rendering model while getting best-in-class animation quality from each tool.

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build && npm start

# Lint
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## Architecture

```
src/
├── app/
│   ├── layout.tsx          # Root layout — font variables, metadata, OG tags
│   ├── page.tsx            # Home page — server component composing sections
│   └── globals.css         # Tailwind v4 @theme tokens, keyframes, base styles
├── components/
│   ├── Hero/
│   │   ├── Hero.tsx        # Section wrapper (server component)
│   │   ├── HeroBanner.tsx  # Dark banner with mouse-follow gradient
│   │   ├── HeroHeadphone.tsx # Parallax headphone overlay (GSAP quickTo)
│   │   ├── HeroInfo.tsx    # Price + Buy Now CTA panel
│   │   ├── HeroLogo.tsx    # Inline SVG crescent moon + brand name
│   │   └── HeroTitle.tsx   # Large "MODEL XRS" background text
│   ├── ProductRange/
│   │   ├── ProductRange.tsx # Section orchestrator (carousel + scroll anims)
│   │   ├── Carousel.tsx    # 3-item carousel with ghost height element
│   │   ├── CarouselItem.tsx # Individual product with Framer Motion layout
│   │   ├── CarouselNav.tsx # Active model title + prev/next arrows
│   │   ├── CarouselButton.tsx # Reusable SVG arrow button
│   │   ├── CursorFollower.tsx # Fixed-position orange tooltip with marquee
│   │   ├── OurRangeText.tsx # Decorative background text
│   │   └── ProductDescription.tsx # Centered paragraph between sections
│   └── ui/
│       └── Button.tsx      # Reusable primary button with variants support
├── hooks/
│   ├── useMousePosition.ts # rAF-throttled CSS variable updates for gradient
│   ├── useCarousel.ts      # Circular carousel state (prev/next/goTo)
│   └── useCursorFollower.ts # Lerp-based smooth cursor tracking
├── lib/
│   ├── constants.ts        # Product data, text content, animation durations
│   ├── fonts.ts            # Font loading (local Schein + Google Roboto/Saira)
│   └── animations.ts       # Reusable GSAP animation presets + ScrollTrigger config
└── types/
    └── index.ts            # Product, CarouselState, VisibleProducts interfaces
```

### Component Design Philosophy

- **Server components by default** — `Hero` and `page.tsx` are server-rendered. Only interactive children (`HeroBanner`, `HeroHeadphone`, `ProductRange`) use `'use client'`.
- **No prop drilling for static content** — Components import directly from `@/lib/constants`.
- **Hooks extract reusable logic** — Mouse tracking, carousel state, and cursor following are isolated into custom hooks with proper cleanup.

---

## Design Decisions & Trade-offs

### Font Strategy

The reference site uses "Schein Sans" — a custom display font. I sourced the OTF and converted it to **WOFF2** (81% size reduction: 76KB → 14KB). Loaded via `next/font/local` for self-hosting, automatic preloading, and zero CLS.

### Carousel Implementation

Chose Framer Motion's `layout` prop for carousel position swapping over GSAP or CSS transitions. This enables **automatic FLIP animations** — React handles the DOM reorder, Framer Motion calculates and animates the position delta. The trade-off is a slightly larger bundle, but the animation quality is significantly smoother for layout changes.

### Ghost Element Pattern

The carousel uses an invisible "ghost" element to maintain consistent height. Without it, the absolute-positioned carousel items cause the section to collapse to zero height, creating layout shift when scroll animations trigger.

### Image Optimization

- Hero headphone: `priority` for LCP optimization
- All images: proper `sizes` prop for responsive srcset selection
- AVIF format enabled in `next.config.ts` for smaller file sizes than WebP
- Carousel images: default lazy loading (below the fold)

### Animation Lock

Carousel transitions use a `useRef`-based animation lock (not `useState`) to prevent rapid clicking from causing overlapping animations. The ref avoids unnecessary re-renders that state-based locks cause.

---

## Performance Considerations

| Metric  | Target  | Approach                                                          |
| ------- | ------- | ----------------------------------------------------------------- |
| **LCP** | < 2.5s  | Hero image has `priority`, fonts use `display: swap`              |
| **CLS** | < 0.1   | Ghost element prevents carousel layout shift, fonts preloaded     |
| **TBT** | < 200ms | Server components minimize client JS, tree-shaking on GSAP/Framer |
| **FCP** | < 1.5s  | Static generation, optimized font loading                         |

### Key optimizations:

- **`will-change: transform`** on parallax wrapper and cursor follower (GPU layer promotion)
- **rAF-throttled** mouse position updates (not raw `mousemove`)
- **Cursor follower loop stops when idle** — only runs during hover + wind-down
- **`prefers-reduced-motion`** respected in both CSS and JavaScript
- **AVIF + WebP** image formats with tuned device sizes

---

## Bonus Features Implemented

1. **Parallax on hero headphone** — GSAP `quickTo` creates smooth mouse-driven parallax with 30px max movement and eased following (Tier 1)
2. **Design tokens system** — Tailwind v4 `@theme` tokens for colors, fonts, and animations. GSAP animation presets in `lib/animations.ts` (Tier 2)
3. **Reusable Button component** — Extensible with className prop for future variants (Tier 2)
4. **Keyboard navigation** — Arrow keys navigate the carousel, Enter/Space activate side items
5. **Accessibility** — Semantic HTML, ARIA labels, focus-visible styles, reduced motion support

---

## Accessibility

- Semantic HTML: `<section>`, `<nav>`, `<button>`, proper heading hierarchy
- `aria-label` on carousel section and navigation buttons
- `aria-live="polite"` on carousel container for screen reader announcements
- `aria-hidden="true"` on decorative elements (OUR RANGE text, logo SVG)
- Focus-visible orange ring (`outline: 2px solid #f67300`)
- `prefers-reduced-motion` disables all animations via CSS and GSAP
- Keyboard-navigable carousel (Arrow keys, Enter, Space)

---

_Built by Sudhansu Sekhar Patra_
