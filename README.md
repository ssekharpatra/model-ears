# Model Ears — Premium Headphone Showcase

A pixel-perfect, high-performance single-page product showcase for premium headphones, built as a frontend engineering assignment for UPDOT.

**[Live Demo →](https://model-ears.vercel.app)**

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
| **Lenis**                | 1.3     | High-performance smooth scrolling synced natively with the GSAP ticker       |

### Why GSAP + Framer Motion together?

Each library excels at different things. **GSAP** handles scroll-triggered viewport animations, complex scroll-scrubbing timelines, and text splitting with fine-grained control. **Framer Motion** handles React layout animations (carousel item position swapping with `layout` prop) and presence transitions. This split avoids fighting React's rendering model while getting best-in-class animation quality from each tool.

---

## Major Engineering Features

### 1. Unified Animation Loop (Lenis + GSAP)

To avoid the classic 1–2 frame jitter caused by running dual `requestAnimationFrame` loops, Lenis's internal RAF loop is explicitly disabled (`autoRaf: false`). Instead, Lenis is driven directly by GSAP's global ticker (`gsap.ticker.add`), resulting in a single, perfectly synced animation loop across all scroll and transform updates.

### 2. The Teardown Schematic (Specifications)

A complex "Apple-style" product teardown section built using pure GSAP and SVG.

- **Sticky vs. Pin:** Uses native `position: sticky` to keep the panel in view rather than GSAP's `pin`, avoiding layout breakage when ancestors have `overflow-x: hidden`.
- **Scroll Scrubbing:** A single GSAP timeline scrubs directly with scroll progress. As the user scrolls, SVG leader lines are drawn (`strokeDashoffset`), pulsing rings expand, and specification numbers rapidly count up to their exact values simultaneously.

### 3. Scroll Reversal Prevention

A conscious design decision was made to prevent jarring re-animations when a user scrolls back up the page. Scroll-triggered animations use `toggleActions: 'play none none none'` or `IntersectionObserver` (which immediately disconnects upon intersection) to guarantee one-time, premium reveals.

### 4. Reusable Text Reveal Component

Created a highly reusable `<TextReveal>` component leveraging GSAP's `SplitText`.

- **Performance:** Uses `IntersectionObserver` instead of heavy scroll listeners to trigger animations.
- **Flexibility:** Supports splitting by `words` or `lines`, with configurable stagger, delays, and animation variants (blur, slide-up, fade).

### 5. Battery & CPU Optimization

The custom `useCursorFollower` hook uses a custom `requestAnimationFrame` loop with linear interpolation (`lerp`) for perfectly smooth tracking. However, it implements strict **wind-down logic**: the loop completely halts when the cursor stops moving or leaves the carousel area, ensuring zero idle CPU usage.

### 6. Developer Experience (DX)

The codebase underwent a rigorous comment review process. Visual noise and redundant explanations of obvious React lifecycle hooks were completely removed. Comments left behind are strictly focused on the **why** (e.g., explaining workaround logic for stale closures, animation locking, or browser rendering quirks) and architectural JSDocs to radically improve onboarding speed.

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
│   ├── Specifications/
│   │   └── Specifications.tsx # Pinned teardown schematic with scroll scrubbing
│   ├── providers/
│   │   └── SmoothScrollProvider.tsx # Lenis integration synced with GSAP ticker
│   └── ui/
│       ├── Button.tsx      # Reusable primary button with variants support
│       └── TextReveal.tsx  # IntersectionObserver-triggered SplitText animation
├── hooks/
│   ├── useMousePosition.ts # rAF-throttled CSS variable updates for gradient
│   ├── useCarousel.ts      # Circular carousel state (prev/next/goTo)
│   └── useCursorFollower.ts # Lerp-based smooth cursor tracking with auto-halt
├── lib/
│   ├── constants.ts        # Product data, text content, animation durations
│   ├── fonts.ts            # Font loading (local Schein + Google Roboto/Saira)
│   ├── specs.ts            # Schematic callout coordinate data
│   └── animations.ts       # Reusable GSAP animation presets + ScrollTrigger config
└── types/
    └── index.ts            # Product, CarouselState, VisibleProducts interfaces
```

### Component Design Philosophy

- **Server components by default** — `Hero` and `page.tsx` are server-rendered. Only interactive children (`HeroBanner`, `HeroHeadphone`, `ProductRange`, `Specifications`) use `'use client'`.
- **No prop drilling for static content** — Components import directly from `@/lib/constants` and `@/lib/specs`.
- **Hooks extract reusable logic** — Mouse tracking, carousel state, and cursor following are isolated into custom hooks with proper cleanup.

---

## Design Decisions & Trade-offs

### Font Strategy

The reference site uses "Schein Sans" — a custom display font. I sourced the OTF and converted it to **WOFF2** (81% size reduction: 76KB → 14KB). Loaded via `next/font/local` for self-hosting, automatic preloading, and zero CLS.

### Carousel Implementation

Chose Framer Motion's `layout` prop for carousel position swapping over GSAP or CSS transitions. This enables **automatic FLIP animations** — React handles the DOM reorder, Framer Motion calculates and animates the position delta. The trade-off is a slightly larger bundle, but the animation quality is significantly smoother for layout changes.

### Initial Specifications Animation Plan (Trade-off)

My original goal for "The Teardown" section was to create a scroll-driven, cinematic exploded view of the headphones in a true Awwwards-winning style. Instead of rendering heavy WebGL in the browser, the plan was to pre-render a 3D exploded view video, extract it into a highly compressed image sequence, and draw the frames to an HTML5 `<canvas>`. By mapping the image sequence index directly to the GSAP ScrollTrigger progress, it would simulate a flawless, high-fidelity 3D explosion with maximum performance and zero frame drops.

However, given the time constraints of the assignment (specifically regarding the 3D rendering pipeline and extracting optimized assets), I made a pragmatic engineering trade-off. I pivoted to the current implementation: a highly polished 2D SVG schematic with scroll-scrubbed leader lines and synchronized number counting. This ensured the section still felt incredibly premium and technically impressive while guaranteeing perfect performance and shipping within the deadline.

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

The application was built from the ground up with strict performance budgets in mind, achieving a near-perfect Lighthouse score across both Desktop and Mobile environments:

| Metric             |  Desktop  |  Mobile   |
| :----------------- | :-------: | :-------: |
| **Performance**    | 98+ / 100 | 98+ / 100 |
| **Accessibility**  | 94+ / 100 | 94+ / 100 |
| **Best Practices** | 100 / 100 | 100 / 100 |
| **SEO**            | 100 / 100 | 100 / 100 |

### Core Web Vitals Targets

| Metric  | Target  | Approach                                                          |
| ------- | ------- | ----------------------------------------------------------------- |
| **LCP** | < 2.5s  | Hero image has `priority`, fonts use `display: swap`              |
| **CLS** | < 0.1   | Ghost element prevents carousel layout shift, fonts preloaded     |
| **TBT** | < 200ms | Server components minimize client JS, tree-shaking on GSAP/Framer |
| **FCP** | < 1.5s  | Static generation, optimized font loading                         |

### Key optimizations:

- **Unified Animation Loop** via GSAP ticker + Lenis.
- **`will-change: transform`** on parallax wrapper and cursor follower (GPU layer promotion).
- **rAF-throttled** mouse position updates (not raw `mousemove`).
- **Cursor follower loop stops when idle** — only runs during hover + wind-down.
- **AVIF + WebP** image formats with tuned device sizes.

---

## Accessibility

- Semantic HTML: `<section>`, `<nav>`, `<button>`, proper heading hierarchy
- `aria-label` on carousel section and navigation buttons
- `aria-live="polite"` on carousel container for screen reader announcements
- `aria-hidden="true"` on decorative elements (OUR RANGE text, logo SVG)
- Focus-visible orange ring (`outline: 2px solid #f67300`)
- **`prefers-reduced-motion` deeply integrated**: Explicitly checked via `window.matchMedia` across all GSAP timelines and component hooks to instantaneously show final states without animation for users who prefer reduced motion.
- Keyboard-navigable carousel (Arrow keys, Enter, Space)

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

_Built by Sudhansu Sekhar Patra_
