import { Hero } from '@/components/Hero/Hero';
import { ProductRange } from '@/components/ProductRange/ProductRange';

/**
 * Home page — Single-page product showcase for Model Ears headphones.
 * Server component composing the Hero and ProductRange sections.
 */
export default function Home() {
  return (
    <main className="bg-white min-h-screen text-black m-0 p-0 flex flex-col items-center w-full overflow-x-hidden">
      <Hero />
      <ProductRange />
    </main>
  );
}
