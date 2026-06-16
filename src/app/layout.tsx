import type { Metadata } from 'next';
import { fontVariables } from '@/lib/fonts';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Model XRS - Model Ears',
  description:
    'Discover the Model XRS premium headphones by Model Ears. Exceptional sound quality, crafted design, and unmatched comfort.',
  openGraph: {
    title: 'Model XRS - Model Ears',
    description:
      'Discover the Model XRS premium headphones by Model Ears. Exceptional sound quality, crafted design.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontVariables} antialiased`}>
      <body suppressHydrationWarning>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
