import type { Metadata } from 'next';
import { Playfair_Display, Poppins } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'VK Creation - Photography & Videography Platform',
  description: 'Instant quotes, booking management, and project tracking.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <body
        className="bg-black text-white antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
