import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ClientLayout } from '@/components/ClientLayout';

// Optimize Inter font with variable and display swap
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap', // Prevents invisible text during load
  preload: true,
  adjustFontFallback: true, // Reduces layout shift
});

// Optimize JetBrains Mono for code/mono text
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: {
    default: 'Muhammad Saad | Computer Science Student',
    template: '%s | Muhammad Saad'
  },
  description: 'Portfolio of Muhammad Saad, a Computer Science student specializing in Full Stack Development and Cybersecurity. Based in Mardan, KP.',
  keywords: ['Muhammad Saad', 'Computer Science', 'Full Stack Developer', 'Cybersecurity', 'Web Development', 'Portfolio', 'Mardan'],
  authors: [{ name: 'Muhammad Saad' }],
  creator: 'Muhammad Saad',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Muhammad Saad | Computer Science Student',
    description: 'Portfolio showcasing projects and skills in Full Stack Development and Cybersecurity',
    siteName: 'Muhammad Saad Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muhammad Saad | Full Stack Developer',
    description: 'Computer Science Student specializing in Full Stack Development and Cybersecurity',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
