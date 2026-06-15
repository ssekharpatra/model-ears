import localFont from 'next/font/local';
import { Roboto, Saira } from 'next/font/google';

/**
 * Schein Sans — Display font for headings, titles, navigation.
 * Converted from OTF to WOFF2 for 81% size reduction.
 * Loaded via next/font/local for self-hosting, preloading, and zero CLS.
 */
export const scheinSans = localFont({
  src: '../../public/assets/fonts/ScheinSans.woff2',
  variable: '--font-schein-sans',
  display: 'swap',
  preload: true,
});

/**
 * Roboto — Body/description text.
 * Only weight 400 needed per reference.
 */
export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-roboto',
  display: 'swap',
});

/**
 * Saira — Price and button text.
 * Weights 400 and 500 needed per reference.
 */
export const saira = Saira({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-saira',
  display: 'swap',
});

/** Combined class string for applying all font CSS variables to the root element */
export const fontVariables = `${scheinSans.variable} ${roboto.variable} ${saira.variable}`;
