import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import AppHeader from '@/components/layout/header';
import AppFooter from '@/components/layout/footer';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'Sanity Stream',
  description: 'A React app powered by the Sanity CMS for real-time content updates and AI summarization.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <AppHeader />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <AppFooter />
        <Toaster />
      </body>
    </html>
  );
}
