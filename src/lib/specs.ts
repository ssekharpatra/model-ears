/**
 * Specifications ("The Teardown") section data.
 *
 * Coordinate system for callouts:
 * - The headphone render (model-xrs.webp) is square (1024×1024), so the
 *   schematic stage is a square. All geometry is expressed in a 0–1000
 *   viewBox space that maps 1:1 onto that square via percentages.
 * - `anchor`     → the pulsing node placed ON the product (svg units).
 * - `points`     → polyline the orange leader line draws itself along
 *                  (svg units), from the anchor out to the label.
 * - `label`      → where the HTML label block is pinned, in percent of the
 *                  stage, plus the direction it extends ('r' = rightward,
 *                  'l' = leftward / right-aligned text).
 *
 * Values are realistic premium-headphone placeholders — edit freely.
 */

export type CalloutDir = "r" | "l";

export interface SpecCallout {
   id: string;
   index: string;
   /** Part / spec name, e.g. "DRIVER" */
   name: string;
   /** Numeric target the readout counts up to */
   value: number;
   /** Unit shown after the number, e.g. "MM" */
   unit: string;
   /** Supporting one-liner */
   detail: string;
   /** Pulsing node position, svg 0–1000 space */
   anchor: { x: number; y: number };
   /** Leader-line polyline, svg 0–1000 space */
   points: Array<{ x: number; y: number }>;
   /** Label placement, percent of stage */
   label: { x: number; y: number; dir: CalloutDir };
}

export const SPEC_HEADING_LINE1 = "ENGINEERED";
export const SPEC_HEADING_LINE2 = "TO THE DETAIL";
export const SPEC_GHOST_WORD = "ANATOMY";
export const SPEC_INTRO =
   "Every millimeter accounted for. Scroll to trace the MODEL SYMPHONY and watch each figure resolve into the engineering behind the sound.";

export const SPEC_INTRO_MOBILE =
   "Every millimeter accounted for. Explore the MODEL SYMPHONY — each figure tells the story of the engineering behind the sound.";

export const SPEC_CALLOUTS: SpecCallout[] = [
   {
      id: "driver",
      index: "01",
      name: "Driver",
      value: 40,
      unit: "MM",
      detail: "Beryllium-coated dynamic driver",
      anchor: { x: 662, y: 715 },
      points: [
         { x: 662, y: 715 },
         { x: 845, y: 715 },
         { x: 872, y: 748 },
      ],
      label: { x: 88, y: 75, dir: "r" },
   },
   {
      id: "battery",
      index: "02",
      name: "Battery",
      value: 38,
      unit: "HRS",
      detail: "Continuous playback, ANC active",
      anchor: { x: 560, y: 96 },
      points: [
         { x: 560, y: 96 },
         { x: 560, y: 60 },
         { x: 658, y: 60 },
      ],
      label: { x: 67, y: 6, dir: "r" },
   },
   {
      id: "isolation",
      index: "03",
      name: "Isolation",
      value: -42,
      unit: "DB",
      detail: "Adaptive active noise cancellation",
      anchor: { x: 372, y: 690 },
      points: [
         { x: 372, y: 690 },
         { x: 150, y: 640 },
         { x: 96, y: 604 },
      ],
      label: { x: 9, y: 60, dir: "l" },
   },
   {
      id: "range",
      index: "04",
      name: "Range",
      value: 10,
      unit: "M",
      detail: "Bluetooth 5.3 wireless range",
      anchor: { x: 775, y: 470 },
      points: [
         { x: 775, y: 470 },
         { x: 880, y: 470 },
         { x: 880, y: 396 },
      ],
      label: { x: 91, y: 38, dir: "r" },
   },
];

/** Secondary specs shown in the bottom ledger strip (no callout lines). */
export const SPEC_SECONDARY: Array<{ label: string; value: string }> = [
   { label: "Impedance", value: "32 Ω" },
   { label: "Sensitivity", value: "110 dB" },
   { label: "Frequency", value: "20Hz–40kHz" },
   { label: "Weight", value: "280 g" },
   { label: "Charging", value: "USB-C" },
   { label: "Warranty", value: "2 Years" },
];
