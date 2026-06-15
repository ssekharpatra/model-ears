import type { Metadata } from 'next';
import { fontVariables } from '@/lib/fonts';
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
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
