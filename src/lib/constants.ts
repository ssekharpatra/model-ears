import { Product } from "@/types";

/**
 * Product data — ordered for carousel display.
 * Index 0 = default active (center), circular rotation.
 */
export const PRODUCTS: Product[] = [
   {
      id: "model-sky",
      name: "MODEL SKY",
      image: "/assets/images/headphones/model-sky.webp",
      alt: "Model SKY headphones in soft blue",
   },
   {
      id: "model-xrs",
      name: "MODEL SYMPHONY",
      image: "/assets/images/headphones/model-xrs.webp",
      alt: "Model Symphony premium headphones with chrome accents",
   },
   {
      id: "model-ssr",
      name: "MODEL OBSIDIAN",
      image: "/assets/images/headphones/model-ssr.webp",
      alt: "Model Obsidian wireless headphones in dark gray",
   },
];

/** Hero section text content */
export const HERO_DESCRIPTION =
   "Lorem ipsum linus Karlsson Alexandra Sjöberg i Signe Björk, Michael Jonsson. Viktor Blom Alexander Engström. Adam Gustavsson Astrid Lindgren. Adam Sundberg Viola Nyberg.";

export const HERO_PRICE = "$169.99";

export const HERO_TITLE_LINE1 = "MODEL";
export const HERO_TITLE_LINE2 = "XRS";

export const BRAND_NAME = "MODEL EARS";

/** Cursor follower tooltip text */
export const CURSOR_TOOLTIP_TEXT = "Check this out. ";

/** Animation duration presets (ms) */
export const ANIMATION = {
   carouselTransition: 500,
   hoverTransition: 300,
   titleCrossfade: 150,
   tooltipFade: 300,
   scrollRevealDuration: 1,
   scrollRevealStagger: 0.2,
} as const;
